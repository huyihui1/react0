import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../bbStores/bbStat/GroupByWeekday';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';


class GroupByWeekday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: ['周几','次数','金额'],
      criteria: [],
      hotSetting: {
        columns:columns.groupByWeekday,
      },
      drilldownOptions: {
        '周几': ['weekday'],
      },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth(this.state.colHeaders);
    hotSetting.colWidths = colWidthsArr;
  }

  fetchData(criteria) {
    const {getGroupByWeekday} = this.props.actions;
    getGroupByWeekday({case_id: this.props.caseId,criteria,view: {}});
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
    this.props.actions.clearWeekday()
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title}  align="center"/>
        <ExcelView id="weekdayExcel" colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.weekdayList}/>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    weekdayList: state.weekdays.weekdayList,
    bbSearchs:state.bbSearchs,
    isLoading:state.weekdays.showLoading
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByWeekday);
