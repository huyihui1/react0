import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';


import {actions} from '../../../../bbStores/bbStat/GroupByTrxclass';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import styles from './index.module.scss';


class GroupByTrxclass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: ['类型', '次数', '占比'],
      criteria: [],
      hotSetting: {
        columns: [
          {
            data: 'trx_class',
          },
          {
            data: 'count',
            renderer: 'drillDownRenderer'
          },
          {
            data: '占比'
          }
        ],
        height: 'auto',
        width: '100%',
        maxHeight:'100%'
      },
      drilldownOptions: {
        '次数': [
          'trx_class',
        ],
      }
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('groupByTrxclassChart'), 'light');
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
        bottom: '10%',
        data: [],
        textStyle:{
          width:0
        }
      },
      series: [
        {
          name: '交易类型',
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
    const {getGroupByTrxclass} = this.props.actions;
    getGroupByTrxclass({case_id: this.props.caseId, criteria, view: {}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bbSearchs.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.bbSearchs.params.criteria)) {
      this.fetchData(nextProps.bbSearchs.params.criteria);
      this.setState({
        criteria: nextProps.bbSearchs.params.criteria,
      })
    }

    if (nextProps.groupByTrxclassList && nextProps.groupByTrxclassList.length > 0) {
      let legendData = [];
      let seriesData = [];
      nextProps.groupByTrxclassList.forEach(item => {
        legendData.push(item.trx_class);
        let obj = {
          name: item.trx_class,
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
    this.props.actions.clearTrxclass()
  }


  render() {
    return (
      <div>
        <ChartTitle title={this.props.title} align="center"/>
        <div className={styles.GroupByBox}>
          <ExcelView id="groupByTrxclassExcel" colHeaders={this.state.colHeaders}
                     hotSetting={this.state.hotSetting || null}
                     isLoading={this.props.isLoading}
                     styles={{width: '60%', display: 'flex', alignItems: 'center'}}
                     drilldown={this.state.drilldownOptions}
                     data={this.props.groupByTrxclassList}/>
          <div className={styles.pie} id='groupByTrxclassChart'></div>
        </div>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    groupByTrxclassList: state.trxclass.groupByTrxclassList,
    bbSearchs: state.bbSearchs,
    isLoading: state.trxclass.showLoading
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByTrxclass);
