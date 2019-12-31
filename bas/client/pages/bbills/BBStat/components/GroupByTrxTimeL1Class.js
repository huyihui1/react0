import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../bbStores/bbStat/GroupByTrxTimeL1Class';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';


class GroupByTrxTimeL1Class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: ['时间分类', '交易次数', '交易总额'],
      criteria: [],
      hotSetting: {
        columns: columns.groupByTrxTimeL1Class,
      },
      drilldownOptions: {
        '交易次数': ['ttl1'],
      },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {}

  fetchData(criteria) {
    const {getGroupByTrxTimeL1Class} = this.props.actions;
    getGroupByTrxTimeL1Class({case_id: this.props.caseId,criteria,view: {}});
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
    this.props.actions.clearTrxTimeL1Class()
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title}  align="center"/>
        <ExcelView id="groupByTrxTimeL1ClassExcel" colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.trxTimeL1ClassList}/>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    trxTimeL1ClassList: state.trxTimeL1Class.trxTimeL1ClassList,
    bbSearchs:state.bbSearchs,
    isLoading:state.trxTimeL1Class.showLoading
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByTrxTimeL1Class);
