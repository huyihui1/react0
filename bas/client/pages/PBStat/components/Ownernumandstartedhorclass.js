import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import echarts from 'echarts';
import { saveAs } from 'file-saver';
import ajaxs from '../../../utils/ajax';

import { actions } from '../../../stores/pbStat';
import { downloadIamge } from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import { fun } from '../../../utils/hotRenders';
import {setColWidths} from "../../../handontableConfig";
import columns from '../../../utils/hotColsDef'


class Ownernumandstartedhorclass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      ownernumandstartedhorclassList: null,
      colHeaders: [
        '话单号码',
        '号码标注',
        '号码标签',
        '次数',
        '联系天数',
        '首次',
        '末次',
        '04时',
        '05时',
        '06时',
        '07时',
        '08时',
        '09时',
        '10时',
        '11时',
        '12时',
        '13时',
        '14时',
        '15时',
        '16时',
        '17时',
        '18时',
        '19时',
        '20时',
        '21时',
        '22时',
        '23时',
        '00时',
        '01时',
        '02时',
        '03时',
      ],
      criteria: {},
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        fixedColumnsLeft: 5,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns: columns.ctLableForOwnernumAndstartedhourclass,
      },
      drilldownOptions: {
        '次数': ['owner_num'],
        '联系天数': ['owner_ct_code', 'owner_num'],
        '04时': ['owner_ct_code', 'owner_num', {started_hour_class:'0'}],
        '05时': ['owner_ct_code', 'owner_num', {started_hour_class:'1'}],
        '06时': ['owner_ct_code', 'owner_num', {started_hour_class:'2'}],
        '07时': ['owner_ct_code', 'owner_num', {started_hour_class:'3'}],
        '08时': ['owner_ct_code', 'owner_num', {started_hour_class:'4'}],
        '09时': ['owner_ct_code', 'owner_num', {started_hour_class:'5'}],
        '10时': ['owner_ct_code', 'owner_num', {started_hour_class:'6'}],
        '11时': ['owner_ct_code', 'owner_num', {started_hour_class:'7'}],
        '12时': ['owner_ct_code', 'owner_num', {started_hour_class:'8'}],
        '13时': ['owner_ct_code', 'owner_num', {started_hour_class:'9'}],
        '14时': ['owner_ct_code', 'owner_num', {started_hour_class:'10'}],
        '15时': ['owner_ct_code', 'owner_num', {started_hour_class:'11'}],
        '16时': ['owner_ct_code', 'owner_num', {started_hour_class:'12'}],
        '17时': ['owner_ct_code', 'owner_num', {started_hour_class:'13'}],
        '18时': ['owner_ct_code', 'owner_num', {started_hour_class:'14'}],
        '19时': ['owner_ct_code', 'owner_num', {started_hour_class:'15'}],
        '20时': ['owner_ct_code', 'owner_num', {started_hour_class:'16'}],
        '21时': ['owner_ct_code', 'owner_num', {started_hour_class:'17'}],
        '22时': ['owner_ct_code', 'owner_num', {started_hour_class:'18'}],
        '23时': ['owner_ct_code', 'owner_num', {started_hour_class:'19'}],
        '00时': ['owner_ct_code', 'owner_num', {started_hour_class:'20'}],
        '01时': ['owner_ct_code', 'owner_num', {started_hour_class:'21'}],
        '02时': ['owner_ct_code', 'owner_num', {started_hour_class:'22'}],
        '03时': ['owner_ct_code', 'owner_num', {started_hour_class:'23'}],
      },
      isLoading: false,
      styles: null
    };
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }
  componentDidMount() {
    const myChart = echarts.init(document.getElementById('codeandstartedhourclass'), 'light');
    this.initC3(myChart);
    if (this.props.criteria) {
      this.fetchData(this.props.criteria, {});
    }
    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(this.state.colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting})

  }

  numLabelRender = (arr, num) => {
    let dom = null;
    let n = null;
    Array.isArray(arr) && arr.forEach(item => {
      if (item.num === num) {
        dom = `<div style="background: ${item.label_bg_color}; color: #fff; text-align: center">${item.label}</div>`;
        n = item;
      }
    });
    return {
      dom,
      num: n,
    };
  };

  cellRender(instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = '';
    td.style.textAlign = 'center';

    if (value) {
      td.innerHTML = value;
    }
    if (col === 1) {
      td.style.width = '136px';
      const ownerNum = instance.getDataAtCell(row, 0);
      if (ownerNum) {
        const result = this.numLabelRender(this.props.labelPNs.LargItems, ownerNum);
        if (result.dom) {
          td.innerHTML = result.dom;
        } else if (value) {
          td.innerHTML = value;
        }
      }
    } else if (col === 2) {
      let newVal = [];
      const ownerNum = instance.getDataAtCell(row, 0);
      const tags = this.numLabelRender(this.props.labelPNs.LargItems, ownerNum);
      if (tags.num) {
        if (tags.num.label_groups) {
          newVal = newVal.concat(tags.num.label_groups);
        }
        if (tags.num.ptags) {
          if (typeof tags.num.ptags === 'string') {
            newVal = newVal.concat(JSON.parse(tags.num.ptags));
          } else {
            newVal = newVal.concat(tags.num.ptags);
          }
        }
      }
      if (newVal.length > 0) {
        td.innerHTML = `<div>${newVal.join(', ')}</div>`;
      }
    }

    return td;
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
    downloadIamge(this.state.myChart, '基站vs通话时段(小时)');
  }
  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownernumandstartedhorclass.xlsx`, { criteria: this.props.search.criteria, view: {} }, { responseType: 'blob' }, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }
  fetchData(params, adhoc = {}) {
    this.setState({
      isLoading: true,
    });
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownernumandstartedhorclass`, { criteria: params, adhoc }).then(res => {
      if (res.meta && res.meta.success) {
        this.setState({
          ownernumandstartedhorclassList: this.formatOwnernumandstartedhorclass(res.data),
          isLoading: false,
        });
      }
    });
  }

  formatOwnernumandstartedhorclass(data) {
    const map = {},
      arr = [],
      arr2 = [];

    for (let i = 0; i < data.length; i++) {
      let ai = {};
      const tempArr = [];
      for (let j = 0; j < data[i].length; j++) {
        const a2 = data[i][j];
        ai = {...ai, ...a2};
      }
      arr2.push(ai);
    }
    return arr2;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.criteria && JSON.stringify(nextProps.criteria) !== JSON.stringify(this.state.criteria)) {
      this.fetchData(nextProps.criteria, { adhoc: { limit: 25 } });
      this.setState({
        criteria: nextProps.criteria,
      });
    } else if (!nextProps.title && nextProps.search.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.search.criteria)) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      });
    }
    if (JSON.stringify(nextProps.styles) !== JSON.stringify(this.state.styles)) {
      this.setState({
        styles: nextProps.styles,
      });
    }
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title || '基站'} align="center" handleChart={this.handleChart} getImgURL={this.getImgURL} getExcel={this.getExcel} />
        <div id="codeandstartedhourclass" style={{ height: 300, display: this.state.isChart ? 'block' : 'none' }} />
        {
          !this.state.isChart ? <ExcelView id="codeandstartedhourclassExcel"
            styles={this.state.styles}
            searchCriteria={this.props.criteria}
            drilldown={this.state.drilldownOptions}
            hotSetting={this.state.hotSetting || null}
            colHeaders={this.state.colHeaders}
            data={this.state.ownernumandstartedhorclassList}
            isLoading={this.state.isLoading}
          /> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.search,
    labelPNs: state.labelPNs,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(Ownernumandstartedhorclass);
