import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';
import {actions} from '../../../../bbStores/bbStat/GroupByTrxAmtClass';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import styles from './index.module.scss';


class GroupByTrxAmtClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: ['种类', '次数'],
      criteria: [],
      hotSetting: {
        columns: [
          {
            data: 'trx_amt_class',
          },
          {
            data: 'count',
            renderer: 'drillDownRenderer'
          }
        ],
        height: 'auto',
        width: '100%',
        maxHeight: '100%'
      },
      drilldownOptions: {
        '次数': [
          'trx_amt_class',
        ],
      }
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('groupByTrxamtClassChart'), 'light');
    this.initC3(myChart);
  }

  fetchData(criteria) {
    const {getGroupByTrxamtclass} = this.props.actions;
    getGroupByTrxamtclass({case_id: this.props.caseId, criteria, view: {}});
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
        orient: 'horizontal',
        right: '28%',
        width: '60%',
        top: '75%',
        data: [],
        textStyle:{
          width:0
        }
      },
      series: [
        {
          name: '金额种类',
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
          }
        }
      ]
    };

    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bbSearchs.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.bbSearchs.params.criteria)) {
      this.fetchData(nextProps.bbSearchs.params.criteria);
      this.setState({
        criteria: nextProps.bbSearchs.params.criteria,
      })
    }

    if (nextProps.groupBytrxamtclassList && nextProps.groupBytrxamtclassList.length > 0) {
      let legendData = [];
      let seriesData = [];
      nextProps.groupBytrxamtclassList.forEach(item => {
        legendData.push(item.trx_amt_class);
        let obj = {
          name: item.trx_amt_class,
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
    this.props.actions.clearTrxamtclass()
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center"/>
        <div className={styles.GroupByBox}>
          <ExcelView id="groupByTrxamtClassExcel" colHeaders={this.state.colHeaders}
                     hotSetting={this.state.hotSetting || null}
                     isLoading={this.props.isLoading}
                     styles={{width: '60%', display: 'flex', alignItems: 'center'}}
                     drilldown={this.state.drilldownOptions}
                     data={this.props.groupBytrxamtclassList}/>
          <div className={styles.pie} id='groupByTrxamtClassChart'></div>
        </div>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    groupBytrxamtclassList: state.trxamtclass.groupBytrxamtclassList,
    bbSearchs: state.bbSearchs,
    isLoading: state.trxamtclass.showLoading
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByTrxAmtClass);
