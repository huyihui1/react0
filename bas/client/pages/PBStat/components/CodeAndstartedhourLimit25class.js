import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {Balloon, Button, Checkbox, Range, Select} from '@alifd/next';
import {connect, Provider} from 'react-redux';
import echarts from 'echarts';
import {saveAs} from 'file-saver';
import ajaxs from '../../../utils/ajax';

import {actions, formatCodeandstartedhourclass} from '../../../stores/pbStat';
import {downloadIamge, getLocTransform, installExternalLibs} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import {setColWidths} from '../../../handontableConfig';
import {store} from "../../../index";
import MapComponent from '../../common/MapComponent';
import ReactDOM from "react-dom";
import columns from '../../../utils/hotColsDef'
import appConfig from "../../../appConfig";
import { addrComponent, codeMap } from '../../../utils/hotRenders';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartBar} from "@fortawesome/free-solid-svg-icons";

const hourArr = [
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
];



let colHeaders = [
  '基站代码',
  '标注',
  '联系天数',
  '总计',
  '地址',
  '24小时分布图',
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
];
const {Group: CheckboxGroup} = Checkbox;
const rangData = {
  0: '4',
  1: '5',
  2: '6',
  3: '7',
  4: '8',
  5: '9',
  6: '10',
  7: '11',
  8: '12',
  9: '13',
  10: '14',
  11: '15',
  12: '16',
  13: '17',
  14: '18',
  15: '19',
  16: '20',
  17: '21',
  18: '22',
  19: '23',
  20: '0',
  21: '1',
  22: '2',
  23: '3',
};


class CodeAndstartedhourclass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      codeandstartedhourclassItems: [],
      colHeaders: colHeaders,
      criteria: {},
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        fixedColumnsLeft: 4,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns: columns.codeAndstartedhourclass2,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: (td, row, col, prop, value, cellProperties) => {
          // console.log(td, row, col);//cellProperties表格的每一格的具体属性值 [0]代表不同的id
         
          if (col === 0) {
            const dom = document.createElement('div');
            const component = codeMap(value, {width: '600px', height: '250px'})
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
          if (col === 4) {
            console.log(value)
            const dom = document.createElement('div');
            const component = addrComponent(value, styles)
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
          if (col === 5) {
            const dom = document.createElement('div');
            const component = (
              <Balloon align="r"
                       trigger={
                       <FontAwesomeIcon icon={faChartBar} style={{marginRight:'0',fontSize:'16px',color:'#999'}}></FontAwesomeIcon>
                      
                      }//FontAwesomeIcon是一个库,icon是库中的一个图标样式
                       closable={false}
                       needAdjust={true}
                       offset={[20,10]}
                       onVisibleChange={(visible, type) => {//弹层隐藏和显示触发的事件
                         this.onVisibleChange(visible, type, cellProperties.instance.getDataAtRow(row))
                       }}
              >
                <div>
                  <div id={"distribution" + cellProperties.instance.getDataAtRow(row)[0]} style={{height: '200px', width: '500px' }}/>
                </div>
              </Balloon>
            );
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
        },
      },
      drilldownOptions: {
        '联系天数': ['owner_ct_code'],
        '04时': ['owner_ct_code',{started_hour_class:'0'}],
        '05时': ['owner_ct_code',{started_hour_class:'1'}],
        '06时': ['owner_ct_code',{started_hour_class:'2'}],
        '07时': ['owner_ct_code',{started_hour_class:'3'}],
        '08时': ['owner_ct_code',{started_hour_class:'4'}],
        '09时': ['owner_ct_code',{started_hour_class:'5'}],
        '10时': ['owner_ct_code',{started_hour_class:'6'}],
        '11时': ['owner_ct_code',{started_hour_class:'7'}],
        '12时': ['owner_ct_code',{started_hour_class:'8'}],
        '13时': ['owner_ct_code',{started_hour_class:'9'}],
        '14时': ['owner_ct_code',{started_hour_class:'10'}],
        '15时': ['owner_ct_code',{started_hour_class:'11'}],
        '16时': ['owner_ct_code',{started_hour_class:'12'}],
        '17时': ['owner_ct_code',{started_hour_class:'13'}],
        '18时': ['owner_ct_code',{started_hour_class:'14'}],
        '19时': ['owner_ct_code',{started_hour_class:'15'}],
        '20时': ['owner_ct_code',{started_hour_class:'16'}],
        '21时': ['owner_ct_code',{started_hour_class:'17'}],
        '22时': ['owner_ct_code',{started_hour_class:'18'}],
        '23时': ['owner_ct_code',{started_hour_class:'19'}],
        '00时': ['owner_ct_code',{started_hour_class:'20'}],
        '01时': ['owner_ct_code',{started_hour_class:'21'}],
        '02时': ['owner_ct_code',{started_hour_class:'22'}],
        '03时': ['owner_ct_code',{started_hour_class:'23'}],
      },
      isLoading: false,
      codeandstartedhour25classList: null
    };
    this.domArr = [];
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  componentDidMount() {
    if (this.props.criteria) {
      this.fetchData(this.props.criteria, {}, {limit: 25});
    }


    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting,points:[]})
  }


  onVisibleChange = (visible, type, rowData) => {
    console.log(rowData)
    if (visible){
      const myChart = echarts.init(document.getElementById("distribution" + rowData[0]), 'light');//light代表主题
      this.initC3(myChart, rowData);
    }
  };


  cellRender(instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = '';
    td.style.textAlign = 'center';

    if (value) {
      td.innerHTML = value;
    }
    if (col === 1) {
      const code = instance.getDataAtCell(row, 0);
      if (code) {
        const result = this.cellLabelRender(this.props.labelCells.items, code);
        if (result) {
          td.innerHTML = result;
        } else if (value) {
          td.innerHTML = value;
        }
      }
    }
    return td
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


  // initC3(myChart) {
  //   this.setState({
  //     myChart,
  //   });
  //   const option = {
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'shadow',
  //         textStyle: {
  //           color: '#fff',
  //         },
  //
  //       },
  //     },
  //     grid: {
  //       borderWidth: 0,
  //       top: 110,
  //       bottom: 95,
  //       textStyle: {
  //         color: '#fff',
  //       },
  //     },
  //     legend: {
  //       x: '4%',
  //       top: '8px',
  //       textStyle: {
  //         color: '#90979c',
  //       },
  //       data: [],
  //     },
  //
  //
  //     calculable: true,
  //     xAxis: [{
  //       type: 'category',
  //       axisLine: {
  //         lineStyle: {
  //           color: '#90979c',
  //         },
  //       },
  //       splitLine: {
  //         show: false,
  //       },
  //       axisTick: {
  //         show: false,
  //       },
  //       splitArea: {
  //         show: false,
  //       },
  //       axisLabel: {
  //         interval: 0,
  //
  //       },
  //       data: [],
  //     }],
  //     yAxis: [{
  //       type: 'value',
  //       splitLine: {
  //         show: false,
  //       },
  //       axisLine: {
  //         lineStyle: {
  //           color: '#90979c',
  //         },
  //       },
  //       axisTick: {
  //         show: false,
  //       },
  //       axisLabel: {
  //         interval: 0,
  //
  //       },
  //       splitArea: {
  //         show: false,
  //       },
  //
  //     }],
  //     // dataZoom: [{
  //     //   show: true,
  //     //   height: 30,
  //     //   xAxisIndex: [
  //     //     0,
  //     //   ],
  //     //   bottom: 30,
  //     //   start: 0,
  //     //   end: 10,
  //     //   handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
  //     //   handleSize: '110%',
  //     //   handleStyle: {
  //     //     color: '#ccc',
  //     //
  //     //   },
  //     //   textStyle: {
  //     //     color: '#fff',
  //     //   },
  //     //   borderColor: '#444a4f',
  //     // },
  //     // {
  //     //   type: 'inside',
  //     //   show: true,
  //     //   height: 15,
  //     //   start: 1,
  //     //   end: 35,
  //     // }],
  //     series: [{
  //       name: '次数',
  //       type: 'bar',
  //       barMaxWidth: 35,
  //       barGap: '10%',
  //       itemStyle: {
  //         normal: {
  //           color: 'rgba(255,144,128,1)',
  //           label: {
  //             show: true,
  //             textStyle: {
  //               color: '#fff',
  //             },
  //             position: 'insideTop',
  //             // formatter(p) {
  //             //   return p.value > 0 ? (p.value) : '';
  //             // },
  //           },
  //         },
  //       },
  //       data: [],
  //     },
  //     ],
  //   };
  //   window.addEventListener('resize', () => {
  //     if (this.state.isChart) {
  //       myChart.resize();
  //     }
  //   });
  //   myChart.setOption(option);
  // }
  initC3(myChart,rowData) {
    this.setState({
      myChart,
    });
    let yData = [];
    for (let i =6; i< 30; i++){
      yData.push(parseInt(rowData[i]))
    }
    console.log(yData)
    const option = {
      color: ['#3398DB'],
      title: [
        {
          text: rowData[0] + '  基站24小时分布图',
          textAlign: 'center',
          left: "50%",
          top:20
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: hourArr,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel:{
            showMaxLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          // name: '',
          type: 'bar',
          barWidth: '60%',
          data: yData
        }
      ]
    };
    // window.addEventListener('resize', () => {
    //   if (this.state.isChart) {
    //     myChart.resize();
    //   }
    // });
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
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-codeandstartedhourclass.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      console.log(res)
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params, view = {}, adhoc) {
    this.setState({
      isLoading: true
    })
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-codeandstartedhourclass`, {criteria: params, view, adhoc}).then(res => {
      if (res.meta && res.meta.success) {
        this.setState({
          codeandstartedhour25classList: this.formatCodeandstartedhourclass(res.data).data,
          isLoading: false
        })
      }
    })
  }

  formatCodeandstartedhourclass(data) {
    const arr = [],
      points = [];

    for (let i = 0; i < data.length; i++) {
      let ai = {};
      for (let j = 0; j < data[i].length; j++) {
        const a2 = data[i][j];
        ai = {...ai, ...a2};
      }
      arr.push(ai);
      if (ai.coord && ai.coord[0] && ai.coord[1]) {
        let obj = {
          lng: ai.coord[0],
          lat: ai.coord[1],
          count: ai.total,
          ct_code: ai.owner_ct_code
        };
        points.push(obj)
      }
    }
    return {
      data: arr,
      points
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.title && nextProps.search.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.search.criteria)) {
      this.fetchData(nextProps.search.criteria, {}, {});
      let data = nextProps.search.criteria;
      let arr = [];
      if (data.owner_num) {
        data.owner_num[1].forEach(item => {
          arr.push(item)
        })
      }
      if (data.peer_num) {
        data.peer_num[1].forEach(item => {
          arr.push(item)
        })
      }

      this.removeCtCodeMark();
      this.setState({
        criteria: nextProps.search.criteria,
        newcriteria: nextProps.search.criteria,
        selectOptData: arr,
        selectOptValue: arr,
        rangValue: [0, 23],
        showCT: []
      })
    }
  }

  //
  // cellRender(instance, td, row, col, prop, value, cellProperties) {
  //   if (col === 0) {
  //     td.style.textAlign = 'center';
  //     td.innerHTML = value;
  //     return td;
  //   } else {
  //     if (value) {
  //       td.style.textAlign = 'center';
  //       td.innerHTML = value;
  //     }
  //     return td
  //   }
  // }


  componentWillUnmount() {
    this.unmountCompsOnDoms();
  }

  unmountCompsOnDoms = () => {
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
  }


  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center" handleChart={this.handleChart}
                    getImgURL={this.getImgURL} getExcel={this.getExcel}/>
        <ExcelView id="codeandstartedhour25classExcel" stylcolHeaderses={this.props.styles}
                   searchCriteria={this.props.criteria}
                   drilldown={this.state.drilldownOptions}
                   hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                   colHeaders={this.state.colHeaders}
                   data={this.state.codeandstartedhour25classList} isLoading={this.state.isLoading} />
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
    search: state.search,
    labelCells: state.labelCells,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CodeAndstartedhourclass);
