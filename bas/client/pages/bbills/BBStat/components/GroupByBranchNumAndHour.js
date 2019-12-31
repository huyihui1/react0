import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../../../bbStores/bbStat/GroupByBranchNumAndHour';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';
import { addrComponent } from '../../../../utils/hotRenders';


class GroupByBranchNumAndHour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      criteria: [],
      hotSetting: {
        fixedColumnsLeft: 4,
        columns: columns.groupByBranchNumAndHour,
        nestedHeaders: [
          ['机构号',
            '机构名称',
            '交易次数',
            '总金额',
            ...this.getCellHeaders(),
          ],
          [
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
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: (td, row, col, prop, value, cellProperties) =>{
          if(col ===1){
            const dom = document.createElement('div')
            const component = addrComponent(value,styles)
            ReactDOM.render(component, dom)
            td.innerHTML = ''
            td.appendChild(dom);
            this.domArr.push(dom);
          }
        }
      },
      drilldownOptions: {
        'total_trx_count': ['trx_branch_num'],
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
    this.domArr = [];
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
    const { hotSetting } = this.state;
    const colWidthsArr = setBBColWidth([
      '机构号',
      '机构名称',
      '交易次数',
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
    ]);
    hotSetting.colWidths = colWidthsArr;
  }

  fetchData(criteria) {
    const { getGroupByBranchNumAndHour } = this.props.actions;
    console.log(this.props.actions);
    getGroupByBranchNumAndHour({ case_id: this.props.caseId, criteria, view: {} });
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
    this.props.actions.clearBranchNumAndHour();
    this.unmountCompsOnDoms()
  }
  unmountCompsOnDoms = () => {
    this.domArr.forEach(d =>{
      ReactDOM.unmountComponentAtNode(d)
    })
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center" />
        <ExcelView id="groupByBranchNumAndHourExcel"
          colHeaders={this.state.colHeaders}
          hotSetting={this.state.hotSetting || null}
          isLoading={this.props.isLoading}
          data={this.props.groupByBranchNumAndHourList}
          drilldown={this.state.drilldownOptions}
        />
      </div>
    );
  }
}
const styles = {
  compress: {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    textAlign: 'center',
  },
}
export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    groupByBranchNumAndHourList: state.branchNumAndHours.groupByBranchNumAndHourList,
    bbSearchs: state.bbSearchs,
    isLoading: state.branchNumAndHours.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(GroupByBranchNumAndHour);
