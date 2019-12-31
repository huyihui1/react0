import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';
import {saveAs} from 'file-saver';
import ajaxs from '../../../utils/ajax'

import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../utils/hotColsDef';
import {addrComponent, codeMap} from "../../../utils/hotRenders";
import ReactDOM from "react-dom";


class OwnerLac extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      ownerlacItems: [],
      colHeaders: [
        'LAC',
        '联系次数',
      ],
      hotSetting: {
        columns:columns.OwnerLac,
      },
      drilldownOptions: {
        '联系次数': ['owner_lac'],
      }
    };
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('ownerlac'), 'light');
    this.initC3(myChart);
  }


  initC3(myChart) {
    this.setState({
      myChart,
    });
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          textStyle: {
            color: '#fff',
          },

        },
      },
      grid: {
        borderWidth: 0,
        top: 110,
        bottom: 95,
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        x: '4%',
        top: '8px',
        textStyle: {
          color: '#90979c',
        },
        data: [],
      },


      calculable: true,
      xAxis: [{
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#90979c',
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        axisLabel: {
          interval: 0,

        },
        data: [],
      }],
      yAxis: [{
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#90979c',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,

        },
        splitArea: {
          show: false,
        },

      }],
      // dataZoom: [{
      //   show: true,
      //   height: 30,
      //   xAxisIndex: [
      //     0,
      //   ],
      //   bottom: 30,
      //   start: 0,
      //   end: 10,
      //   handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      //   handleSize: '110%',
      //   handleStyle: {
      //     color: '#ccc',
      //
      //   },
      //   textStyle: {
      //     color: '#fff',
      //   },
      //   borderColor: '#444a4f',
      // },
      // {
      //   type: 'inside',
      //   show: true,
      //   height: 15,
      //   start: 1,
      //   end: 35,
      // }],
      series: [{
        name: '次数',
        type: 'bar',
        barMaxWidth: 35,
        barGap: '10%',
        itemStyle: {
          normal: {
            color: 'rgba(255,144,128,1)',
            label: {
              show: true,
              textStyle: {
                color: '#fff',
              },
              position: 'insideTop',
              // formatter(p) {
              //   return p.value > 0 ? (p.value) : '';
              // },
            },
          },
        },
        data: [],
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
    downloadIamge(this.state.myChart, 'B5-基站LAC');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownerlac.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    const {fetchOwnerlacChart} = this.props.actions;
    fetchOwnerlacChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
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
        <ChartTitle title="B5-基站LAC" align={'center'} handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="ownerlac" style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="ownerlacExcel" colHeaders={this.state.colHeaders}
                                           hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                                           drilldown={this.state.drilldownOptions}
                                           data={this.props.ownerlacList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    ownerlacList: state.pbStat.ownerlacList,
    ownerlacItems: state.pbStat.ownerlacItems,
    search: state.search
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(OwnerLac);
