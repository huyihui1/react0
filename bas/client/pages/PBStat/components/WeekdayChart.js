import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import echarts from 'echarts';


import { actions } from '../../../stores/pbStat';
import { downloadIamge } from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../utils/hotColsDef'
import {addrComponent, codeMap} from "../../../utils/hotRenders";
import ReactDOM from "react-dom";




class WeekdayChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: ['周几', '次数'],
      criteria: [],
      hotSetting: {
        columns: columns.WeekdayChart,
      },
      drilldownOptions: {
        '次数': ['weekday'],
      },
    };
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {}

  handleChart(bool) {
    this.setState({
      isChart: bool,
    });
  }

  getImgURL() {
    downloadIamge(this.state.myChart, 'H1-一周分布');
  }

  getExcel() {}

  fetchData(params) {
    if (params) {
      const { fetchWeekdayChart } = this.props.actions;
      fetchWeekdayChart({ case_id: this.props.caseId, ...{criteria: params, view: {}} });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      })
    }
  }
  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="H1-一周分布" align={'center'}  handleChart={this.handleChart} getImgURL={this.getImgURL} getExcel={this.getExcel} />
        <div id="weekdayChart" style={{  display: this.state.isChart ? 'block' : 'none' }} />
        {
          !this.state.isChart ? <ExcelView id="weekdayChartExcel"  drilldown={this.state.drilldownOptions} hotSetting={this.state.hotSetting || null} colHeaders={this.state.colHeaders} data={this.props.weekdayList} /> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    weekdayList: state.pbStat.weekdayList,
    weekdayItems: state.pbStat.weekdayItems,
    search: state.search
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(WeekdayChart);
