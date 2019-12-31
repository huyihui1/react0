import React, {Component} from 'react';
import echarts from 'echarts';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {saveAs} from 'file-saver';
import ajaxs from '../../../utils/ajax'

import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import {setColWidths} from '../../../handontableConfig';


import columns from '../../../utils/hotColsDef';


const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
  '7a', '8a', '9a', '10a', '11a',
  '12p', '1p', '2p', '3p', '4p', '5p',
  '6p', '7p', '8p', '9p', '10p', '11p'];
const days = ['星期一', '星期二', '星期三',
  '星期四', '星期五', '星期六', '星期日'];

const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]];

const mockData = [];

class DurationclassAndstartedtimel2class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: [
        '时间分类',
        '04:30 ~ 06:20',
        '06:21 ~ 07:10',
        '07:11 ~ 07:50',
        '07:51 ~ 08:25',
        '08:26 ~ 11:00',
        '11:01 ~ 11:30',
        '11:31 ~ 12:30',
        '12:31 ~ 13:20',
        '13:21 ~ 14:00',
        '14:01 ~ 16:50',
        '16:51 ~ 17:40',
        '17:41 ~ 18:50',
        '18:51 ~ 20:00',
        '20:01 ~ 21:50',
        '21:51 ~ 23:59',
        '00:00 ~ 04:29',
      ],
      hotSetting: {
        columns: columns.durationclassAndstartedtimel2class,
        fixedColumnsLeft: 1,
        colWidths: [],
      },
      drilldownOptions: {
        '04:30 ~ 06:20': ['duration_class', {started_time_l2_class: '0'}],
        '06:21 ~ 07:10': ['duration_class', {started_time_l2_class: '1'}],
        '07:11 ~ 07:50': ['duration_class', {started_time_l2_class: '2'}],
        '07:51 ~ 08:25': ['duration_class', {started_time_l2_class: '3'}],
        '08:26 ~ 11:00': ['duration_class', {started_time_l2_class: '4'}],
        '11:01 ~ 11:30': ['duration_class', {started_time_l2_class: '5'}],
        '11:31 ~ 12:30': ['duration_class', {started_time_l2_class: '6'}],
        '12:31 ~ 13:20': ['duration_class', {started_time_l2_class: '7'}],
        '13:21 ~ 14:00': ['duration_class', {started_time_l2_class: '8'}],
        '14:01 ~ 16:50': ['duration_class', {started_time_l2_class: '9'}],
        '16:51 ~ 17:40': ['duration_class', {started_time_l2_class: '10'}],
        '17:41 ~ 18:50': ['duration_class', {started_time_l2_class: '11'}],
        '18:51 ~ 20:00': ['duration_class', {started_time_l2_class: '12'}],
        '20:01 ~ 21:50': ['duration_class', {started_time_l2_class: '13'}],
        '21:51 ~ 23:59': ['duration_class', {started_time_l2_class: '14'}],
        '00:00 ~ 04:29': ['duration_class', {started_time_l2_class: '15'}],
      }
    };
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  componentDidMount() {
    // const c1 = echarts.init(document.getElementById('c1'));
    // this.initC1(c1);
    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(this.state.colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting})

  }

  //  通话时段vs通话时长
  initC1(c1) {
    const option = {
      tooltip: {
        position: 'top',
      },
      title: [],
      singleAxis: [],
      series: [],
    };
    this.setState({
      myChart: c1,
    });
    echarts.util.each(days, (day, idx) => {
      option.title.push({
        textBaseline: 'middle',
        top: `${(idx + 0.5) * 100 / 7}%`,
        text: day,
        left: '10%',
        textStyle: {
          fontWeight: 'normal',
        },
      });
      option.singleAxis.push({
        left: '20%',
        type: 'category',
        boundaryGap: false,
        data: hours,
        top: `${idx * 100 / 7 + 5}%`,
        height: `${100 / 7 - 10}%`,
        axisLabel: {
          interval: 2,
        },
      });
      option.series.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'effectScatter',
        data: [],
        symbolSize(dataItem) {
          return dataItem[1] * 2;
        },
      });
    });

    echarts.util.each(data, (dataItem) => {
      option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
    });
    window.addEventListener('resize', () => {
      if (this.state.isChart) {
        c1.resize();
      }
    });
    c1.setOption(option);
  }

  handleChart(bool) {
    this.setState({
      isChart: bool,
      criteria: [],
    });
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-durationclassandstartedtimel2class.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  getImgURL() {
    downloadIamge(this.state.myChart, 'G6-通话时段(详细)vs通话时长');
  }

  fetchData(params) {
    if (params) {
      const {fetchDurationclassAndstartedtimel2classChart} = this.props.actions;
      fetchDurationclassAndstartedtimel2classChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      });
    }
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="G6-通话时段(详细)vs通话时长" align={'center'} handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="c1" style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="durationclassAndstartedtimel2class" colHeaders={this.state.colHeaders}
                                           hotSetting={this.state.hotSetting || null}
                                           drilldown={this.state.drilldownOptions}
                                           data={this.props.durationclassAndstartedtimel2classList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    durationclassAndstartedtimel2classList: state.pbStat.durationclassAndstartedtimel2classList,
    durationclassAndstartedtimel2classItems: state.pbStat.durationclassAndstartedtimel2classItems,
    search: state.search,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(DurationclassAndstartedtimel2class);
