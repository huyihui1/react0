import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import echarts from 'echarts';


import { actions } from '../../../../bbStores/bbStat/GroupByTrxDay';
import columns from '../../../../utils/hotColsDef';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import EmptyEchart from '../../../../components/NoData/EmptyEchart';
import appConfig from '../../../../appConfig';
import {formatMoney} from '../../../../utils/bbillsUtils';


class GroupByTrxDay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: [
        '日期', '次数', '总金额', '周几', '农历',
      ],
      criteria: [],
      hotSetting: {
        fixedColumnsLeft: 5,
        columns: columns.trxday,
      },
      drilldownOptions: {
        '次数': ['trx_day'],
        '总金额': ['trx_day'],
        '周几': ['trx_day'],
      },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('trxday'), 'light');
    this.initChart(myChart);
  }

  fetchData(criteria) {
    const { getGroupByTrxday } = this.props.actions;
    getGroupByTrxday({ case_id: this.props.caseId, criteria, view: {} }).then(res => {
      if (res.body && res.body.meta.success) {
        const {myChart} = this.state;
        const dateArr = [];
        const trxAmt = [];
        const trxCount = [];
        res.body.data.forEach(item => {
          dateArr.push(item.trx_day)
          trxAmt.push(item.total_trx_amt)
          trxCount.push(item.trx_count)
        })
        myChart.setOption({
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
      }
    })
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.bbSearchs.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.bbSearchs.params.criteria)) {
      this.fetchData(nextProps.bbSearchs.params.criteria);
      this.setState({
        criteria: nextProps.bbSearchs.params.criteria,
      });
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeChart);
    this.props.actions.clearTrxday();
  }

  initChart = (myChart) => {
    this.setState({
      myChart,
    });
    const option = {
      title: {
        text: this.props.title + '(图)',
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
          max: value => {
            return (value.max * 1.6).toFixed(0);
          },
        },
        {
          show: false,
          type: 'value',
          name: '交易次数',
          position: 'right',
          max: value => {
            return (value.max * 1.6).toFixed(0);
          },
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
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center" />
        <ExcelView id="trxdayExcel"
          colHeaders={this.state.colHeaders}
          hotSetting={this.state.hotSetting || null}
          isLoading={this.props.isLoading}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.trxdayList}
        />
        <div style={styles.container}>
          <div id="trxday" style={{ width: '100%', height: '500px' }} />
          <div style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            display: this.props.trxdayList ? 'none' : 'block',
          }}
          >
            <EmptyEchart title={this.props.title + '(图)'} />
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'relative'
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    trxdayList: state.trxdays.trxdayList,
    bbSearchs: state.bbSearchs,
    isLoading: state.trxdays.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(GroupByTrxDay);
