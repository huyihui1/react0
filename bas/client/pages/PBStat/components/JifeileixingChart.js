import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';


import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../utils/hotColsDef'


const mockData = [{
  1: 335,
  2: 310,
  3: 234,
}];

const chartData = (data) => {
  const arr = [];
  for (const key in data) {
    let k = null;
    if (key == 1) {
      k = '通话';
    } else if (key == 2) {
      k = '短信';
    } else {
      k = '彩信';
    }
    arr.push({name: k, value: data[key]});
  }
  return arr;
};


class JifeileixingChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: ['类型', '次数'],
      criteria: [],
      hotSetting: {
        columns: columns.JifeileixingChart,
      },
      drilldownOptions: {
        '次数': ['bill_type'],
      },
    };
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('jifeileixingChart'), 'light');
    this.initC3(myChart);
  }

  //  时间+组成+总数
  initC3(myChart) {
    this.setState({
      myChart,
    });
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        // orient: 'vertical',
        left: 'left',
        data: ['通话', '短信', '彩信'],
      },
      series: [
        {
          name: '计费类型',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
          },
          center: ['50%', '60%'],
          data: chartData(mockData[0]),
        },
      ],
    };

    window.addEventListener('resize', () => {
      if (this.state.isChart) {
        myChart.resize();
      }
    });
    myChart.setOption(option);
  }

  handleChart(bool) {
    this.setState({
      isChart: bool,
    });
  }

  getImgURL() {
    downloadIamge(this.state.myChart, 'F1-计费类型');
  }

  getExcel() {
  }

  fetchData(params) {
    if (params) {
      const {fetchGroupByBillTypeChart} = this.props.actions;
      fetchGroupByBillTypeChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
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
        <ChartTitle title="F1-计费类型"  align="center" handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="jifeileixingChart" style={{display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="jifeileixingChartExcel" colHeaders={this.state.colHeaders}
                                           hotSetting={this.state.hotSetting || null}
                                           drilldown={this.state.drilldownOptions}
                                           data={this.props.chargingList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    chargingList: state.pbStat.chargingList,
    chargingItems: state.pbStat.chargingItems,
    search: state.search
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(JifeileixingChart);
