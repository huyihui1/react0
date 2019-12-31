import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../bbStores/bbStat/GroupByTrxChannel';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import echarts from 'echarts';
import styles from './index.module.scss';


class GroupByTrxChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: ['渠道', '次数'],
      colHeaders2: ['渠道类别', '次数'],
      criteria: [],
      hotSetting: {
        columns: [
          {
            data: 'trx_channel',
          },
          {
            data: 'count',
            renderer: 'drillDownRenderer'
          }
        ],
        colWidths: [140, 50],
        height: 'auto',
        width: '100%',
        maxHeight: '100%'
      },
      hotSetting2: {
        columns: [
          {
            data: 'trx_channel_class',
          },
          {
            data: 'count',
            renderer: 'drillDownRenderer'
          }
        ],
        colWidths: [140, 50],
        height: 'auto',
        width: '100%',
        maxHeight: '100%'
      },
      drilldownOptions: {
        '次数': ['trx_channel'],
      },
      drilldownOptions2: {
        '次数': ['trx_channel_class'],
      },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('groupByTrxChannelChart'), 'light');
    this.initC3(myChart);
  }

  initC3(myChart) {
    this.setState({
      myChart,
    });
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        bottom: '10%',
        data: [],
        textStyle:{
          width:0
        }
      },
      series: [
        {
          name: '交易渠道',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: [],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            normal: {
              label: {
                show: false   //隐藏标示文字
              },
              labelLine: {
                show: false   //隐藏标示线
              }
            }
          },
        }
      ]
    };

    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
  }

  fetchData(criteria) {
    const {getGroupByTrxchannel, getTrxchannel} = this.props.actions;
    getGroupByTrxchannel({case_id: this.props.caseId, criteria, view: {}});
    getTrxchannel({case_id: this.props.caseId, criteria, view: {}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bbSearchs.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.bbSearchs.params.criteria)) {
      this.fetchData(nextProps.bbSearchs.params.criteria);
      this.setState({
        criteria: nextProps.bbSearchs.params.criteria,
      })
    }

    if (nextProps.groupByTrxchannelList && nextProps.groupByTrxchannelList.length > 0) {
      let legendData = [];
      let seriesData = [];
      nextProps.groupByTrxchannelList.forEach(item => {
        legendData.push(item.trx_channel);
        let obj = {
          name: item.trx_channel,
          value: item.count
        };
        seriesData.push(obj)
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
    }
  }

  componentWillUnmount() {
    this.props.actions.clearTrxchannel()
    this.props.actions.clearClassTrxchannel()
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="F4-交易渠道" align="center"/>
        <div>
          <ExcelView id="trxChannelClassExcel" colHeaders={this.state.colHeaders2}
                     hotSetting={this.state.hotSetting2 || null}
                     isLoading={this.props.isLoading}
                     styles={{width: '60%', height: '200px'}}
                     drilldown={this.state.drilldownOptions2}
                     data={this.props.groupByTrxchannelclassList}/>
        </div>
        <div className={styles.GroupByBox}>
          <ExcelView id="groupByTrxChannelExcel" colHeaders={this.state.colHeaders}
                     hotSetting={this.state.hotSetting || null}
                     isLoading={this.props.isLoading}
                     styles={{width: '60%', height: '400px', display: 'flex', alignItems: 'center'}}
                     drilldown={this.state.drilldownOptions}
                     data={this.props.groupByTrxchannelList}/>
          <div className={styles.pie} id='groupByTrxChannelChart'></div>
        </div>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    groupByTrxchannelList: state.trxchannel.groupByTrxchannelList,
    groupByTrxchannelclassList: state.trxchannel.groupByTrxchannelclassList,
    bbSearchs: state.bbSearchs,
    isLoading: state.trxchannel.showLoading
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByTrxChannel);
