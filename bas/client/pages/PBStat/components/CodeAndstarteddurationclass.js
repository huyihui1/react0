import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect, Provider} from 'react-redux';
import echarts from 'echarts';
import {saveAs} from 'file-saver';
import ajaxs from '../../../utils/ajax'

import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import {store} from "../../../index";
import {Balloon} from "@alifd/next";
import MapComponent from '../../common/MapComponent';
import ReactDOM from "react-dom";
import {setColWidths} from '../../../handontableConfig';

import columns from '../../../utils/hotColsDef';
import {addrComponent, codeMap} from "../../../utils/hotRenders";
import appConfig from "../../../appConfig";



let colHeaders = [
  '基站代码',
  '标注',
  '总计',
  '地址',
  'LAC',
  'CI',
  '其他',
  '1~15秒',
  '16~90秒',
  '1.5~3分',
  '3~5分',
  '5~10分',
  '>10分',
];

class CodeAndstarteddurationclass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      codeandstarteddurationclassItems: [],
      colHeaders: colHeaders,
      hotSetting: {
        fixedColumnsLeft: 3,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns:columns.codeAndstarteddurationclass,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: (td, row, col, prop, value, cellProperties) => {
          // console.log(td, row, col);
          if (col === 0) {
            const dom = document.createElement('div');
            const component = codeMap(value,appConfig.reportMap)
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
          if (col === 3) {
            const dom = document.createElement('div');
            const component = addrComponent(value, styles)
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
        }
      },
      drilldownOptions: {
        '总计': ['owner_ct_code'],
        '其他': ['owner_ct_code',{duration_class: '0'}],
        '1~15秒': ['owner_ct_code', {duration_class: '1'}],
        '16~90秒': ['owner_ct_code', {duration_class: '2'}],
        '1.5~3分': ['owner_ct_code', {duration_class: '3'}],
        '3~5分': ['owner_ct_code', {duration_class: '4'}],
        '5~10分': ['owner_ct_code', {duration_class: '5'}],
        '>10分': ['owner_ct_code', {duration_class: '6'}],
      }
    };
    this.domArr = [];
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('codeandstarteddurationclass'), 'light');
    this.initC3(myChart);

    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting})
  }

  cellLabelRender = (arr, code) => {
    let dom = null;
    Array.isArray(arr) && arr.forEach(item => {
      if (item.ct_code === code) {
        dom = `<div style="background: ${item.marker_color}; color: #fff; text-align: center">${item.label}</div>`;
      }
    });
    return dom;
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
    downloadIamge(this.state.myChart, 'B6-基站vs通话时长');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-codeandstarteddurationclass.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    const {fetchCodeandstarteddurationclassChart} = this.props.actions;
    fetchCodeandstarteddurationclassChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      })
    }
  }

  componentWillUnmount() {
    this.props.actions.clearCodeandstarteddurationclassChart();
    this.unmountCompsOnDoms();
  }

  unmountCompsOnDoms = () => {
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
  };


  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="B6-基站vs通话时长" align={'center'} handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="codeandstarteddurationclass" style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="codeandstarteddurationclassExcel" colHeaders={this.state.colHeaders}
                                           hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                                           drilldown={this.state.drilldownOptions}
                                           data={this.props.codeandstarteddurationclassList}/> : null
        }
      </div>
    );
  }
}

const styles = {
  compress: {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    textAlign: 'left'
  }
};

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    codeandstarteddurationclassList: state.pbStat.codeandstarteddurationclassList,
    codeandstarteddurationclassItems: state.pbStat.codeandstarteddurationclassItems,
    search: state.search,
    labelCells: state.labelCells,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CodeAndstarteddurationclass);
