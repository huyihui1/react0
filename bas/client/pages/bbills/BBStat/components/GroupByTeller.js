import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../../../bbStores/bbStat/GroupByTeller';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';
import { addrComponent } from '../../../../utils/hotRenders';


class GroupByTeller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: [
        '柜员号',
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
        fixedColumnsLeft: 5,
        columns: columns.groupByTeller,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: async (td, row, col, prop, value, cellProperties) => {
          if (col === 2){
            const dom  = document.createElement('div')
            const component = addrComponent(value, styles)
            ReactDOM.render(component, dom)
            td.innerHTML = ''
            td.appendChild(dom)//appendChild是dom的方法
            this.domArr.push(dom);
           }
        }
      },
      drilldownOptions: {
        '交易次数': ['trx_branch_num', 'teller_code'],
        '存款次数': ['trx_branch_num', 'teller_code', {trx_direction: 1}],
        '取款次数': ['trx_branch_num', 'teller_code', {trx_direction: -1}],
        '存款金额': ['trx_branch_num', 'teller_code', {trx_direction: 1}],
        '取款金额': ['trx_branch_num', 'teller_code', {trx_direction: -1}],
      },
   
    };
    this.domArr = []
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() { 
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth(this.state.colHeaders);
    hotSetting.colWidths = colWidthsArr;
  }

  fetchData(criteria) {
    const { getGroupByTellers } = this.props.actions;
    getGroupByTellers({ case_id: this.props.caseId, criteria, view: {} });
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
    this.props.actions.clearTellers();
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
        <ExcelView id="groupByTellerExcel"
                   colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   data={this.props.groupByTellerList}
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
    groupByTellerList: state.tellers.groupByTellerList,
    bbSearchs: state.bbSearchs,
    isLoading: state.tellers.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(GroupByTeller);
