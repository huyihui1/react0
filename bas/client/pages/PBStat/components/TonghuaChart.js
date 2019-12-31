import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';


import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../utils/hotColsDef'



class TonghuaChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: ['本方号码状态', '次数'],
      criteria: [],
      hotSetting: {
        columns: columns.TonghuaChart,
      },
      drilldownOptions: {
        '次数': ['owner_num_status'],
      },
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
    downloadIamge(this.state.myChart, 'F3-通话状态');
  }

  getExcel() {
  }

  fetchData(params) {
    if (params) {
      const {fetchOwnernumstatusChart} = this.props.actions;
      fetchOwnernumstatusChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    }
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="F3-通话类型" align="center" handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="tonghuaChart" style={{display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="tonghuaExcel" height="300px"
                                           hotSetting={this.state.hotSetting || null}
                                           drilldown={this.state.drilldownOptions}
                                           colHeaders={this.state.colHeaders}
                                           data={this.props.ownernumstatusList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    ownernumstatusList: state.pbStat.ownernumstatusList,
    ownernumstatusItems: state.pbStat.ownernumstatusItems,
    search: state.search
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(TonghuaChart);
