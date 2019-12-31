import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';
import {saveAs} from 'file-saver';
import moment from 'moment';
import ajaxs from '../../../utils/ajax'

import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';

import {setColWidths} from '../../../handontableConfig'
import columns from '../../../utils/hotColsDef';

let setHot = true;


class StarteddayAndstartedtimel1class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      starteddayAndstartedtimel1classItems: [],
      colHeaders: [
        '日期',
        '标注',
        '总计',
        '首次时间',
        '末次时间',
        '04:30 ~ 07:30',
        '07:31 ~ 11:15',
        '11:16 ~ 13:30',
        '13:31 ~ 17:15',
        '17:16 ~ 19:00',
        '19:01 ~ 20:50',
        '20:51 ~ 23:59',
        '00:00 ~ 04:29',
      ],
      hotSetting: {
        renderer: this.cellRender.bind(this),
        fixedColumnsLeft: 5,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns:columns.starteddayAndstartedtimel1class
      },
      drilldownOptions: {
        '总计': ['started_day'],
        '04:30 ~ 07:30': ['started_day',{started_time_l1_class:'0'}],
        '07:31 ~ 11:15': ['started_day',{started_time_l1_class:'1'}],
        '11:16 ~ 13:30': ['started_day',{started_time_l1_class:'2'}],
        '13:31 ~ 17:15': ['started_day',{started_time_l1_class:'3'}],
        '17:16 ~ 19:00': ['started_day',{started_time_l1_class:'4'}],
        '19:01 ~ 20:50': ['started_day',{started_time_l1_class:'5'}],
        '20:51 ~ 23:59': ['started_day',{started_time_l1_class:'6'}],
        '00:00 ~ 04:29': ['started_day',{started_time_l1_class:'7'}],
      },
      caseBreakpointsItems: null,
    };
    this.caseBreakpointsRow = {};
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('starteddayAndstartedtimel1class'), 'light');
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
    downloadIamge(this.state.myChart, 'H3-日期VS通话时间段');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-starteddayandstartedtimel1class.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    this.caseBreakpointsRow = {};
    setHot = true;

    const {fetchStarteddayAndstartedtimel1classChart} = this.props.actions;
    fetchStarteddayAndstartedtimel1classChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.starteddayAndstartedtimel1classItems && this.state.starteddayAndstartedtimel1classItems !== nextProps.starteddayAndstartedtimel1classItems) {
      this.setState({
        starteddayAndstartedtimel1classItems: nextProps.starteddayAndstartedtimel1classItems,
      }, () => {
        this.state.myChart.setOption({
          xAxis: {
            data: nextProps.starteddayAndstartedtimel1classList[0],
          },
          series: [{
            name: '次数',
            data: this.state.starteddayAndstartedtimel1classItems,
          }],
        });
        // console.log(this.state.myChart.getOption());
      });
    }
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      })
    }

    // if (nextProps.caseEvents && JSON.stringify(nextProps.caseEvents.items) !== this.state.caseBreakpointsItems) {
    //
    //   this.setState({
    //     caseBreakpointsItems: nextProps.caseEvents.items,
    //   });
    // }

    if (nextProps.caseBreakpoints && JSON.stringify(nextProps.caseBreakpoints.items) !== this.state.caseBreakpointsItems) {
      this.setState({
        caseBreakpointsItems: nextProps.caseBreakpoints.items,
      });
    }

  }

  eventRender = (arr, date) => {
    let dom = null
    Array.isArray(arr) && arr.forEach(item => {
      if (moment(item.started_at).format("YYYY-MM-DD") === date) {
        dom = `<div style="background: ${item.color}; color: #fff; text-align: center">${item.name}</div>`
      }
    })
    return dom
  }

  cellRender(instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = ''
    if (value) {
      td.innerHTML = value
    }
    if (col === 1) {
      let date = instance.getDataAtCell(row, 0)
      if (date) {
        let result = this.eventRender(this.props.caseEvents.items, date);
        if (result) {
          td.innerHTML = result;
        } else if (value) {
          td.innerHTML = value
        }
      }
    } else if (value) {
      td.innerHTML = value;
    }

    // if (col === 0) {
    //   const {caseBreakpointsItems} = this.state;
    //   const result = caseBreakpointsItems.find(item => {
    //     return moment(item.started_at).format('YYYY-MM-DD') === value;
    //   });
    //   if (result) {
    //     td.style.borderBottom = '2px solid magenta';
    //     this.caseBreakpointsRow[row] = result;
    //     if (setHot) {
    //       this.setState({
    //         hot: instance,
    //       }, () => {
    //         setHot = false;
    //         this.state.hot.updateSettings({
    //           rowHeaders: (row) => {
    //             if (this.caseBreakpointsRow[row]) {
    //               return `<div style="width: 100%; height: 23px; background: magenta" title=${this.caseBreakpointsRow[row].name}></div>`;
    //             }
    //             return row + 1;
    //           },
    //         });
    //       });
    //     }
    //   }
    //   td.style.textAlign = 'center';
    //   td.innerHTML = value;
    //   return td;
    // }
    // if (Object.keys(this.caseBreakpointsRow).indexOf(row.toString()) != -1) {
    //   td.style.borderBottom = '2px solid magenta';
    // }


    td.style.textAlign = 'center';
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="H3-日期VS通话时间段" align={'center'} handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="starteddayAndstartedtimel1class"
             style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="starteddayAndstartedtimel1classExcel"
                                           hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                                           colHeaders={this.state.colHeaders}
                                           drilldown={this.state.drilldownOptions}
                                           data={this.props.starteddayAndstartedtimel1classList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    starteddayAndstartedtimel1classList: state.pbStat.starteddayAndstartedtimel1classList,
    starteddayAndstartedtimel1classItems: state.pbStat.starteddayAndstartedtimel1classItems,
    search: state.search,
    caseBreakpoints: state.caseBreakpoints,
    caseEvents: state.caseEvents,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(StarteddayAndstartedtimel1class);
