import React, { Component } from 'react';
import echarts from 'echarts';
import ajaxs from '../../../../../../../utils/ajax';
import EmptyEchart from '../../../../../../../components/NoData/EmptyEchart';
import { formatMoney } from '../../../../../../../utils/bbillsUtils';

class TrxdayChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      dailyCallArr: null,
    };
  }


  componentDidMount() {
    const myChart = echarts.init(document.getElementById('trxdayChart'), 'light');
    this.initMap(myChart);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeChart);
  }


  fetchData(id) {
    const {card_num, bank_acct} = this.props.activeItem
    let params = {
      criteria: {},
      view: {},
    };
    if (bank_acct) {
      params.criteria.owner_bank_acct = bank_acct
    }
    if (card_num) {
      params.criteria.owner_card_num = card_num
    }
    ajaxs.post(`/cases/${id}/bbills/datetime/group-by-trxday`, {...params, drilldown: true}).then(res => {
      if (res.meta && res.meta.success) {
        let trxAmt = [];
        let trxCount = [];
        let dateArr = [];

        res.data.forEach(item => {
          dateArr.push(item.trx_day)
          trxAmt.push({
            name: item.trx_day,
            value: item.total_trx_amt
          })
          trxCount.push({
            name: item.trx_day,
            value: item.trx_count
          })
        });


        this.state.myChart.setOption({
          xAxis: {
            show: true,
            data: dateArr
          },
          yAxis: [{name: '交易金额', show: true}, {name: '交易次数', show: true}],
          series: [
            {
              name: '交易金额',
              data: trxAmt
            },
            {
              name: '交易次数',
              data: trxCount,
              yAxisIndex: 1,
            },
          ]
        }, false)
        this.state.myChart.hideLoading();
      } else {
        this.state.myChart.hideLoading();
      }
    });
  }

  initMap(myChart) {
    this.setState({
      myChart,
    });
    const option = {
      title: {
        text: '每日交易',
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
      yAxis: [
        {
          show: false,
          name: '交易金额',
          type: 'value',
          axisLabel: {
            formatter(value, index) {
              if (value >= 1000 || value <= 1000) {
                value = `${value / 1000}k`;
              }
              return value;
            },
          },
          // max: value => {
          //   return (value.max * 1.6).toFixed(0);
          // },
        },
        {
          show: false,
          type: 'value',
          name: '交易次数',
          position: 'right',
          // max: value => {
          //   return (value.max * 1.6).toFixed(0);
          // },
        }
      ],
      series: [
        {
          type: 'line',
          name: '交易金额',
          data: [],
        },
        {
          type: 'bar',
          name: '交易次数',
          stack: 'one',
          data: []
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          minValueSpan: 50,
          startValue: 0,
          endValue: 90,
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
    };
    window.addEventListener('resize', this.onResizeChart.bind(this, myChart));
    myChart.setOption(option);
    myChart.showLoading()
    this.fetchData(this.props.caseId)
  }

  onResizeChart = (myChart) => {
    myChart.resize();
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
          <span>${params[1].value}</span>
        </div>
      
      </div>
    `
  }

  render() {
    return (
      <div style={{ height: '400px' }}>
        {
          this.state.dailyCallArr && this.state.dailyCallArr.length === 0 ? (
            <EmptyEchart />
          ) : (
            <div id="trxdayChart" style={{ height: '100%' }} />
          )
        }
      </div>
    );
  }
}

export default TrxdayChart;
