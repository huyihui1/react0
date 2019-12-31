import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';
import {saveAs} from 'file-saver';
import ajaxs from '../../../utils/ajax'

import {actions} from '../../../stores/pbStat/ownerNum';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import {setColWidths} from '../../../handontableConfig'
import columns from '../../../utils/hotColsDef'
import {store} from "../../../index";
import {ownerNumTagRenders} from "../../../utils/hotRenders";
import ReactDOM from "react-dom";



class Ownernum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      ownernumItems: [],
      colHeaders: [
        '本方号码',
        '标注',
        '标签',
        '中心度',
        '联系人个数',
        '联系次数',
        '主叫',
        '被叫',
        '呼转',
        '主短',
        '被短',
        '通话时间',
        '首次时间',
        '末次',
        '首末相距',
        '使用天数',
        '未使用天数',
      ],
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        fixedColumnsLeft: 2,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns: columns.ownernum,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: async (td, row, col, prop, value, cellProperties) => {
          if (col === 2){
            const dom = document.createElement('div');
            let owner_num = cellProperties.instance.getDataAtRowProp(row, 'owner_num');
            let component = ownerNumTagRenders(owner_num)
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
        },
      },
      ownernumList: null,
      isLoading: false,
      drilldownOptions: {
        '中心度': ['owner_num'],
        '联系次数': ['owner_num'],
        '使用天数': ['owner_num'],
        '主叫': ['owner_num',{comm_direction: '11'}],
        '被叫': ['owner_num',{comm_direction: '12'}],
        '呼转': ['owner_num',{comm_direction: '13'}],
        '主短': ['owner_num',{comm_direction: '21'}],
        '被短': ['owner_num',{comm_direction: '22'}],
      }
    };
    this.domArr = [];
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('ownernum'), 'light');
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
    downloadIamge(this.state.myChart, 'C1-本方号码');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownernum.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    const {fetchOwnernums} = this.props.actions;
    fetchOwnernums({case_id: this.props.caseId, ...{criteria: params, view: {}}})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.search.criteria)) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: JSON.parse(JSON.stringify(nextProps.search.criteria)),
      })
    }
    if (nextProps.ownernumList && nextProps.ownernumList !== this.state.ownernumList) {
      this.setState({
        ownernumList: nextProps.ownernumList
      })
    }
    if (nextProps.isLoading) {
      this.setState({
        isLoading: nextProps.isLoading
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
        <ChartTitle title="C1-本方号码" align={'center'} handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <div id="ownernum" style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>
        {
          !this.state.isChart ?
            <ExcelView id="ownernumExcel" colHeaders={this.state.colHeaders} drilldown={this.state.drilldownOptions} hotSetting={this.state.hotSetting || null}
                       data={this.state.ownernumList} isLoading={this.state.isLoading}/> : null
        }
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    ownernumList: state.ownerNums.ownernumList,
    ownernumItems: state.ownerNums.ownernumItems,
    isLoading: state.ownerNums.isLoading,
    search: state.search,
    labelPNs: state.labelPNs,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(Ownernum);
