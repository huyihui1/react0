import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../../../bbStores/bbStat/GroupByTellerAndHour';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';


class GroupByTellerAndHour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      criteria: [],
      hotSetting: {
        fixedColumnsLeft: 5,
        columns: columns.tellerandhour,
        nestedHeaders: [
          ['柜员号',
            '机构号',
            '机构名称',
            '交易次数',
            '总金额',
            '存款次数',
            '取款次数',
            '存款金额',
            '取款金额',
            ...this.getCellHeaders(),
          ],
          [
            '',
            '',
            '',
            '',
            '',
            '',
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
        'total_trx_count': ['trx_branch_num', 'teller_code'],
        'cash_in_count': ['trx_branch_num', 'teller_code', { trx_direction: 1 }],
        'cash_out_count': ['trx_branch_num','teller_code', { trx_direction: -1 }],
        '4时#trx_count': ['trx_branch_num', {trx_hour_class: 0}],
        '4时#trx_amt': ['trx_branch_num', {trx_hour_class: 0}],
        '5时#trx_count': ['trx_branch_num', {trx_hour_class: 1}],
        '5时#trx_amt': ['trx_branch_num', {trx_hour_class: 1}],
        '6时#trx_count': ['trx_branch_num', {trx_hour_class: 2}],
        '6时#trx_amt': ['trx_branch_num', {trx_hour_class: 2}],
        '7时#trx_count': ['trx_branch_num', {trx_hour_class: 3}],
        '7时#trx_amt': ['trx_branch_num', {trx_hour_class: 3}],
        '8时#trx_count': ['trx_branch_num', {trx_hour_class: 4}],
        '8时#trx_amt': ['trx_branch_num', {trx_hour_class: 4}],
        '9时#trx_count': ['trx_branch_num', {trx_hour_class: 5}],
        '9时#trx_amt': ['trx_branch_num', {trx_hour_class: 5}],
        '10时#trx_count': ['trx_branch_num', {trx_hour_class: 6}],
        '10时#trx_amt': ['trx_branch_num', {trx_hour_class: 6}],
        '11时#trx_count': ['trx_branch_num', {trx_hour_class: 7}],
        '11时#trx_amt': ['trx_branch_num', {trx_hour_class: 7}],
        '12时#trx_count': ['trx_branch_num', {trx_hour_class: 8}],
        '12时#trx_amt': ['trx_branch_num', {trx_hour_class: 8}],
        '13时#trx_count': ['trx_branch_num', {trx_hour_class: 9}],
        '13时#trx_amt': ['trx_branch_num', {trx_hour_class: 9}],
        '14时#trx_count': ['trx_branch_num', {trx_hour_class: 10}],
        '14时#trx_amt': ['trx_branch_num', {trx_hour_class: 10}],
        '15时#trx_count': ['trx_branch_num', {trx_hour_class: 11}],
        '15时#trx_amt': ['trx_branch_num', {trx_hour_class: 11}],
        '16时#trx_count': ['trx_branch_num', {trx_hour_class: 12}],
        '16时#trx_amt': ['trx_branch_num', {trx_hour_class: 12}],
        '17时#trx_count': ['trx_branch_num', {trx_hour_class: 13}],
        '17时#trx_amt': ['trx_branch_num', {trx_hour_class: 13}],
        '18时#trx_count': ['trx_branch_num', {trx_hour_class: 14}],
        '18时#trx_amt': ['trx_branch_num', {trx_hour_class: 14}],
        '19时#trx_count': ['trx_branch_num', {trx_hour_class: 15}],
        '19时#trx_amt': ['trx_branch_num', {trx_hour_class: 15}],
        '20时#trx_count': ['trx_branch_num', {trx_hour_class: 16}],
        '20时#trx_amt': ['trx_branch_num', {trx_hour_class: 16}],
        '21时#trx_count': ['trx_branch_num', {trx_hour_class: 17}],
        '21时#trx_amt': ['trx_branch_num', {trx_hour_class: 17}],
        '22时#trx_count': ['trx_branch_num', {trx_hour_class: 18}],
        '22时#trx_amt': ['trx_branch_num', {trx_hour_class: 18}],
        '23时#trx_count': ['trx_branch_num', {trx_hour_class: 19}],
        '23时#trx_amt': ['trx_branch_num', {trx_hour_class: 19}],
        '0时#trx_count': ['trx_branch_num', {trx_hour_class: 20}],
        '0时#trx_amt': ['trx_branch_num', {trx_hour_class: 20}],
        '1时#trx_count': ['trx_branch_num', {trx_hour_class: 21}],
        '1时#trx_amt': ['trx_branch_num', {trx_hour_class: 21}],
        '2时#trx_count': ['trx_branch_num', {trx_hour_class: 22}],
        '2时#trx_amt': ['trx_branch_num', {trx_hour_class: 22}],
        '3时#trx_count': ['trx_branch_num', {trx_hour_class: 23}],
        '3时#trx_amt': ['trx_branch_num', {trx_hour_class: 23}],
      },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  getCellHeaders = () => {
    const arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push({
        label: i + 4 >= 24 ? i - 20 + '时' : `${i + 4}时`,
        colspan: 2,
      });
    }
    return arr;
  }

  componentDidMount() {
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth([
      '柜员号',
      '机构号',
      '机构名称',
      '交易次数',
      '总金额',
      '存款次数',
      '取款次数',
      '存款金额',
      '取款金额',
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
    ],);
    hotSetting.colWidths = colWidthsArr;
  }

  fetchData(criteria) {
    const { getGroupByTellerandhour } = this.props.actions;
    console.log(this.props.actions);
    getGroupByTellerandhour({ case_id: this.props.caseId, criteria, view: {} });
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
    this.props.actions.clearTellerandhour();
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center" />
        <ExcelView id="tellerandhourExcel"
                   colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   data={this.props.tellerandhourList}
                   drilldown={this.state.drilldownOptions}
        />
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    tellerandhourList: state.tellerandhours.tellerandhourList,
    bbSearchs: state.bbSearchs,
    isLoading: state.tellerandhours.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(GroupByTellerAndHour);
