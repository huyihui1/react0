import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';


import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from "../../../utils/hotColsDef";


class DurationclassChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: ['时间分类', '次数'],
      criteria: [],
      hotSetting: {
        columns:columns.DurationclassChart,
      },
      drilldownOptions: {
        '次数': ['duration_class'],
      }
    };
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      })
    }
  }

  handleChart(bool) {
    this.setState({
      isChart: bool,
    });
  }

  getImgURL() {
    downloadIamge(this.state.myChart, 'G1-时长段');
  }

  getExcel() {
  }

  fetchData(params) {
    if (params) {
      const {fetchDurationclassChart} = this.props.actions;
      fetchDurationclassChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    }

  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="G1-时长段" handleChart={this.handleChart} align={'center'}  getImgURL={this.getImgURL} getExcel={this.getExcel}/>
        <div id="durationclassChart" style={{display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="durationclassChartExcel" height="300px"
                                           hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                                           drilldown={this.state.drilldownOptions}
                                           colHeaders={this.state.colHeaders}
                                           data={this.props.durationclassList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    durationclassList: state.pbStat.durationclassList,
    durationclassItems: state.pbStat.durationclassItems,
    search: state.search
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(DurationclassChart);
