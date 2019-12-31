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
import {setColWidths} from "../../../handontableConfig";
import moment from 'moment';
import columns from '../../../utils/hotColsDef'


let setHot = true;
let colHeaders = [
  '日期',
  '标注',
  '总计',
  '首次时间',
  '末次时间',
  '04:30 ~ 06:20',
  '06:21 ~ 07:10',
  '07:11 ~ 07:50',
  '07:51 ~ 08:25',
  '08:26 ~ 11:00',
  '11:01 ~ 11:30',
  '11:31 ~ 12:30',
  '12:31 ~ 13:20',
  '13:21 ~ 14:00',
  '14:01 ~ 16:50',
  '16:51 ~ 17:40',
  '17:41 ~ 18:50',
  '18:51 ~ 20:00',
  '20:01 ~ 21:50',
  '21:51 ~ 23:59',
  '00:00 ~ 04:29',
];

class StarteddayAndstartedtimel2class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      starteddayAndstartedtimel2classItems: [],
      colHeaders: colHeaders,
      hotSetting: {
        renderer: this.cellRender.bind(this),
        fixedColumnsLeft: 5,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns: columns.starteddayAndstartedtimel2class
      },
      drilldownOptions: {
        '总计': ['started_day'],
        '04:30 ~ 06:20': ['started_day',{started_time_l2_class:'0'}],
        '06:21 ~ 07:10': ['started_day',{started_time_l2_class:'1'}],
        '07:11 ~ 07:50': ['started_day',{started_time_l2_class:'2'}],
        '07:51 ~ 08:25': ['started_day',{started_time_l2_class:'3'}],
        '08:26 ~ 11:00': ['started_day',{started_time_l2_class:'4'}],
        '11:01 ~ 11:30': ['started_day',{started_time_l2_class:'5'}],
        '11:31 ~ 12:30': ['started_day',{started_time_l2_class:'6'}],
        '12:31 ~ 13:20': ['started_day',{started_time_l2_class:'7'}],
        '13:21 ~ 14:00': ['started_day',{started_time_l2_class:'8'}],
        '14:01 ~ 16:50': ['started_day',{started_time_l2_class:'9'}],
        '16:51 ~ 17:40': ['started_day',{started_time_l2_class:'10'}],
        '17:41 ~ 18:50': ['started_day',{started_time_l2_class:'11'}],
        '18:51 ~ 20:00': ['started_day',{started_time_l2_class:'12'}],
        '20:01 ~ 21:50': ['started_day',{started_time_l2_class:'13'}],
        '21:51 ~ 23:59': ['started_day',{started_time_l2_class:'14'}],
        '00:00 ~ 04:29': ['started_day',{started_time_l2_class:'15'}],
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
    const myChart = echarts.init(document.getElementById('starteddayAndstartedtimel2class'), 'light');
    this.initC3(myChart);

    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting})

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
    downloadIamge(this.state.myChart, 'H4-日期VS通话时间段(详细)');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-starteddayandstartedtimel2class.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    this.caseBreakpointsRow = {};
    setHot = true;
    const {fetchStarteddayAndstartedtimel2classChart} = this.props.actions;
    fetchStarteddayAndstartedtimel2classChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.starteddayAndstartedtimel2classItems && this.state.starteddayAndstartedtimel2classItems !== nextProps.starteddayAndstartedtimel2classItems) {
      this.setState({
        starteddayAndstartedtimel2classItems: nextProps.starteddayAndstartedtimel2classItems,
      }, () => {
        this.state.myChart.setOption({
          xAxis: {
            data: nextProps.starteddayAndstartedtimel2classList[0],
          },
          series: [{
            name: '次数',
            data: this.state.starteddayAndstartedtimel2classItems,
          }],
        });
        console.log(this.state.myChart.getOption());
      });
    }
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

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="H4-日期VS通话时间段(详细)" align={'center'} handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="starteddayAndstartedtimel2class"
             style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="starteddayAndstartedtimel2classExcel" colHeaders={this.state.colHeaders}
                                           hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                                           drilldown={this.state.drilldownOptions}
                                           data={this.props.starteddayAndstartedtimel2classList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    starteddayAndstartedtimel2classList: state.pbStat.starteddayAndstartedtimel2classList,
    starteddayAndstartedtimel2classItems: state.pbStat.starteddayAndstartedtimel2classItems,
    search: state.search,
    caseBreakpoints: state.caseBreakpoints,
    caseEvents: state.caseEvents,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(StarteddayAndstartedtimel2class);
