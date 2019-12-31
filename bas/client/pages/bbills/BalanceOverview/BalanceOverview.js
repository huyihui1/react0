import React, {Component, Fragment} from 'react';
import {bindActionCreators} from 'redux';
import ajaxs from '../../../utils/ajax';
import {connect} from 'react-redux';
import echarts from 'echarts';
import moment from 'moment';
import {actions} from '../../../bbStores/bbBalance';
import { ochlMissing, ochlMonthMissing, ochlQuarterMissing, ochlYearMissing, ochlWeekMissing, ochlTenDaysMissing } from '../../../utils/timeframe';
import appConfig from '../../../appConfig';
import {formatMoney} from '../../../utils/bbillsUtils';

import EmptyEchart from '../../../components/NoData/EmptyEchart';


class BalanceOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      params: null,
      timelyNetData: null,
    };
    this.max = null;
    this.min = null
  }

  componentDidMount() {
    const chart = document.querySelector('#timelyOchlBox');
    chart.style.height = `${document.documentElement.offsetHeight}px`;
    const myChart = echarts.init(document.getElementById('timelyOchl'), 'light');
    this.initChart(myChart);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search && nextProps.search.params && JSON.stringify(this.state.params) !== JSON.stringify(nextProps.search.params)) {
      this.state.myChart && this.state.myChart.showLoading({
        text: appConfig.LOADING_TEXT,
        color: '#c23531',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 1)',
        zlevel: 0,
      });
      this.fetchData(nextProps.search.params);
      this.setState({
        params: JSON.parse(JSON.stringify(nextProps.search.params)),
      });
    }
  }

  tooltipReder = (params) => {
    if (params[0].data) {
      let data = params[0].data;
      let open = '';
      let close = '';
      if (this.state.params.adhoc['group-by'] === 'trx_day') {
        open = '-日初: ';
        close = '-日末: ';
      } else if (this.state.params.adhoc['group-by'] === 'week') {
        open = '-周初: ';
        close = '-周末: ';
      } else if (this.state.params.adhoc['group-by'] === 'month') {
        open = '-月初: ';
        close = '-月末: ';
      } else if (this.state.params.adhoc['group-by'] === 'quarter') {
        open = '-季初: ';
        close = '-季末: ';
      } else if (this.state.params.adhoc['group-by'] === 'year') {
        open = '-年初: ';
        close = '-年末: ';
      } else if (this.state.params.adhoc['group-by'] === 'eml_month') {
        open = '-旬初: ';
        close = '-旬末: ';
      }

      let arr = ` <div>
        <div>${'  '+params[0].axisValue}</div>
        <div>${open + formatMoney(data[1])}</div>
        <div>${close + formatMoney(data[2])}</div>
        <div>${'-最高: ' + formatMoney(data[4])}</div>
        <div>${'-最低: ' + formatMoney(data[3])}</div>
      </div>`

      return arr
    }
  };


  fetchData = (params) => {
    this.max = null;
    this.min = null
    let numArr = [];
    if (params.criteria.owner_card_num) {
      numArr = [...numArr, ...params.criteria.owner_card_num[1]];
    }
    if (params.criteria.owner_name) {
      numArr = [...numArr, ...params.criteria.owner_name[1]];
    }
    if (params.criteria.owner_bank_acct) {
      numArr = [...numArr, ...params.criteria.owner_bank_acct[1]];
    }
    const series = [];
    const legendData = [];
    numArr.forEach(num => {
      legendData.push(num);
      series.push({
        type: 'k',
        name: num,
        data: [],
      });
    });
    this.state.myChart.clear();
    this.state.myChart.setOption({
      title: {
        text: '资产概况蜡烛图',
        subtext: '红色表示资产增加或不变, 蓝色表示资产减少, 气泡表示当前区域最高值与最低值',
        subtextStyle: {
          color: 'red',
          fontWeight: 'bold'
        },
        x: 'center',
        top: '10px',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          return this.tooltipReder(params)
        }
      },
      legend: {
        show: false,
        data: legendData,
        x: 'left',
        bottom: '35px',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        show: true,
        type: 'category',
        boundaryGap: true,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        show: true,
        type: 'value',
        max: value => {
          if (!this.max && value.max > 0) {
            this.max = value.max;
          } else if (this.max < value.max) {
            this.max = value.max;
          }
          return (this.max * 1.6).toFixed(0);
        },
        axisLabel: {
          formatter(value, index) {
            if (value >= 1000 || value <= 1000) {
              value = `${value / 1000}k`;
            }
            return value;
          },
        },
      },
      series,
      dataZoom: [
        {
          type: 'inside',
          minValueSpan: 50,
          startValue: 0,
          endValue: 90
        }, {
          start: 0,
          end: 100,
          // minValueSpan: 10,
          bottom: 0,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
        },
      ],
    });
    if (params.criteria.trx_direction && params.criteria.trx_direction[1]) {
      params.criteria.trx_direction[1].push(-2)
    }
    ajaxs.post(`/cases/${this.props.caseId}/balance/timely-ochl`, params).then(res => {
      if (res.meta.success) {
        const {search: {params}} = this.props;
        let startDate;
        let endDate;
        for (let i = 0; i < res.data.length; i++) {
          const param = res.data;
          if (!startDate) {
            if (param[0].trx_day) {
              startDate = param[0].trx_day
              endDate = param.slice(-1)[0].trx_day
            } else if (param[0].month) {
              startDate = `${param[0].month}` < 10 ? `${param[0].year}-0${param[0].month}` : `${param[0].year}-${param[0].month}`;
              endDate = `${param.slice(-1)[0].month}` < 10 ? `${param.slice(-1)[0].year}-0${param.slice(-1)[0].month}` : `${param.slice(-1)[0].year}-${param.slice(-1)[0].month}`;
            } else if (param[0].quarter || param[0].week || (params.adhoc && params.adhoc['group-by'] === 'year')) {
              startDate = param[0].year;
              endDate = param.slice(-1)[0].year;
            }
          } else if (param[0].trx_day) {
            if (startDate > param[0].trx_day) {
              startDate = param[0].trx_day;
            }
            if (endDate < param.slice(-1)[0].trx_day) {
              endDate = param.slice(-1)[0].trx_day;
            }
          } else if (param[0].month) {
            const s = `${param[0].month}` < 10 ? `${param[0].year}-0${param[0].month}` : `${param[0].year}-${param[0].month}`;
            const e = `${param.slice(-1)[0].month}` < 10 ? `${param.slice(-1)[0].year}-0${param.slice(-1)[0].month}` : `${param.slice(-1)[0].year}-${param.slice(-1)[0].month}`;
            if (startDate > s) {
              startDate = s;
            }
            if (endDate < e) {
              endDate = e;
            }
          } else if (param[0].quarter || param[0].week || (params.adhoc && params.adhoc['group-by'] === 'year')) {
            if (startDate > param[0].year) {
              startDate = param[0].year;
            }
            if (endDate < param.slice(-1)[0].year) {
              endDate = param.slice(-1)[0].year;
            }
          }
        }
        let dateArr = [];
        if (res.data.length === 0) {
          this.state.myChart && this.state.myChart.hideLoading();
          return
        }
        let t = [];
        if (params.adhoc && params.adhoc['group-by'] === 'trx_day') {
          let result = ochlMissing(res.data, {start: startDate, end: endDate}, {
            key: 'trx_day',
          });
          dateArr = result.dateArr;
          t = result.values;
        } else if (params.adhoc && params.adhoc['group-by'] === 'month') {
          let result = ochlMonthMissing(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'month'],
          });
          dateArr = result.dateArr;
          t = result.values;
        } else if (params.adhoc && params.adhoc['group-by'] === 'quarter') {
          let result = ochlQuarterMissing(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'quarter'],
          });
          dateArr = result.dateArr;
          t = result.values;
        } else if (params.adhoc && params.adhoc['group-by'] === 'year') {
          let result = ochlYearMissing(res.data, {start: startDate, end: endDate}, {
            key: 'year',
          });
          dateArr = result.dateArr;
          t = result.values;
        } else if (params.adhoc && params.adhoc['group-by'] === 'week') {
          let result = ochlWeekMissing(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'week'],
          });
          dateArr = result.dateArr;
          t = result.values;
        } else if (params.adhoc && params.adhoc['group-by'] === 'eml_month') {
          let result = ochlTenDaysMissing(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'month', 'eml_month'],
          });
          dateArr = result.dateArr;
          t = result.values;
        }


        this.state.myChart.setOption({
          series: [
            {
              type: 'k',
              name: '资产概况',
              data: t,
              markPoint: {
                itemStyle: {
                  color: '#05d405'
                },
                // label: {
                //   normal: {
                //     formatter: function (param) {
                //       console.log(param);
                //       return param != null ? Math.round(param.value) : '';
                //     }
                //   }
                // },
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              itemStyle: {
                normal: {
                  color0: '#2077ff',
                  borderColor0: '#2077ff'
                }
              }
              // label: { normal: { show: true, position: 'top' } },
            },
          ],
        });

        // if (res.data[0][0].trx_day) {
        //   dateArr = formatDateSort(dateArr);
        // }
        console.log(dateArr);
        this.state.myChart.setOption({
          xAxis: {
            data: dateArr,
          },
        });
        this.setState({
          timelyNetData: res.data,
        });
        setTimeout(() => {
          this.state.myChart && this.state.myChart.hideLoading();
        }, 1000);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  initChart = (myChart) => {
    this.setState({
      myChart,
    });
    const option = {
      title: {
        text: '资产概况蜡烛图',
        x: 'center',
        top: '10px',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [],
        x: 'left',
        bottom: '35px',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: true,
      },
      yAxis: {
        show: false,
        type: 'value',
        max: value => {
          if (!this.max && value.max > 0) {
            this.max = value.max;
          } else if (this.max < value.max) {
            this.max = value.max;
          }
          return (this.max * 1.6).toFixed(0);
        },
        axisLabel: {
          formatter(value, index) {
            if (value >= 1000 || value <= 1000) {
              value = `${value / 1000}k`;
            }
            return value;
          },
        },
      },
      series: [],
    };
    window.addEventListener('resize', this.onResizeChart.bind(this, myChart));
    myChart.setOption(option);
  }

  onResizeChart = (myChart) => {
    myChart.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeChart);
  }

  render() {
    return (
      <div id="timelyOchlBox" style={styles.container}>
        <div id="timelyOchl" style={{width: '100%', height: '100%'}}/>
        <div style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          display: this.state.timelyNetData ? 'none' : 'block',
        }}>
          <EmptyEchart title="资产概况蜡烛图"/>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    boxShadow: '0 0 10px #ccc',
    paddingBottom: '10px',
    position: 'relative',
  },
};

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.bbBalances,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(BalanceOverview);

