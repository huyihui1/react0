import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../../../bbStores/bbStat/GroupByBranchnum';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';
import { addrComponent } from '../../../../utils/hotRenders';


class GroupByBranchnum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: [
        '机构号',
        '机构名称',
        '交易次数',
        '总金额',
        '存款次数',
        '取款次数',
        '存款金额',
        '取款金额',
        '首次交易时间',
        '末次交易时间',
      ],
      criteria: [],
      hotSetting: {
        fixedColumnsLeft: 4,
        columns: columns.groupByBranchnum,//表示下传的条件
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer:  (td, row, col, prop, value, cellProperties) =>{
          if (col === 1){
          const dom  = document.createElement('div')
          const component = addrComponent(value, styles)
          ReactDOM.render(component, dom)
          td.innerHTML = ''
          td.appendChild(dom);
          this.domArr.push(dom)
         }
         if (col === 4){
          const dom  = document.createElement('div')
          const component = addrComponent(value, styles)
          ReactDOM.render(component, dom)
          td.innerHTML = ''
          td.appendChild(dom);
          this.domArr.push(dom)
         }
        }
      },
      drilldownOptions: {
        '交易次数': ['trx_branch_num'],
        '存款次数': ['trx_branch_num', {trx_direction: 1}],
        '取款次数': ['trx_branch_num', {trx_direction: -1}],
        '存款金额': ['trx_branch_num', {trx_direction: 1}],
        '取款金额': ['trx_branch_num', {trx_direction: -1}],
      },
    };
    this.fetchData = this.fetchData.bind(this);
    this.domArr = [];
  }

  componentDidMount() {
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth(this.state.colHeaders);
    hotSetting.colWidths = colWidthsArr;
  }

  fetchData(criteria) {
    const { getGroupByBranchnums } = this.props.actions;
    getGroupByBranchnums({ case_id: this.props.caseId, criteria, view: {} });
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
    this.props.actions.clearBranchnums();
    this.unmountCompsOnDoms()
  }
  unmountCompsOnDoms = ()=> {
    this.domArr.forEach(d =>{
      ReactDOM.unmountComponentAtNode(d);
    })
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center" />
        <ExcelView id="groupByBranchnumExcel"
          colHeaders={this.state.colHeaders}
          hotSetting={this.state.hotSetting || null}
          //isLoading={this.props.isLoading}
          drilldown={this.state.drilldownOptions}
          data={this.props.groupByBranchnumList}
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
    groupByBranchnumList: state.branchnums.groupByBranchnumList,
    bbSearchs: state.bbSearchs,
    isLoading: state.branchnums.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(GroupByBranchnum);
