import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect, Provider} from 'react-redux';
import echarts from 'echarts';
import {saveAs} from 'file-saver';
import ajaxs from '../../../utils/ajax';

import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';

import {setColWidths} from "../../../handontableConfig";
import columns from '../../../utils/hotColsDef';

import {caseBreakpoints ,peerNumTagRenders} from '../../../utils/hotRenders';
import ReactDOM from 'react-dom';


let colHeaders = [
  '对方号码',
  '标注',
  '标签',
  '职务',
  '总计',
  '首次通话时间',
  '最后通话时间',
  '归属地',
  '运营商',
  '中心度',
  '语音数',
  '联系天数',
  '短信数',
  '主叫',
  '被叫',
  '呼转',
  '工作时间',
  '休息时间',
  '5分钟以上',
  '21时后',
  '通话时间合计',
  // '合计时间',
  '平均时长',
  '时间分割',
];

let topValue = 0,// 上次滚动条到顶部的距离
  interval = null, // 定时器
  firstFetch = true

class Peernum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      peernumItems: [],
      colHeaders: colHeaders,
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        fixedColumnsLeft: 2,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns: columns.Peernum,
        viewportColumnRenderingOffset: 70,
        afterScrollVertically: () => {
          if(interval == null) {
            interval = setInterval(() => {
              this.isStopScroll('peernumExcel', this.fetchCol.bind(this))
            }, 1000);
          }
          topValue = document.querySelector('#peernumExcel .wtHolder').scrollTop
          this.isScrolling = true;
        },
        afterColumnResize: () => {
          firstFetch = true;
          this.colMap = {}
          this.fetchCol(this.props.num)
          firstFetch = false
        },
        beforeColumnSort: (currentSortConfig, destinationSortConfigs) => {
          firstFetch = true
          this.colMap = {}
        },
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterViewportRowCalculatorOverride: (c) => {
          this.viewData = c;
        },
        afterRender: (afterRender) => {
          if (afterRender) {
            if (firstFetch) {
              this.fetchCol('peernumExcel')
              firstFetch = false
            }
          }
        },
        afterRenderer: (td, row, col, prop, value, cellProperties) => {
          this.hot = cellProperties.instance;
          if (col === 3) {
            td.innerHTML = `<div id=peernumExcel${row} style="background: #eee; width: 100%; height: 80%"></div>`;
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
            td.innerHTML = `<div id=${ "peernumExcel" + row + 'breakpoints'} style="background: #eee; width: 100%; height: 80%"></div>`;
          }
          if (col === 2){
            const dom = document.createElement('div');
            let peer_num = cellProperties.instance.getDataAtRowProp(row, 'peer_num')
            let component = peerNumTagRenders(peer_num)
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }

        },
      },
      drilldownOptions: {
        '总计': ['peer_num'],
        '联系天数': ['peer_num'],
        '中心度': ['peer_num'],
        '语音数': ['peer_num', {bill_type: '1'}],
        '主叫': ['peer_num', {comm_direction: '11'}],
        '被叫': ['peer_num', {comm_direction: '12'}],
        '呼转': ['peer_num', {comm_direction: '13'}],
        '短信数': ['peer_num', {bill_type: '2'}],
        '休息时间': ['peer_num', {time_class: '0'}],
        '工作时间': ['peer_num', {time_class: '1'}],
        '5分钟以上': ['peer_num', {duration: ['>=', ['300']]}],
        '21时后': ['peer_num', {started_hour_class: ['>=', ['17']]}],
      }
    };
    this.domArr = [];
    this.colMap = {};
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  isStopScroll = (id, cb) => {
    // 判断此刻到顶部的距离是否和1秒前的距离相等
    const t1 = document.querySelector(`#${id} .wtHolder`) && document.querySelector(`#${id} .wtHolder`).scrollTop;
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
            const myTd = document.getElementById(`peernumExcel${i}`);
            if (myTd) {
              myTd.style.background = '#fff';
              myTd.innerHTML = `<span>${res.data.position || ''}</span>`;
              this.colMap[i + '3'] = res.data.position || '';
            }
          }
        })
      }
      const criteria = JSON.parse(JSON.stringify(this.state.criteria));
      const peer_num = ['IN', [this.hot.getDataAtRowProp(i, 'peer_num')]];
      criteria.peer_num = peer_num;
      caseBreakpoints(this.props.caseId, criteria, i, id).then(dom => {
        if (dom) {
          this.domArr.push(dom);
        }
      })
    }
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('peernum'), 'light');
    this.initC3(myChart);

    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting})

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
    downloadIamge(this.state.myChart, 'A1-对方号码');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-peernum.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    const {fetchPeernumChart} = this.props.actions;
    fetchPeernumChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      firstFetch=true;
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      });
    }
  }


  unmountCompsOnDoms = () => {
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
  };

  componentWillUnmount() {
    this.unmountCompsOnDoms();
    this.props.actions.clearPeernumChart();
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="A1-对方号码" align="center" handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="peernum" style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ?
            <ExcelView id="peernumExcel" getHot={this.getHot} drilldown={this.state.drilldownOptions} hotSetting={this.state.hotSetting || null} colHeaders={this.state.colHeaders}
                       data={this.props.peernumList} isLoading={this.props.isLoading}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    peernumList: state.pbStat.peernumList,
    peernumItems: state.pbStat.peernumItems,
    isLoading: state.pbStat.isLoading,
    search: state.search,
    labelPNs: state.labelPNs,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(Peernum);
