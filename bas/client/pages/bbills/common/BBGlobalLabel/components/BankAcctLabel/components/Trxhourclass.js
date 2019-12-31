import React, { Component } from 'react';
import echarts from 'echarts';
import ajaxs from '../../../../../../../utils/ajax';
import EmptyEchart from '../../../../../../../components/NoData/EmptyEchart';
import { formatMoney } from '../../../../../../../utils/bbillsUtils';

class Trxhourclass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      dailyCallArr: null,
    };
  }


  componentDidMount() {
    const myChart = echarts.init(document.getElementById('trxhourclass'), 'light');
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
    ajaxs.post(`/cases/${id}/bbills/trx_hour/group-by-trxhourclass`, {...params}).then(res => {
      if (res.meta && res.meta.success) {
        let trxAmt = [];
        let trxCount = [];

        res.data.forEach(item => {
          trxAmt.push({
            name: item.thc,
            value: item.total_tax_amt
          })
          trxCount.push({
            name: item.thc,
            value: item.trx_count
          })
        });


        this.state.myChart.setOption({
          xAxis: {
            show: true,
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
        text: '时间类别',
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
        data: ['0时', '1时', '2时', '3时', '4时', '5时', '6时',
          '7时', '8时', '9时', '10时', '11时',
          '12时', '13时', '14时', '15时', '16时', '17时',
          '18时', '19时', '20时', '21时', '22时', '23时']
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
    };
    window.addEventListener('resize', this.onResizeChart.bind(this, myChart));
    myChart.setOption(option);
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
      <div style={{ height: '200px' }}>
        {
          this.state.dailyCallArr && this.state.dailyCallArr.length === 0 ? (
            <EmptyEchart />
          ) : (
            <div id="trxhourclass" style={{ height: '100%' }} />
          )
        }
      </div>
    );
  }
}

export default Trxhourclass;
