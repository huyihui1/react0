import React, { Component } from 'react';
import echarts from 'echarts';
import ajaxs from '../../../../../../../utils/ajax';
import EmptyEchart from '../../../../../../../components/NoData/EmptyEchart';

class TrxclassChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      dailyCallArr: null,
    };
  }


  componentDidMount() {
    const myChart = echarts.init(document.getElementById('trxclassChart'), 'light');
    this.initMap(myChart);
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
    ajaxs.post(`/cases/${id}/bbills/overview/group-by-trxclass`, {...params}).then(res => {
      if (res.meta && res.meta.success) {
        let legendData = [];
        let seriesData = [];

        res.data.forEach(item => {
          for(const k in item) {
            let obj = {
              name: k,
              value: item[k]
            };
            legendData.push(k)
            seriesData.push(obj)
          }
        });

        this.state.myChart.setOption({
          legend: {
            data: legendData
          },
          series: [
            {
              data: seriesData
            }
          ]
        })
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
        text: '金额类型',
        left: 'center',
        top: 10
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
        confine: true
      },
      legend: {
        type: 'scroll',
        // orient: 'vertical',
        bottom: 0,
        data: [],
        textStyle: {
          width: 0,
        },
      },
      series: [
        {
          name: '交易摘要',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            normal: {
              label: {
                show: false, // 隐藏标示文字
              },
              labelLine: {
                show: false, // 隐藏标示线
              },
            },
          },
        },
      ],
    };

    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
    this.fetchData(this.props.caseId);
  }

  render() {
    return (
      <div style={{ height: '200px' }}>
        {
          this.state.dailyCallArr && this.state.dailyCallArr.length === 0 ? (
            <EmptyEchart />
          ) : (
            <div id="trxclassChart" style={{ height: '100%' }} />
          )
        }
      </div>
    );
  }
}

export default TrxclassChart;
