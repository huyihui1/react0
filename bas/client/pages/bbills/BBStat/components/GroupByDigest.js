import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';

import columns from "../../../../utils/hotColsDef";
import {actions} from '../../../../bbStores/bbStat/GroupByDigest';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import styles from './index.module.scss';


class GroupByDigest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: ['摘要', '存款次数', '取款次数', '总次数', '总金额'],
      criteria: [],
      hotSetting: {
        manualColumnResize: true,
        manualRowResize: true,
        columns: columns.groupByDigest,
      },
      drilldownOptions: {
        '存款次数': ['digest', {trx_direction: 1}],
        '取款次数': ['digest', {trx_direction: -1}],
        '总次数': ['digest'],
        '总金额': ['digest'],
      },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('groupByDigestChart'), 'light');
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
        top: '75%',
        data: [],
        textStyle:{
          width:0
        }
      },
      series: [
        {
          name: '交易摘要',
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
    const {getGroupByDigests} = this.props.actions;
    getGroupByDigests({case_id: this.props.caseId, criteria, view: {}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bbSearchs.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.bbSearchs.params.criteria)) {
      this.fetchData(nextProps.bbSearchs.params.criteria);
      this.setState({
        criteria: nextProps.bbSearchs.params.criteria,
      })
    }

    if (nextProps.groupByDigestList && nextProps.groupByDigestList.length > 0) {
      let legendData = [];
      let seriesData = [];
      nextProps.groupByDigestList.forEach(item => {
        legendData.push(item.digest);
        let obj = {
          name: item.digest,
          value: item.total_trx_amt
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
    this.props.actions.clearDigests()
  }


  render() {
    return (
      <div className='chart-item'>
        <ChartTitle title={this.props.title} align="center"/>
        <div className={styles.GroupByBox}>
          <ExcelView id="groupByTrxclassExcel" colHeaders={this.state.colHeaders}
                     hotSetting={this.state.hotSetting || null}
                     isLoading={this.props.isLoading}
                     styles={{width: '60%'}}
                     drilldown={this.state.drilldownOptions}
                     data={this.props.groupByDigestList}/>
          <div className={styles.pie} id='groupByDigestChart'></div>
        </div>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    groupByDigestList: state.groupByDigests.groupByDigestList,
    bbSearchs: state.bbSearchs,
    isLoading: state.groupByDigests.showLoading
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByDigest);
