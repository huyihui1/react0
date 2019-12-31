import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';


import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from "../../../utils/hotColsDef";


class StartedhourclassChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: ['时间分类', '次数'],
      criteria: [],
      hotSetting: {
        columns:columns.StartedhourclassChart,
      },
      drilldownOptions: {
        '次数': ['started_hour_class'],
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
    downloadIamge(this.state.myChart, 'G4-通话时段(小时)');
  }

  getExcel() {
  }

  fetchData(params) {
    if (params) {
      const {fetchStartedhourclassChart} = this.props.actions;
      fetchStartedhourclassChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    }
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="G4-通话时段(小时)" handleChart={this.handleChart} align={'center'} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="startedhourclassChart" style={{display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="startedhourclassChartExcel" height="300px"
                                           hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                                           drilldown={this.state.drilldownOptions}
                                           colHeaders={this.state.colHeaders}
                                           data={this.props.startedhourclassList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    startedhourclassList: state.pbStat.startedhourclassList,
    startedhourclassItems: state.pbStat.startedhourclassItems,
    search: state.search
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(StartedhourclassChart);
