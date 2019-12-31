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

import {setColWidths} from "../../../handontableConfig";
import columns from '../../../utils/hotColsDef'
import ReactDOM from "react-dom";
import {peerNumTagRenders} from "../../../utils/hotRenders";


let colHeaders = [
  '对方号码',
  '标注',
  '标签',
  '总计',
  '04:30 ~ 07:30',
  '07:31 ~ 11:15',
  '11:16 ~ 13:30',
  '13:31 ~ 17:15',
  '17:16 ~ 19:00',
  '19:01 ~ 20:50',
  '20:51 ~ 23:59',
  '00:00 ~ 04:29',
];

class PeernumAndstartedtimel1class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      peernumandstartedtimel1classItems: [],
      colHeaders: colHeaders,
      hotSetting: {
        fixedColumnsLeft: 4,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns: columns.peernumAndstartedtimel1class,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: async (td, row, col, prop, value, cellProperties) => {
          if (col === 2) {
            const dom = document.createElement('div');
            let peer_num = cellProperties.instance.getDataAtRowProp(row, 'peer_num')
            let component = peerNumTagRenders(peer_num)
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }

        },
      },
      drilldownOptions: {
        '总计': ['peer_num'],
        '04:30 ~ 07:30': ['peer_num',{started_time_l1_class:'0'}],
        '07:31 ~ 11:15': ['peer_num',{started_time_l1_class:'1'}],
        '11:16 ~ 13:30': ['peer_num',{started_time_l1_class:'2'}],
        '13:31 ~ 17:15': ['peer_num',{started_time_l1_class:'3'}],
        '17:16 ~ 19:00': ['peer_num',{started_time_l1_class:'4'}],
        '19:01 ~ 20:50': ['peer_num',{started_time_l1_class:'5'}],
        '20:51 ~ 23:59': ['peer_num',{started_time_l1_class:'6'}],
        '00:00 ~ 04:29': ['peer_num',{started_time_l1_class:'7'}],
      }
    };
    this.domArr = [];
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('peernumandstartedtimel1class'), 'light');
    this.initC3(myChart);

    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(colHeaders);
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
    downloadIamge(this.state.myChart, 'A3-对方号码vs通话时段');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-peernumandstartedtimel1class.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    const {fetchPeernumandstartedtimel1classChart} = this.props.actions;
    fetchPeernumandstartedtimel1classChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
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
        <ChartTitle title="A3-对方号码vs通话时段" align={'center'} handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="peernumandstartedtimel1class" style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ?
            <ExcelView id="peernumandstartedtimel1classExcel" hotSetting={this.state.hotSetting || null} drilldown={this.state.drilldownOptions}
                       colHeaders={this.state.colHeaders} data={this.props.peernumandstartedtimel1classList}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    peernumandstartedtimel1classList: state.pbStat.peernumandstartedtimel1classList,
    peernumandstartedtimel1classItems: state.pbStat.peernumandstartedtimel1classItems,
    search: state.search,
    labelPNs: state.labelPNs,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(PeernumAndstartedtimel1class);
