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

class StarteddayAndctcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      starteddayAndctcodeItems: [],
      colHeaders: [
        '日期',
        '本方号码',
        '号码标注',
        '标签',
        '基站',
        '基站标注',
        // '标签',
        '当日联系次数',
        '备注',
      ],
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        customBorders: [],
        colWidths: [],
        fixedColumnsLeft: 3,
        columns: columns.StarteddayAndctcode,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: async (td, row, col, prop, value, cellProperties) => {
          if (col === 3) {
            const dom = document.createElement('div');
            let owner_num = cellProperties.instance.getDataAtRowProp(row, 'owner_num');
            let component = ownerNumTagRenders(owner_num);
            console.log(component);
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
        '当日联系次数': ['started_day','owner_num','owner_ct_code',],
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
    const myChart = echarts.init(document.getElementById('starteddayAndctcode'), 'light');
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
    downloadIamge(this.state.myChart, 'H6-日期VS基站');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-starteddayandctcode.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    const {fetchStarteddayandctcodeChart} = this.props.actions;
    fetchStarteddayandctcodeChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
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


  cellLabelRender = (arr, code) => {
    let dom = null;
    Array.isArray(arr) && arr.forEach(item => {
      if (item.ct_code === code) {
        dom = `<div style="background: ${item.marker_color}; color: #fff; text-align: center">${item.label}</div>`;
      }
    });
    return dom;
  }

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

    if (col === 5) {
      const code = instance.getDataAtCell(row, 4);
      if (code) {
        const result = this.cellLabelRender(this.props.labelCells.items, code);
        if (result) {
          td.innerHTML = result;
        } else if (value) {
          td.innerHTML = value;
        }
      }
    }

    if (col === 2) {
      const ownerNum = instance.getDataAtCell(row, col - 1);
      if (ownerNum) {
        const result = this.numLabelRender(this.props.labelPNs.items, ownerNum);
        if (result.dom) {
          td.innerHTML = result.dom;
        } else if (value) {
          td.innerHTML = value;
        }
      }
    } else if (col === 3) {
      let newVal = [];
      const ownerNum = instance.getDataAtCell(row, 1);
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
    if (col === 7 && value) {
      td.innerHTML = value;
      td.style.textAlign = 'left';
    }

    if (Object.keys(this.caseBreakpointsRow).indexOf(row.toString()) != -1) {
      td.style.borderBottom = '2px solid magenta';
    }
    return td;
  }


  componentWillReceiveProps(nextProps) {
    // if (nextProps.starteddayAndctcodeItems && this.state.starteddayAndctcodeItems !== nextProps.starteddayAndctcodeItems) {
    //   this.setState({
    //     starteddayAndctcodeItems: nextProps.starteddayAndctcodeItems,
    //   }, () => {
    //     this.state.myChart.setOption({
    //       xAxis: {
    //         data: nextProps.starteddayAndctcodeList[0],
    //       },
    //       series: [{
    //         name: '次数',
    //         data: this.state.starteddayAndctcodeItems,
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
    this.props.actions.clearStarteddayandctcodeChart()
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="H6-日期VS基站" align={'center'} handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <ExcelView id="starteddayAndctcodeExcel" hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                   colHeaders={this.state.colHeaders} data={this.props.starteddayAndctcodeList}
                   drilldown={this.state.drilldownOptions}/>
        <div id="starteddayAndctcode" style={{
          height: '40%',
          display: this.props.starteddayAndctcodeItems && this.props.starteddayAndctcodeItems.length > 0 ? 'block' : 'none'
        }}/>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    starteddayAndctcodeList: state.pbStat.starteddayAndctcodeList,
    starteddayAndctcodeItems: state.pbStat.starteddayAndctcodeItems,
    search: state.search,
    caseBreakpoints: state.caseBreakpoints,
    labelPNs: state.labelPNs,
    labelCells: state.labelCells,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(StarteddayAndctcode);
