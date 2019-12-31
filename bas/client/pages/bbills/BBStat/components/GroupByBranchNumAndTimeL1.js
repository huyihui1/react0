import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../../../bbStores/bbStat/GroupByBranchNumAndTimeL1';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';
import { addrComponent } from '../../../../utils/hotRenders';


class GroupByBranchNumAndTimeL1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      criteria: [],
      hotSetting: {
        fixedColumnsLeft: 4,
        columns: columns.branchNumAndTimeL1,
        nestedHeaders: [
          ['机构号',
            '机构名称',
            '交易次数',
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
            }],
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
          ]
        ],
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: (td, row, col, prop, value, cellProperties) =>{
        if (col === 1){
          const dom  = document.createElement('div')
          const component = addrComponent(value, styles)
          ReactDOM.render(component, dom)
          td.innerHTML = ''
          td.appendChild(dom);
          this.domArr.push(dom);
         }
        }
      },
      drilldownOptions: {
        'total_trx_count': ['trx_branch_num'],
        '4:30~6:59#trx_count': ['trx_branch_num', {trx_time_l1_class: 0}],
        '4:30~6:59#trx_amt': ['trx_branch_num', {trx_time_l1_class: 0}],
        '7:00~8:29#trx_count': ['trx_branch_num', {trx_time_l1_class: 1}],
        '7:00~8:29#trx_amt': ['trx_branch_num', {trx_time_l1_class: 1}],
        '8:30-11:29#trx_count': ['trx_branch_num', {trx_time_l1_class: 2}],
        '8:30-11:29#trx_amt': ['trx_branch_num', {trx_time_l1_class: 2}],
        '11:30~13:59#trx_count': ['trx_branch_num', {trx_time_l1_class: 3}],
        '11:30~13:59#trx_amt': ['trx_branch_num', {trx_time_l1_class: 3}],
        '14:00~16:59#trx_count': ['trx_branch_num', {trx_time_l1_class: 4}],
        '14:00~16:59#trx_amt': ['trx_branch_num', {trx_time_l1_class: 4}],
        '17:00~18:29#trx_count': ['trx_branch_num', {trx_time_l1_class: 5}],
        '17:00~18:29#trx_amt': ['trx_branch_num', {trx_time_l1_class: 5}],
        '18:30~20:59#trx_count': ['trx_branch_num', {trx_time_l1_class: 6}],
        '18:30~20:59#trx_amt': ['trx_branch_num', {trx_time_l1_class: 6}],
        '21:00~23:59#trx_count': ['trx_branch_num', {trx_time_l1_class: 7}],
        '21:00~23:59#trx_amt': ['trx_branch_num', {trx_time_l1_class: 7}],
        '0:00~4:29#trx_count': ['trx_branch_num', {trx_time_l1_class: 8}],
        '0:00~4:29#trx_amt': ['trx_branch_num', {trx_time_l1_class: 8}],
      },
    };
    this.fetchData = this.fetchData.bind(this);
    this.domArr = [];
  }

  componentDidMount() {
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth([
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
    ]);
    hotSetting.colWidths = colWidthsArr;
  }

  fetchData(criteria) {
    const { getGroupByBranchNumAndTimeL1 } = this.props.actions;
    getGroupByBranchNumAndTimeL1({ case_id: this.props.caseId, criteria, view: {} });
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
    this.props.actions.clearBranchNumAndTimeL1();
    this.unmountCompsOnDoms();
  }
  unmountCompsOnDoms = () => {
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
  };
  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center" />
        <ExcelView id="branchNumAndTimeL1Excel"
          colHeaders={this.state.colHeaders}
          hotSetting={this.state.hotSetting || null}
          isLoading={this.props.isLoading}
          drilldown={this.state.drilldownOptions}
          data={this.props.branchNumAndTimeL1List}
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
    branchNumAndTimeL1List: state.branchNumAndTimeL1.branchNumAndTimeL1List,
    bbSearchs: state.bbSearchs,
    isLoading: state.branchNumAndTimeL1.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(GroupByBranchNumAndTimeL1);
