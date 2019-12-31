import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';


import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../utils/hotColsDef'



class Ownercommloc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: ['地点', '通话次数', '联系天数'],
      criteria: [],
      hotSetting: {
        columns: columns.Ownercommloc,
      },
      drilldownOptions: {
        '通话次数': ['owner_comm_loc'],
        '联系天数': ['owner_comm_loc'],
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
    downloadIamge(this.state.myChart, 'F4-本方通话地');
  }

  getExcel() {
  }

  fetchData(params) {
    if (params) {
      const {fetchOwnercommlocChart} = this.props.actions;
      fetchOwnercommlocChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    }
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="F4-本方通话地" align="center" handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="Ownercommloc" style={{display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="ownercommloc" height="300px"
                                           hotSetting={this.state.hotSetting || null}
                                           drilldown={this.state.drilldownOptions}
                                           colHeaders={this.state.colHeaders}
                                           data={this.props.ownercommlocList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    ownercommlocList: state.pbStat.ownercommlocList,
    ownercommlocItems: state.pbStat.ownercommlocItems,
    search: state.search
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(Ownercommloc);
