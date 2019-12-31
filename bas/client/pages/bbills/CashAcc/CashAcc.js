import React, {Component, Fragment} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';
import {Message} from '@alifd/next';
import {actions} from '../../../bbStores/bbBalance';
import appConfig from '../../../appConfig';
import {dayMissingAsZero, accSumMissing, monthMissingAsZero, quarterMissingAsZero, yearMissingAsZero, weekMissingAsZero, tenDaysMissingAsZero} from '../../../utils/timeframe';
import ajaxs from '../../../utils/ajax';
import {formatMoney} from '../../../utils/bbillsUtils';

import EmptyEchart from '../../../components/NoData/EmptyEchart';


class CashAcc extends Component {
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
    const chart = document.querySelector('#timelyAccSumBox');
    chart.style.height = `${document.documentElement.offsetHeight}px`;
    const myChart = echarts.init(document.getElementById('timelyAccSum'), 'light');
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
    return `
      <div>
        <div>${'  '+params[0].axisValue}</div>
        <div>
          <span>${params[0].marker}</span><span>${params[0].seriesName}:</span>
          <span>${formatMoney(params[0].value)}</span>
        </div>
        <div>
          <span>${params[1].marker}</span><span>${params[1].seriesName}:</span>
          <span>${formatMoney(params[1].value)}</span>
        </div>
      </div>
    `
  }

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
    const legendData = [];
    this.state.myChart.clear();
    this.state.myChart.setOption({
      title: {
        text: '累计收入与支出统计图',
        x: 'center',
        top: '10px',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        show: true,
        data: ['累计收入', '累计支出'],
        top: '35px',
        x: 'center',
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
        boundaryGap: false,
        axisLabel: {
          rotate: 45,
        },
        formatter: (params) => {
          return this.tooltipReder(params)
        }
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
      series: [
        {
          name:'累计收入',
          type:'line',
          areaStyle: {},
          data: []
        },
        {
          name:'累计支出',
          type:'line',
          areaStyle: {},
          data: []
        }
      ],
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
    ajaxs.post(`/cases/${this.props.caseId}/balance/timely-acc-sum`, params).then(res => {
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
        let inToalData = [];
        let outToalData = [];
        if (res.data.length === 0) {
          this.state.myChart && this.state.myChart.hideLoading();
          return
        }
        if (params.adhoc && params.adhoc['group-by'] === 'trx_day') {
          let inToal = accSumMissing(res.data, {start: startDate, end: endDate}, {
            key: 'trx_day',
            value: 'cash_in_total'
          });
          let outToal = accSumMissing(res.data, {start: startDate, end: endDate}, {
            key: 'trx_day',
            value: 'cash_out_total'
          });
          dateArr = inToal.dateArr;
          inToalData = inToal.values;
          outToalData = outToal.values;
        } else if (params.adhoc && params.adhoc['group-by'] === 'month') {
          let inToal = monthMissingAsZero(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'month'],
            value: 'cash_in_total'
          }, true);
          let outToal = monthMissingAsZero(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'month'],
            value: 'cash_out_total'
          }, true);
          dateArr = inToal.dateArr;
          inToalData = inToal.values;
          outToalData = outToal.values;
        } else if (params.adhoc && params.adhoc['group-by'] === 'quarter') {
          let inToal = quarterMissingAsZero(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'quarter'],
            value: 'cash_in_total'
          }, true);
          let outToal = quarterMissingAsZero(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'quarter'],
            value: 'cash_out_total'
          }, true);
          dateArr = inToal.dateArr;
          inToalData = inToal.values;
          outToalData = outToal.values;
        } else if (params.adhoc && params.adhoc['group-by'] === 'week') {
          let inToal = weekMissingAsZero(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'week'],
            value: 'cash_in_total'
          }, true);
          let outToal = weekMissingAsZero(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'week'],
            value: 'cash_out_total'
          }, true);
          dateArr = inToal.dateArr;
          inToalData = inToal.values;
          outToalData = outToal.values;
        } else if (params.adhoc && params.adhoc['group-by'] === 'year') {
          let inToal = yearMissingAsZero(res.data, {start: startDate, end: endDate}, {
            key: 'year',
            value: 'cash_in_total'
          }, true);
          let outToal = yearMissingAsZero(res.data, {start: startDate, end: endDate}, {
            key: 'year',
            value: 'cash_out_total'
          }, true);
          dateArr = inToal.dateArr;
          inToalData = inToal.values;
          outToalData = outToal.values;
        } else if (params.adhoc && params.adhoc['group-by'] === 'eml_month') {
          let inToal = tenDaysMissingAsZero(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'month', 'eml_month'],
            value: 'cash_in_total'
          }, true);
          let outToal = tenDaysMissingAsZero(res.data, {start: startDate, end: endDate}, {
            key: ['year', 'month', 'eml_month'],
            value: 'cash_out_total'
          }, true);
          dateArr = inToal.dateArr;
          inToalData = inToal.values;
          outToalData = outToal.values;
        }

        this.state.myChart.setOption({
          xAxis: {
            data: dateArr,
          },
        });

        this.state.myChart.setOption({
          series: [
            {
              type: 'line',
              name: '累计收入',
              data: inToalData,
              // label: { normal: { show: true, position: 'top' } },
            },
            {
              type: 'line',
              name: '累计支出',
              data: outToalData,
            },
          ],
        }, false);


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
        text: '收支时间趋势图',
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
        boundaryGap: false,
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
        min: value => {
          if (!this.max && value.max > 0) {
            this.max = value.max;
          } else if (this.max < value.max) {
            this.max = value.max;
          }
          return (this.max * -1.6).toFixed(0);
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
      <div id="timelyAccSumBox" style={styles.container}>
        <div id="timelyAccSum" style={{width: '100%', height: '100%'}}/>
        <div style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          display: this.state.timelyNetData ? 'none' : 'block',
        }}>
          <EmptyEchart title="累计收入与支出统计图"/>
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
)(CashAcc);
