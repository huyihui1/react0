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
import {setColWidths} from '../../../handontableConfig';
import {store} from "../../../index";
import columns from '../../../utils/hotColsDef'
import ReactDOM from "react-dom";
import {ownerNumTagRenders} from "../../../utils/hotRenders";


class OwnernumAndstartedhourclass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      ownernumandstartedhourclassItems: [],
      colHeaders: [
        '本方号码',
        '标注',
        '标签',
        '总计',
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
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        fixedColumnsLeft: 4,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns:columns.ownernumAndstartedhourclass,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: async (td, row, col, prop, value, cellProperties) => {
          if (col === 2){
            const dom = document.createElement('div');
            let owner_num = cellProperties.instance.getDataAtRowProp(row, 'owner_num');
            let component = ownerNumTagRenders(owner_num);
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
        },
      },
      drilldownOptions: {
        '总计': ['owner_num'],
        '04时': ['owner_num',{started_hour_class:'0'}],
        '05时': ['owner_num',{started_hour_class:'1'}],
        '06时': ['owner_num',{started_hour_class:'2'}],
        '07时': ['owner_num',{started_hour_class:'3'}],
        '08时': ['owner_num',{started_hour_class:'4'}],
        '09时': ['owner_num',{started_hour_class:'5'}],
        '10时': ['owner_num',{started_hour_class:'6'}],
        '11时': ['owner_num',{started_hour_class:'7'}],
        '12时': ['owner_num',{started_hour_class:'8'}],
        '13时': ['owner_num',{started_hour_class:'9'}],
        '14时': ['owner_num',{started_hour_class:'10'}],
        '15时': ['owner_num',{started_hour_class:'11'}],
        '16时': ['owner_num',{started_hour_class:'12'}],
        '17时': ['owner_num',{started_hour_class:'13'}],
        '18时': ['owner_num',{started_hour_class:'14'}],
        '19时': ['owner_num',{started_hour_class:'15'}],
        '20时': ['owner_num',{started_hour_class:'16'}],
        '21时': ['owner_num',{started_hour_class:'17'}],
        '22时': ['owner_num',{started_hour_class:'18'}],
        '23时': ['owner_num',{started_hour_class:'19'}],
        '00时': ['owner_num',{started_hour_class:'20'}],
        '01时': ['owner_num',{started_hour_class:'21'}],
        '02时': ['owner_num',{started_hour_class:'22'}],
        '03时': ['owner_num',{started_hour_class:'23'}],
      }
    };
    this.domArr = [];
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('ownernumandstartedhourclass'), 'light');
    this.initC3(myChart);

    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(this.state.colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting})
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
    downloadIamge(this.state.myChart, 'C5-本方号码vs通话时段(小时)');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownernumandstartedhourclass.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    const {fetchOwnernumandstartedhourclassChart} = this.props.actions;
    fetchOwnernumandstartedhourclassChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      })
    }
  }

  unmountCompsOnDoms = () => {
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
  };

  componentWillUnmount() {
    this.unmountCompsOnDoms();
  }


  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="C5-本方号码vs通话时段(小时)" align={'center'} handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="ownernumandstartedhourclass" style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ? <ExcelView id="ownernumandstartedhourclassExcel" colHeaders={this.state.colHeaders}
                                           hotSetting={this.state.hotSetting || null}
                                           drilldown={this.state.drilldownOptions}
                                           data={this.props.ownernumandstartedhourclassList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    ownernumandstartedhourclassList: state.pbStat.ownernumandstartedhourclassList,
    ownernumandstartedhourclassItems: state.pbStat.ownernumandstartedhourclassItems,
    search: state.search,
    labelPNs: state.labelPNs,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(OwnernumAndstartedhourclass);
