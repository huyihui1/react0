import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../bbStores/bbStat/GroupByTrxDayAndTimeL1';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';


class GroupByTrxDayAndTimeL1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      criteria: [],
      hotSetting: {
        fixedColumnsLeft: 3,
        columns: columns.groupByTrxDayAndTimeL1,
        viewportColumnRenderingOffset: 70,
        nestedHeaders: [
          [
            '日期',
            '次数',
            '总金额',
            {
              label: '4:30 ~ 6:59',
              colspan: 2,
            },
            {
              label: '7:00 ~ 8:29',
              colspan: 2,
            },
            {
              label: '8:30 ~ 11:29',
              colspan: 2,
            },
            {
              label: '11:30 ~ 13:59',
              colspan: 2,
            },
            {
              label: '14:00 ~ 16:59',
              colspan: 2,
            },
            {
              label: '17:00 ~ 18:29',
              colspan: 2,
            },
            {
              label: '18:30 ~ 20:59',
              colspan: 2,
            },
            {
              label: '21:00 ~ 23:59',
              colspan: 2,
            },
            {
              label: '0:00 ~ 4:29',
              colspan: 2,
            },
          ],
          [
            '',
            '',
            '',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
          ]
        ],
      },
      drilldownOptions: {
        'total_trx_amt': ['trx_day'],
        '4:30~6:59#trx_count': ['trx_day', {trx_time_l1_class: 0}],
        '4:30~6:59#trx_amt': ['trx_day', {trx_time_l1_class: 0}],
        '7:00~8:29#trx_count': ['trx_day', {trx_time_l1_class: 1}],
        '7:00~8:29#trx_amt': ['trx_day', {trx_time_l1_class: 1}],
        '8:30-11:29#trx_count': ['trx_day', {trx_time_l1_class: 2}],
        '8:30-11:29#trx_amt': ['trx_day', {trx_time_l1_class: 2}],
        '11:30~13:59#trx_count': ['trx_day', {trx_time_l1_class: 3}],
        '11:30~13:59#trx_amt': ['trx_day', {trx_time_l1_class: 3}],
        '14:00~16:59#trx_count': ['trx_day', {trx_time_l1_class: 4}],
        '14:00~16:59#trx_amt': ['trx_day', {trx_time_l1_class: 4}],
        '17:00~18:29#trx_count': ['trx_day', {trx_time_l1_class: 5}],
        '17:00~18:29#trx_amt': ['trx_day', {trx_time_l1_class: 5}],
        '18:30~20:59#trx_count': ['trx_day', {trx_time_l1_class: 6}],
        '18:30~20:59#trx_amt': ['trx_day', {trx_time_l1_class: 6}],
        '21:00~23:59#trx_count': ['trx_day', {trx_time_l1_class: 7}],
        '21:00~23:59#trx_amt': ['trx_day', {trx_time_l1_class: 7}],
        '0:00~4:29#trx_count': ['trx_day', {trx_time_l1_class: 8}],
        '0:00~4:29#trx_amt': ['trx_day', {trx_time_l1_class: 8}],
      },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth([
      '日期',
      '次数',
      '总金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
    ]);
    hotSetting.colWidths = colWidthsArr;
  }

  fetchData(criteria) {
    const {getGroupByTrxDayAndTimeL1} = this.props.actions;
    getGroupByTrxDayAndTimeL1({case_id: this.props.caseId, criteria, view: {}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bbSearchs.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.bbSearchs.params.criteria)) {
      this.fetchData(nextProps.bbSearchs.params.criteria);
      this.setState({
        criteria: nextProps.bbSearchs.params.criteria,
      })
    }
  }
  componentWillUnmount() {
    this.props.actions.clearTrxDayAndTimeL1()
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center"/>
        <ExcelView id="groupByTrxDayAndTimeL1Excel" colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.groupByTrxDayAndTimeL1List}/>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    groupByTrxDayAndTimeL1List: state.trxDayAndTimeL1.groupByTrxDayAndTimeL1List,
    bbSearchs: state.bbSearchs,
    isLoading: state.trxDayAndTimeL1.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByTrxDayAndTimeL1);
