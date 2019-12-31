import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../bbStores/bbStat/GroupByTrxHourClass';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';


class GroupByTrxHourClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: ['时间分类', '交易次数', '交易总额'],
      criteria: [],
      hotSetting: {
        columns: columns.trxHourClass,
      },
      drilldownOptions: {
        '交易次数': ['thc'],
      },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {}

  fetchData(criteria) {
    const {getGroupByTrxHourClass} = this.props.actions;
    getGroupByTrxHourClass({case_id: this.props.caseId,criteria,view: {}});
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
    this.props.actions.clearTrxHourClass()
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title}  align="center"/>
        <ExcelView id="trxHourClassExcel" colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.trxHourClassList}/>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    trxHourClassList: state.trxHourClass.trxHourClassList,
    bbSearchs:state.bbSearchs,
    isLoading:state.trxHourClass.showLoading
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByTrxHourClass);
