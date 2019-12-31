import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';


import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from "../../../utils/hotColsDef";


class Startedtimel1classChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: ['时间分类', '次数'],
      criteria: [],
      hotSetting: {
        columns:columns.Startedtimel1classChart,
      },
      drilldownOptions: {
        '次数': ['started_time_l1_class'],
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
    downloadIamge(this.state.myChart, 'G2-通话时段');
  }

  getExcel() {
  }

  fetchData(params) {
    if (params) {
      const {fetchStartedtimel1classChart} = this.props.actions;
      fetchStartedtimel1classChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    }
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="G2-通话时段" handleChart={this.handleChart} align={'center'} getImgURL={this.getImgURL} getExcel={this.getExcel}/>
        <div id="startedtimel1classChart" style={{display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="startedtimel1classChartExcel" height="300px"
                                           hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                                           drilldown={this.state.drilldownOptions}
                                           colHeaders={this.state.colHeaders}
                                           data={this.props.startedtimel1classList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    startedtimel1classList: state.pbStat.startedtimel1classList,
    startedtimel1classItems: state.pbStat.startedtimel1classItems,
    search: state.search
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(Startedtimel1classChart);
