import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';
import moment from 'moment';
import solarLunar from 'solarlunar';


import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import EmptyEchart from '../../../components/NoData/EmptyEchart'
import appConfig from '../../../appConfig';
import columns from '../../../utils/hotColsDef'



let setHot = true;

class Startedday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: true,
      myChart: null,
      colHeaders: ['日期', '标注', '次数', '农历', '周几'],
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        customBorders: [],
        fixedColumnsLeft: 2,
        columns: columns.Startedday,
      },
      drilldownOptions: {
        '次数': ['started_day'],
      },
      caseBreakpointsItems: null,
      hot: null,
    };
    this.caseBreakpointsRow = {};
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.fetchData2 = this.fetchData2.bind(this);
    this.cellRender = this.cellRender.bind(this);
  }

  componentDidMount() {

  }

  handleChart(bool) {
    this.setState({
      isChart: bool,
      criteria: [],
    });
  }

  getImgURL() {
    downloadIamge(this.state.myChart, 'H2-通话日期');
  }

  getExcel() {
  }

  fetchData(params) {
    setHot = true;
    if (params) {
      const {fetchStarteddayChart} = this.props.actions;
      fetchStarteddayChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    }
  }

  fetchData2(params) {
    // setHot = true;
    if (params) {
      const {fetchAllStarteddayChart} = this.props.actions;
      fetchAllStarteddayChart({case_id: this.props.caseId, ...{criteria: params, view: {}}}).then(res => {
        if (res.body.meta && res.body.meta.success) {
          this.state.myChart && this.state.myChart.hideLoading()
        } else {
          this.state.myChart && this.state.myChart.hideLoading()
        }
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


  // cellRender(instance, td, row, col, prop, value, cellProperties) {
  //   if (value) {
  //     td.style.textAlign = 'center';
  //     td.innerHTML = value;
  //   }
  //   if (col === 0) {
  //     const { caseBreakpointsItems } = this.state;
  //     const result = caseBreakpointsItems.find(item => {
  //       return moment(item.started_at).format('YYYY-MM-DD') === value;
  //     });
  //     if (result) {
  //       td.style.borderBottom = '2px solid magenta';
  //       this.caseBreakpointsRow[row] = result;
  //       if (setHot) {
  //         this.setState({
  //           hot: instance,
  //         }, () => {
  //           setHot = false;
  //           this.state.hot.updateSettings({
  //             rowHeaders: (row) => {
  //               if (this.caseBreakpointsRow[row]) {
  //                 return `<div style="width: 100%; height: 23px; background: magenta" title=${this.caseBreakpointsRow[row].name}></div>`;
  //               }
  //               return row + 1;
  //             },
  //           });
  //         });
  //       }
  //     }
  //     td.style.textAlign = 'center';
  //     td.innerHTML = value;
  //     return td;
  //   }
  //   if (Object.keys(this.caseBreakpointsRow).indexOf(row.toString()) != -1) {
  //     td.style.borderBottom = '2px solid magenta';
  //   }
  //
  //   // if (col === 1) {
  //   //   // console.log(this.props.caseEvents.items);
  //   //   let date = instance.getDataAtCell(row, 0)
  //   //   if (date) {
  //   //     let result = this.eventRender(this.props.caseEvents.items, date);
  //   //     if (result) {
  //   //       td.innerHTML = result;
  //   //     } else if (value) {
  //   //       td.innerHTML = value
  //   //     }
  //   //   }
  //   // }
  //
  //
  //   if (col === 3){
  //     if (value){
  //       const date = new Date(value);
  //       const year = date.getFullYear();
  //       const month = date.getMonth() + 1;
  //       const day = date.getDate();
  //       const solar2lunarData = solarLunar.solar2lunar(year, month, day);
  //
  //       td.innerHTML = `<span>${solar2lunarData.monthCn}${solar2lunarData.dayCn}</span>`
  //     }
  //   }
  //
  //   if (col === 4){
  //     if (value){
  //       const date = new Date(value);
  //       const year = date.getFullYear();
  //       const month = date.getMonth() + 1;
  //       const day = date.getDate();
  //       const solar2lunarData = solarLunar.solar2lunar(year, month, day);
  //
  //       td.innerHTML = `<span>${solar2lunarData.ncWeek}</span>`
  //     }
  //   }
  //
  //   return td;
  // }

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
      td.style.textAlign = 'center';
      td.innerHTML = value;
      return td;
    }


    if (col === 3) {
      if (value) {
        const date = new Date(value);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const solar2lunarData = solarLunar.solar2lunar(year, month, day);

        td.innerHTML = `<span>${solar2lunarData.monthCn}${solar2lunarData.dayCn}</span>`
      }
    }

    if (col === 4) {
      if (value) {
        const date = new Date(value);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const solar2lunarData = solarLunar.solar2lunar(year, month, day);

        td.innerHTML = `<span>${solar2lunarData.ncWeek}</span>`
      }
    }


    if (Object.keys(this.caseBreakpointsRow).indexOf(row.toString()) != -1) {
      td.style.borderBottom = '2px solid magenta';
    }


    td.style.textAlign = 'center';
  }


  initC3(myChart) {
    myChart.showLoading({text: appConfig.LOADING_TEXT});
    this.setState({
      myChart,
    });
    const option = {
      noDataLoadingOption: {
        text: '暂无数据',
        effect: 'bubble',
        effectOption: {
          effect: {
            n: 0
          }
        }
      },
      title: {
        text: '通话日期报表',
        x: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          const date = new Date(params[0].name);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const solar2lunarData = solarLunar.solar2lunar(year, month, day);
          return `${params[0].axisValue} ${solar2lunarData.monthCn}${solar2lunarData.dayCn} ${solar2lunarData.ncWeek}<br />
                  ${params[0] && typeof params[0].data === 'object' ? `${params[0].data.name} <br />` : ''}
                  ${params[0].marker}${params[0].seriesName}: ${params[0].value}<br />
                  ${params[1] ? `${params[1].marker + params[1].seriesName}: ${params[1].value}<br />` : ''}
                  ${params[1] ? `&nbsp;&nbsp;&nbsp;&nbsp;总数: ${params[0].value * 1 + params[1].value * 1}` : ''}
                 `;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      legend: {
        x: 'right',
        data: ['其他通话', '符合条件'],
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          show: false,
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
            rotate: 45,
            show: true,
            splitNumber: 15,
            textStyle: {
              fontFamily: '微软雅黑',
              fontSize: 12,
            },
          },
          data: [],
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          splitArea: {
            show: false,
          },
        },
      ],
      dataZoom: [
        {
          show: true,
          height: 30,
          xAxisIndex: [
            0,
          ],
          bottom: 40,
          start: 0,
          end: 100,
        },
        {
          type: 'inside',
          show: true,
          height: 15,
          xAxisIndex: [
            0,
          ],
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: '符合条件',
          type: 'bar',
          stack: '总量',
          barMaxWidth: 50,
          barGap: '10%',
          itemStyle: {
            normal: {
              barBorderRadius: 0,
              color: 'red',
              label: {
                show: false,
                textStyle: {
                  color: 'rgba(0,0,0,1)',
                },
                position: 'insideTop',
                formatter(p) {
                  return p.value > 0 ? (p.value) : '';
                },
              },
            },
          },
          data: [],
        },
        {
          name: '其他通话',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            normal: {
              color: 'skyblue',
              barBorderRadius: 0,
              label: {
                show: false,
                textStyle: {
                  color: 'rgba(0,0,0,1)',
                },
                position: 'insideTop',
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.caseBreakpointsRow = {};
      this.state.myChart && this.state.myChart.clear()
      this.fetchData(nextProps.search.criteria);
      this.fetchData2({owner_num: nextProps.search.criteria.owner_num});
      this.setState({
        criteria: nextProps.search.criteria,
      });
    }


    if (nextProps.caseBreakpoints && JSON.stringify(nextProps.caseBreakpoints.items) !== this.state.caseBreakpointsItems) {
      this.setState({
        caseBreakpointsItems: nextProps.caseBreakpoints.items,
      });
    }
    if (nextProps.caseBreakpoints && nextProps.starteddayAllItems && nextProps.starteddayAllItems.length > 0 && nextProps.starteddayItems && nextProps.starteddayItems.length > 0 && this.state.starteddayItems !== nextProps.starteddayItems) {
      const head = Object.keys(nextProps.starteddayItems[0]);
      const body = Object.values(nextProps.starteddayItems[0]);
      const head2 = Object.keys(nextProps.starteddayAllItems[0]);
      const body2 = Object.values(nextProps.starteddayAllItems[0]);
      const myChart = echarts.init(document.getElementById('startedday'), 'light');
      this.initC3(myChart);
      this.setState({
        starteddayItems: nextProps.starteddayItems,
      }, () => {
        const m = [];
        nextProps.caseBreakpoints.items.forEach(item => {
          const index = head.indexOf(moment(item.started_at).format('YYYY-MM-DD'));
          if (index !== -1) {
            m.push({
              coord: [index, body2[index] * 1],
              // value: item.name,
            });
            body[index] = {name: item.name, value: body[index]}
          }
        });
        let temp = []
        body2.forEach((item, index) => {
          temp.push(item - Object.values(nextProps.starteddayItems[0])[index])
        })
        this.state.myChart.setOption({
          xAxis: {
            data: head2,
          },
          series: [{
            name: '符合条件',
            data: body,
            markPoint: {
              symbolSize: 30,
              data: m,
              itemStyle: {
                color: 'magenta'
              }
            },
          }, {
            name: '其他通话',
            data: temp,
          }],
        });
        this.state.myChart.hideLoading()
        this.state.myChart.resize();
      });
    }
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="H2-通话日期(图)" handleChart={this.handleChart} align={'center'} getImgURL={this.getImgURL} getExcel={this.getExcel}/>
        <ExcelView id="starteddayExcel" colHeaders={this.state.colHeaders} drilldown={this.state.drilldownOptions}
                   hotSetting={this.state.hotSetting ? this.state.hotSetting : null} data={this.props.starteddayList}/>
        <div id="startedday" className="noDraggable pbStatChart" style={{
          display: this.props.starteddayItems && this.props.starteddayItems.length > 0 ? 'block' : 'none'
        }}/>
        <div className={'pbStatChart'} style={{
          display: this.props.starteddayItems && this.props.starteddayItems.length === 0 ? 'block' : 'none'
        }}>
          <EmptyEchart/>
        </div>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    starteddayList: state.pbStat.starteddayList,
    starteddayItems: state.pbStat.starteddayItems,
    starteddayAllItems: state.pbStat.starteddayAllItems,
    search: state.search,
    caseBreakpoints: state.caseBreakpoints,
    pbStat: state.pbStat,
    caseEvents: state.caseEvents,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(Startedday);
