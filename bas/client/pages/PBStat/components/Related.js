import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';
import {saveAs} from 'file-saver';
import ajaxs from '../../../utils/ajax';

import {actions} from '../../../stores/pbStat/related';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import moment from 'moment/moment';
import {setColWidths} from '../../../handontableConfig';
import columns from '../../../utils/hotColsDef'
import ReactDOM from 'react-dom';
import { caseBreakpoints, peerNumTagRenders } from '../../../utils/hotRenders';

let topValue = 0,// 上次滚动条到顶部的距离
  interval = null; // 定时器

class Related extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: [
        '本方号码',
        '号码标注',
        '标签',
        '职务',
        '中心度',
        '语音',
        '联系天数',
        'sms',
        '主叫',
        '被叫',
        '呼转',
        '私人',
        '工作',
        '5分钟以上',
        '21时后',
        '通话时间',
        '平均时长',
        '时间分割',
        '首次',
        '最后',
      ],
      criteria: {},
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        fixedColumnsLeft: 2,
        manualColumnResize: true,
        manualRowResize: true,
        viewportColumnRenderingOffset: 70,
        columns:columns.related,
        afterScrollVertically: () => {
          if(interval == null) {
            interval = setInterval(() => {
              this.isStopScroll(this.props.num, this.fetchCol.bind(this))
            }, 1000);
          }
          topValue = document.querySelector('#relatedExcel .wtHolder').scrollTop
          this.isScrolling = true;
        },
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        beforeColumnSort: (currentSortConfig, destinationSortConfigs) => {
          this.firstFetch = true;
          this.colMap = {}
        },
        afterColumnResize: () => {
          this.firstFetch = true;
          this.colMap = {}
          this.fetchCol(this.props.num)
          this.firstFetch = false
        },
        afterViewportRowCalculatorOverride: (c) => {
          this.viewData = c;
        },
        afterRender: (afterRender) => {
          if (afterRender) {
            if (this.firstFetch) {
              this.fetchCol(this.props.num)
              this.firstFetch = false
            }
          }
        },
        afterRenderer: (td, row, col, prop, value, cellProperties) => {
          this.hot = cellProperties.instance;
          if (col === 3) {
            td.innerHTML = `<div id=${this.props.num}${row} style="background: #eee; width: 100%; height: 80%"></div>`;
            if (value && !isNaN(value)) {
              if (this.colMap[row + '3']) {
                td.style.background = '#fff';
                td.innerHTML = `<span>${this.colMap[row + '3']}</span>`;
              }
            } else {
              td.innerHTML = '';
            }
          }
          if (prop === 'breakpoints') {
            if (this.hot.getDataAtRowProp(row, 'owner_num')) {
              td.innerHTML = `<div id=${this.props.num + row + 'breakpoints'} style="background: #eee; width: 100%; height: 80%"></div>`;
            }
          }
        },
      },
      drilldownOptions: {
        '中心度': ['owner_num'],
        '联系天数': ['owner_num', 'peer_num'],
        '语音': ['owner_num', 'peer_num', {bill_type: '1'}],
        'sms': ['owner_num', 'peer_num', {bill_type: '2'}],
        '主叫': ['owner_num', 'peer_num', {comm_direction: '11'}],
        '被叫': ['owner_num', 'peer_num', {comm_direction: '12'}],
        '呼转': ['owner_num', 'peer_num', {comm_direction: '13'}],
        '私人': ['owner_num', 'peer_num', {time_class: '0'}],
        '工作': ['owner_num', 'peer_num', {time_class: '1'}],
        '5分钟以上': ['owner_num', 'peer_num', {duration_class: ['>=', ['5']]}],
        '21时后': ['owner_num', 'peer_num', {started_hour_class: ['>=', ['17']]}],

      },
      relatedData: null,
      relatedList: [],
      isLoading: false
    };
    this.domArr = [];
    this.colMap = {};
    this.firstFetch = true
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  isStopScroll = (id, cb) => {
    // 判断此刻到顶部的距离是否和1秒前的距离相等
    const t1 = document.querySelector(`#relatedExcel .wtHolder`) && document.querySelector(`#relatedExcel .wtHolder`).scrollTop;
    if (t1 == topValue) {
      this.isScrolling = false;
      console.log('停止滚动了');
      clearInterval(interval);
      interval = null;
      cb(id);
    }
  }

  async fetchCol(id) {
    let startRow = this.viewData.startRow;
    let endRow = this.viewData.endRow;
    for (let i = startRow; i <= endRow; i++) {
      const d = this.hot.getDataAtRow(i);
      if (d[3]) {
        ajaxs.get(`/citizens/${d[3]}/position`).then(res => {
          if (res.meta.success) {
            const myTd = document.getElementById(`${this.props.num}${i}`);
            if (myTd) {
              myTd.style.background = '#fff';
              myTd.innerHTML = `<span>${res.data.position || ''}</span>`;
              this.colMap[i + '3'] = res.data.position || '';
            }
          }
        })
      }
      if (d[0]) {
        const criteria = JSON.parse(JSON.stringify(this.state.criteria));
        const peer_num = ['IN', [this.hot.getDataAtRowProp(i, 'peer_num')]];
        criteria.peer_num = peer_num;
        criteria.owner_num = d[0];
        caseBreakpoints(this.props.caseId, criteria, i, id).then(dom => {
          if (dom) {
            this.domArr.push(dom);
          }
        })
      }
    }
  }
  unmountCompsOnDoms = () => {
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
  };

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('related'), 'light');
    this.initC3(myChart);
    if (this.props.criteria) {
      this.fetchData(this.props.criteria, this.props.num, {limit: 30});
    }
    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(this.state.colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting})
  }

  componentWillUnmount() {
    this.firstFetch = true
    this.unmountCompsOnDoms();
  }


  initC3(myChart) {
    this.setState({
      myChart,
    });
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          textStyle: {
            color: '#fff',
          },

        },
      },
      grid: {
        borderWidth: 0,
        top: 110,
        bottom: 95,
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        x: '4%',
        top: '8px',
        textStyle: {
          color: '#90979c',
        },
        data: [],
      },


      calculable: true,
      xAxis: [{
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#90979c',
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        axisLabel: {
          interval: 0,

        },
        data: [],
      }],
      yAxis: [{
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#90979c',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,

        },
        splitArea: {
          show: false,
        },

      }],
      // dataZoom: [{
      //   show: true,
      //   height: 30,
      //   xAxisIndex: [
      //     0,
      //   ],
      //   bottom: 30,
      //   start: 0,
      //   end: 10,
      //   handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      //   handleSize: '110%',
      //   handleStyle: {
      //     color: '#ccc',
      //
      //   },
      //   textStyle: {
      //     color: '#fff',
      //   },
      //   borderColor: '#444a4f',
      // },
      // {
      //   type: 'inside',
      //   show: true,
      //   height: 15,
      //   start: 1,
      //   end: 35,
      // }],
      series: [{
        name: '次数',
        type: 'bar',
        barMaxWidth: 35,
        barGap: '10%',
        itemStyle: {
          normal: {
            color: 'rgba(255,144,128,1)',
            label: {
              show: true,
              textStyle: {
                color: '#fff',
              },
              position: 'insideTop',
              // formatter(p) {
              //   return p.value > 0 ? (p.value) : '';
              // },
            },
          },
        },
        data: [],
      },
      ],
    };
    window.addEventListener('resize', () => {
      if (this.state.isChart) {
        myChart.resize();
      }
    });
    myChart.setOption(option);
  }

  handleChart(bool) {
    this.setState({
      isChart: bool,
    });
  }

  getImgURL() {
    downloadIamge(this.state.myChart, '对方号码');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-peernumexclusioncondition.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params, num) {
    this.setState({
      isLoading: true
    })
    ajaxs.get(`/cases/${this.props.caseId}/pbills/${num}/related`).then(res => {
      if (res.meta && res.meta.success) {
        this.setState({
          relatedData: this.formatRelated(res.data),
          isLoading: false
        })
      }
    })
  }

  formatRelated(data) {
    const map = {},
      arr = [],
      arr2 = [];

    for (let i = 0; i < data.length; i++) {
      let ai = {};
      const tempArr = [];
      for (let j = 0; j < data[i].length; j++) {
        const a2 = data[i][j];
        ai = {...ai, ...a2};
      }
      arr2.push(ai);

      // if (!map[ai.owner_num]) {
      //   tempArr[0] = ai.owner_num;
      //   tempArr[1] = ai.owner_cname;
      //   tempArr[2] = ai['标签'];
      //   tempArr[3] = ai['职务'];
      //   tempArr[4] = ai.num_connection;
      //   tempArr[5] = ai.call_count;
      //   tempArr[6] = ai.online_days;
      //   tempArr[7] = ai.sms_count;
      //   tempArr[8] = ai['主叫'];
      //   tempArr[9] = ai['<--'];
      //   tempArr[10] = ai['呼转'];
      //   tempArr[11] = ai.private_time_count;
      //   tempArr[12] = ai.work_time_count;
      //   tempArr[13] = ai.more_than_5_count;
      //   tempArr[14] = ai.after_21_count;
      //   tempArr[15] = ai.total_duration;
      //   tempArr[16] = ai['平均时长'];
      //   tempArr[17] = ai['时间分割'];
      //   tempArr[18] = ai.first_day;
      //   tempArr[19] = ai.last_day;
      //   arr2.push(tempArr);
      //   map[ai.owner_num] = ai;
      // } else {
      //
      // }
    }
    if (data.length > 0 && arr2.length < 15) {
      let l = 15 - arr2.length;
      for (let j = 0; j < l; j++) {
        arr2.push({});
      }
    }
    return arr2;
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.num && nextProps.criteria && JSON.stringify(nextProps.criteria) !== JSON.stringify(this.state.criteria)) {
      this.fetchData(nextProps.criteria, nextProps.num);
      this.setState({
        criteria: nextProps.criteria,
      });
    } else if (!nextProps.title && nextProps.search.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.search.criteria)) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: JSON.parse(JSON.stringify(nextProps.search.criteria)),
      });
    }
    if (nextProps.relatedList && nextProps.relatedList !== this.state.relatedList) {
      this.setState({
        relatedList: nextProps.relatedList
      })
    }
  }

  numLabelRender = (arr, num) => {
    let dom = null;
    let n = null;
    Array.isArray(arr) && arr.forEach(item => {
      if (item.num === num) {
        dom = `<div style="background: ${item.label_bg_color}; color: #fff; text-align: center">${item.label}</div>`;
        n = item;
      }
    });
    return {
      dom,
      num: n,
    };
  };

  cellRender(instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = '';
    td.style.textAlign = 'center';
    if (value) {
      td.innerHTML = value
    }
    if (col === 1) {
      const ownerNum = instance.getDataAtCell(row, 0);
      if (ownerNum) {
        const result = this.numLabelRender(this.props.LargItems, ownerNum);
        if (result.dom) {
          td.innerHTML = result.dom;
        } else if (value) {
          td.innerHTML = value;
          td.style.textAlign = 'center';
        }
      }
    } else if (col === 2) {
      td.style.width = '100px';
      let newVal = [];
      const ownerNum = instance.getDataAtCell(row, 0);
      const tags = this.numLabelRender(this.props.LargItems, ownerNum);
      if (tags.num) {
        if (tags.num.label_groups) {
          newVal = newVal.concat(tags.num.label_groups)
        }
        if (tags.num.ptags) {
          if (typeof tags.num.ptags === 'string') {
            newVal = newVal.concat(JSON.parse(tags.num.ptags));
          } else {
            newVal = newVal.concat(tags.num.ptags);
          }
        }
      }
      if (newVal.length > 0) {
        td.innerHTML = `<div>${newVal.join(', ')}</div>`
      }
    } else if (col === 16) {
      const totalDuration = parseInt(instance.getDataAtCell(row, 15));
      const callCount = instance.getDataAtCell(row, 5);
      if (callCount && totalDuration) {
        td.innerHTML = parseInt(totalDuration / callCount)
      }
    } else if (value) {
      td.style.textAlign = 'center';
      td.innerHTML = value;
    }
    return td
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title || '对方号码(排除条件)'} align="center" handleChart={this.handleChart}
                    getImgURL={this.getImgURL} getExcel={this.getExcel}/>
        <div id="related" style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView styles={this.props.styles} id="relatedExcel"
                                           searchCriteria={{}}
                                           drilldown={this.state.drilldownOptions}
                                           hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                                           colHeaders={this.state.colHeaders} data={this.state.relatedData} isLoading={this.state.isLoading}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    // relatedList: state.relateds.relatedList,
    // relatedItems: state.relateds.relatedItems,
    search: state.search,
    LargItems: state.labelPNs.LargItems,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(Related);
