import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';
import {saveAs} from 'file-saver';

import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import ajaxs from '../../../utils/ajax';
import moment from 'moment/moment';
import solarLunar from 'solarlunar';
import {setColWidths} from "../../../handontableConfig";
import columns from "../../../utils/hotColsDef";
import {ownerNumTagRenders, peerNumTagRenders} from "../../../utils/hotRenders";
import ReactDOM from "react-dom";


let setHot = true;

class StarteddayAndandpeernum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      starteddayAndandpeernumItems: [],
      colHeaders: [
        '日期',
        '本方号码',
        '标注',
        '标签',
        '对方号码',
        '标注',
        '标签',
        '当日联系次数',
        '备注',
      ],
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        customBorders: [],
        fixedColumnsLeft: 3,
        columns: columns.StarteddayAndandpeernum,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: async (td, row, col, prop, value, cellProperties) => {
          if (col === 3) {
            const dom = document.createElement('div');
            let owner_num = cellProperties.instance.getDataAtRowProp(row, 'owner_num');
            let component = ownerNumTagRenders(owner_num);
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }

          if (col === 6) {
            const dom = document.createElement('div');
            let peer_num = cellProperties.instance.getDataAtRowProp(row, 'peer_num');
            let component = peerNumTagRenders(peer_num);
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
        }
      },
      caseBreakpointsItems: null,
      hot: null,
      drilldownOptions: {
        '当日联系次数': ['started_day','owner_num','peer_num',],
      },
    };
    this.domArr = [];
    this.caseBreakpointsRow = {};
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('starteddayAndandpeernum'), 'light');
    this.initC3(myChart);


    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(this.state.colHeaders);
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
    downloadIamge(this.state.myChart, 'H5-日期VS对方号码');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-starteddayandandpeernum.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    const {fetchStarteddayandandpeernumChart} = this.props.actions;
    fetchStarteddayandandpeernumChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
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
      td.innerHTML = value;
    }
    if (col === 0) {
      const {caseBreakpointsItems} = this.state;
      const result = caseBreakpointsItems.find(item => {
        return moment(item.started_at).format('YYYY-MM-DD') === value;
      });
      if (result) {
        td.style.borderBottom = '2px solid magenta';
        this.caseBreakpointsRow[row] = result;
        if (setHot) {
          this.setState({
            hot: instance,
          }, () => {
            setHot = false;
            this.state.hot.updateSettings({
              rowHeaders: (row) => {
                if (this.caseBreakpointsRow[row]) {
                  return `<div style="width: 100%; height: 23px; background: magenta" title=${this.caseBreakpointsRow[row].name}></div>`;
                }
                return row + 1;
              },
            });
          });
        }
      }
      td.innerHTML = value;
      return td;
    }

    if (col === 2 || col === 5) {
      const ownerNum = instance.getDataAtCell(row, col - 1);
      if (ownerNum) {
        const result = this.numLabelRender(this.props.labelPNs.items, ownerNum);
        if (result.dom) {
          td.innerHTML = result.dom;
        } else if (value) {
          td.innerHTML = value;
        }
      }
    } else if (col === 3 || col === 6) {
      let newVal = [];
      let cols = '';
      if (col === 3) {
        cols = 1
      } else {
        cols = 4
      }

      const ownerNum = instance.getDataAtCell(row, cols);
      const tags = this.numLabelRender(this.props.labelPNs.items, ownerNum);
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
    }
    if (col === 8 && value) {
      td.innerHTML = value;
      td.style.textAlign = 'left';
    }

    if (Object.keys(this.caseBreakpointsRow).indexOf(row.toString()) != -1) {
      td.style.borderBottom = '2px solid magenta';
    }
    return td;
  }


  componentWillReceiveProps(nextProps) {
    // if (nextProps.starteddayAndandpeernumItems && this.state.starteddayAndandpeernumItems !== nextProps.starteddayAndandpeernumItems) {
    //   this.setState({
    //     starteddayAndandpeernumItems: nextProps.starteddayAndandpeernumItems,
    //   }, () => {
    //     this.state.myChart.setOption({
    //       xAxis: {
    //         data: nextProps.starteddayAndandpeernumList[0],
    //       },
    //       series: [{
    //         name: '次数',
    //         data: this.state.starteddayAndandpeernumItems,
    //       }],
    //     });
    //     console.log(this.state.myChart.getOption());
    //   });
    // }
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      })
    }
    if (nextProps.caseBreakpoints && JSON.stringify(nextProps.caseBreakpoints.items) !== this.state.caseBreakpointsItems) {
      this.setState({
        caseBreakpointsItems: nextProps.caseBreakpoints.items,
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
    this.props.actions.clearStarteddayandandpeernumChart()
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="H5-日期VS对方号码" align={'center'} handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <ExcelView id="starteddayAndandpeernumExcel" hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                   colHeaders={this.state.colHeaders} data={this.props.starteddayandandpeernumList} drilldown={this.state.drilldownOptions} />
        <div id="starteddayAndandpeernum" style={{
          height: '40%',
          display: this.props.starteddayandandpeernumItems && this.props.starteddayandandpeernumItems.length > 0 ? 'block' : 'none'
        }}/>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    starteddayandandpeernumList: state.pbStat.starteddayandandpeernumList,
    starteddayandandpeernumItems: state.pbStat.starteddayandandpeernumItems,
    search: state.search,
    caseBreakpoints: state.caseBreakpoints,
    labelPNs: state.labelPNs,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(StarteddayAndandpeernum);
