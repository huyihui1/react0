import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../../../bbStores/bbStat/Trxamtclassandtrxtimel1class';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';


class Trxamtclassandtrxtimel1class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      criteria: [],
      hotSetting: {
        columns: columns.trxamtclassandtrxtimel1class,
        nestedHeaders: [
          [
            '金额分类',
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
          ],
        ],
      },
      drilldownOptions: {
        '4:30~6:59#trx_count': ['trx_amt_class', { trx_time_l1_class: 0 }],
        '4:30~6:59#trx_amt': ['trx_amt_class', { trx_time_l1_class: 0 }],
        '7:00~8:29#trx_count': ['trx_amt_class', { trx_time_l1_class: 1 }],
        '7:00~8:29#trx_amt': ['trx_amt_class', { trx_time_l1_class: 1 }],
        '8:30-11:29#trx_count': ['trx_amt_class', { trx_time_l1_class: 2 }],
        '8:30-11:29#trx_amt': ['trx_amt_class', { trx_time_l1_class: 2 }],
        '11:30~13:59#trx_count': ['trx_amt_class', { trx_time_l1_class: 3 }],
        '11:30~13:59#trx_amt': ['trx_amt_class', { trx_time_l1_class: 3 }],
        '14:00~16:59#trx_count': ['trx_amt_class', { trx_time_l1_class: 4 }],
        '14:00~16:59#trx_amt': ['trx_amt_class', { trx_time_l1_class: 4 }],
        '17:00~18:29#trx_count': ['trx_amt_class', { trx_time_l1_class: 5 }],
        '17:00~18:29#trx_amt': ['trx_amt_class', { trx_time_l1_class: 5 }],
        '18:30~20:59#trx_count': ['trx_amt_class', { trx_time_l1_class: 6 }],
        '18:30~20:59#trx_amt': ['trx_amt_class', { trx_time_l1_class: 6 }],
        '21:00~23:59#trx_count': ['trx_amt_class', { trx_time_l1_class: 7 }],
        '21:00~23:59#trx_amt': ['trx_amt_class', { trx_time_l1_class: 7 }],
        '0:00~4:29#trx_count': ['trx_amt_class', { trx_time_l1_class: 8 }],
        '0:00~4:29#trx_amt': ['trx_amt_class', { trx_time_l1_class: 8 }],
      },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth([
      '时间分类',
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
    const { getGroupByTrxamtclassandtrxtimel1class } = this.props.actions;
    getGroupByTrxamtclassandtrxtimel1class({ case_id: this.props.caseId, criteria, view: {} });
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
    this.props.actions.clearTrxamtclassandtrxtimel1class();
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center" />
        <ExcelView id="trxamtclassandtrxtimel1classExcel"
          colHeaders={this.state.colHeaders}
          hotSetting={this.state.hotSetting || null}
          isLoading={this.props.isLoading}
          drilldown={this.state.drilldownOptions}
          data={this.props.trxamtclassandtrxtimel1classList}
        />
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    trxamtclassandtrxtimel1classList: state.trxamtclassandtrxtimel1class.trxamtclassandtrxtimel1classList,
    bbSearchs: state.bbSearchs,
    isLoading: state.trxamtclassandtrxtimel1class.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(Trxamtclassandtrxtimel1class);
