import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';


import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from "../../../utils/hotColsDef";


class Startedtimel2classChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: ['时间分类', '次数'],
      criteria: [],
      hotSetting: {
        columns:columns.Startedtimel2classChart,
      },
      drilldownOptions: {
        '次数': ['started_time_l2_class'],
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
    downloadIamge(this.state.myChart, 'G3-通话时段(详细)');
  }

  getExcel() {
  }

  fetchData(params) {
    if (params) {
      const {fetchStartedtimel2classChart} = this.props.actions;
      fetchStartedtimel2classChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    }
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="G3-通话时段(详细)" handleChart={this.handleChart}  align={'center'} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="startedtimel2classChart" style={{display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="startedtimel2classChartExcel" height="300px"
                                           hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                                           drilldown={this.state.drilldownOptions}
                                           colHeaders={this.state.colHeaders}
                                           data={this.props.startedtimel2classList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    startedtimel2classList: state.pbStat.startedtimel2classList,
    startedtimel2classItems: state.pbStat.startedtimel2classItems,
    search: state.search
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(Startedtimel2classChart);
