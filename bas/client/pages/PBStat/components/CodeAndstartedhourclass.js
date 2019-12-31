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
import {addrComponent, codeMap} from "../../../utils/hotRenders";
import moment from "../../TrackApi/TrackApiList";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChartBar} from '@fortawesome/free-solid-svg-icons';

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
const list = [{label: '显示基站', value: true}];

const Option = Select.Option;


let firstReq = true;

let markerClusterer = null;
let heatmapOverlay = null;

const maxZoom = 14;

class CodeAndstartedhourclass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      codeandstartedhourclassItems: [],
      colHeaders: colHeaders,
      criteria: null,
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        fixedColumnsLeft: 4,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns: columns.codeAndstartedhourclass,
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
          if (col === 4) {
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
                       trigger={<FontAwesomeIcon icon={faChartBar} style={{marginRight:'0',fontSize:'16px',color:'#999'}}></FontAwesomeIcon>}
                       closable={false}
                       needAdjust={true}
                       offset={[20,10]}
                       onVisibleChange={(visible, type) => {
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
        }
      },
      drilldownOptions: {
        '总计': ['owner_ct_code'],
        '联系天数': ['owner_ct_code'],
        '04时': ['owner_ct_code', {started_hour_class: '0'}],
        '05时': ['owner_ct_code', {started_hour_class: '1'}],
        '06时': ['owner_ct_code', {started_hour_class: '2'}],
        '07时': ['owner_ct_code', {started_hour_class: '3'}],
        '08时': ['owner_ct_code', {started_hour_class: '4'}],
        '09时': ['owner_ct_code', {started_hour_class: '5'}],
        '10时': ['owner_ct_code', {started_hour_class: '6'}],
        '11时': ['owner_ct_code', {started_hour_class: '7'}],
        '12时': ['owner_ct_code', {started_hour_class: '8'}],
        '13时': ['owner_ct_code', {started_hour_class: '9'}],
        '14时': ['owner_ct_code', {started_hour_class: '10'}],
        '15时': ['owner_ct_code', {started_hour_class: '11'}],
        '16时': ['owner_ct_code', {started_hour_class: '12'}],
        '17时': ['owner_ct_code', {started_hour_class: '13'}],
        '18时': ['owner_ct_code', {started_hour_class: '14'}],
        '19时': ['owner_ct_code', {started_hour_class: '15'}],
        '20时': ['owner_ct_code', {started_hour_class: '16'}],
        '21时': ['owner_ct_code', {started_hour_class: '17'}],
        '22时': ['owner_ct_code', {started_hour_class: '18'}],
        '23时': ['owner_ct_code', {started_hour_class: '19'}],
        '00时': ['owner_ct_code', {started_hour_class: '20'}],
        '01时': ['owner_ct_code', {started_hour_class: '21'}],
        '02时': ['owner_ct_code', {started_hour_class: '22'}],
        '03时': ['owner_ct_code', {started_hour_class: '23'}],
      },
      points: [],
      hotMapData: [],
      showHeatmap: true,
      selectOptData: [],
      selectOptValue: [],
      showCT: [],
      rangValue: [0, 23],
      newcriteria: {},
    };
    this.domArr = [];
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  onVisibleChange = (visible, type, rowData) => {
    if (visible){
      const myChart = echarts.init(document.getElementById("distribution" + rowData[0]), 'light');
      this.initC3(myChart, rowData);
    }
  };

  componentDidMount() {
    // const myChart = echarts.init(document.getElementById('codeandstartedhourclass'), 'light');
    // this.initC3(myChart);
    if (window.BMap) {
      this.renderMap();
    } else {
      installExternalLibs(document.body, this.renderMap);
    }

    if (this.props.criteria) {
      this.fetchData(this.props.criteria, {}, {limit: 25});
    }


    const {hotSetting} = this.state;
    let colWidthsArr = setColWidths(colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting, points: []});
  }

  //  初始化百度地图
  renderMap(x = 116.404, y = 39.915) {
    const top_right_navigation = new window.BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_RIGHT,
      type: BMAP_NAVIGATION_CONTROL_ZOOM,
    });
    const mapType1 = new window.BMap.MapTypeControl(
      {
        mapTypes: [BMAP_NORMAL_MAP],
        anchor: BMAP_ANCHOR_TOP_LEFT,
      }
    );
    window.pointStyle = {
      // 指定Marker的icon属性为Symbol
      icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
        scale: 1, // 图标缩放大小
        fillColor: 'green', // 填充颜色
        fillOpacity: 0.8, // 填充透明度
      }),
    };
    const ggPoint = new window.BMap.Point(x, y);
    this.map = new window.BMap.Map('codeandstartedhourclass', {enableMapClick: false});
    this.map.addControl(mapType1);
    this.map.addControl(top_right_navigation);
    this.map.centerAndZoom(ggPoint, 10);
    this.map.enableScrollWheelZoom(); // 允许鼠标缩放
    const myCity = new window.BMap.LocalCity();
    myCity.get((result) => {
      this.map.setCenter(result.name);
    });
    this.map.addEventListener('zoomend', () => {
      const lng = this.map.getCenter().lng;
      const lat = this.map.getCenter().lat;
      const zoom = this.map.getZoom();
      // const point = new window.BMap.Point(lng, lat);
      // this.setState({
      //   zoom: this.map.getZoom(),
      // });
      // this.state.bdPoint && this.map.setCenter(this.state.bdPoint);
      // const m = new window.BMap.Marker(point);
      // this.map.addOverlay(m);
      this.map.centerAndZoom(new window.BMap.Point(lng, lat), zoom);
      if (!firstReq && zoom >= maxZoom) {
        if (this.state.showHeatmap) {
          heatmapOverlay && heatmapOverlay.toggle();
          if (!this.state.showCT[0]) {
            this.onCodeCheckBoxChange(true);
          }
          this.setState({
            showHeatmap: false,
            showCT: [true],
          });
        } else {
          return;
        }
      } else if (!this.state.showHeatmap) {
        this.setState({
          showHeatmap: true,
        }, () => {
          heatmapOverlay && heatmapOverlay.toggle();
        });
      }
      this.map.setZoom(this.map.getZoom());
    });
  }

  //渲染热力图
  renderHotMap = (points) => {
    const {showHeatmap} = this.state;
    this.map.clearOverlays();
    heatmapOverlay = new window.BMapLib.HeatmapOverlay({
      radius: 20,
      gradient: {
        0: 'rgb(102, 255, 0)',
        0.5: 'rgb(255, 170, 0)',
        1: 'rgb(255, 0, 0)',
      }
    });
    this.map.addOverlay(heatmapOverlay);
    if (!showHeatmap) {
      heatmapOverlay.toggle()
    }
    heatmapOverlay.setDataSet({data: points, max: 15});
    const p = [];
    for (let i = 0; i < points.length; i++) {
      const hotPoint = new window.BMap.Point(points[i].lng, points[i].lat);
      p.push(hotPoint);
      //   const marker = new window.BMap.Marker(hotPoint); // 创建标注
      //   this.map.addOverlay(marker); // 将标注添加到地图中
      //
      //   marker.addEventListener('click', getAttr);
      //   function getAttr() {
      //     const p = marker.getPosition(); // 获取marker的位置
      //     p.id = '123';
      //     console.log(`点的位置是${hotPoint.lng},${hotPoint.lat}`);
      //     console.log(`marker的位置是${p.lng},${p.lat}`);
      //   }
    }
    if (firstReq) {
      this.map.setViewport(p);
      if (this.map.getZoom() >= maxZoom) {
        this.map.setZoom(13)
      }
      firstReq = false;
    }
  };

  onCheckBoxChange = (selectedItems) => {
    this.onCodeCheckBoxChange(selectedItems[0]);
    this.setState({
      showCT: selectedItems,
    });
  };

  onCodeCheckBoxChange = (checked) => {
    if (checked) {
      this.addCtCodeMark(this.state.points);
      this.setState({
        showCT: [checked]
      })
    } else {
      this.removeCtCodeMark(this.state.points);
      this.setState({
        showCT: []
      })
    }

  };


  addCtCodeMark = (points) => {
    const markers = []
    const markersOpt = [];
    const {labelCells} = this.props;
    for (let i = 0; i < points.length; i++) {
      const hotPoint = new window.BMap.Point(points[i].lng, points[i].lat);
      const code = points[i].ct_code;
      let pointStyle = {};
      let label = null;
      let count = points[i].count;
      if (labelCells && labelCells.items) {
        const data = labelCells.items;
        data.forEach(item => {
          if (item.ct_code === code) {
            label = item;
            pointStyle = {
              // 指定Marker的icon属性为Symbol
              icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                scale: 1, // 图标缩放大小
                fillColor: item.marker_color, // 填充颜色
                fillOpacity: 0.8, // 填充透明度
              }),
            };
          }
        });
      }

      const marker = new window.BMap.Marker(hotPoint, pointStyle); // 创建标注
      markers.push(marker);
      markersOpt.push({count: points[i].count, ct_code: points[i].ct_code});

      marker.addEventListener('click', async () => {
        const res = await getLocTransform([code]);

        const sContent = `<div>
          <h3 style="margin-bottom: 5px">
            标注: <span style="font-size: '16px'; background: ${label && label.marker_color}; color: #fff; padding: 2px">${label && label.label}</span>
          </h3>
          <p style="font-size: 14px; margin-top: 0">
                <span style="font-size: 16px">基站:</span> ${code} <FontAwesomeIcon icon={faExchangeAlt} style="margin-left: 8px" /> ${`${parseInt(code.split(':')[0], 16)}:${parseInt(code.split(':')[1], 16)}:${parseInt(code.split(':')[2])}`}
                <span style="margin-left: 10px">通话次数: ${count}</span>
          </p>
          <h3 style="font-size: 14px">${res[code][1].address}</h3>
        </div>`;
        const infoWindow = new window.BMap.InfoWindow(sContent, {offset: new window.BMap.Size(0, -15),});
        this.map.openInfoWindow(infoWindow, hotPoint);
      });
    }
    markerClusterer = new window.BMapLib.MarkerClusterer(this.map, {markers, markersOpt});
    markerClusterer.setStyles(
      [
        {url: `${appConfig.rootUrl}/utils/svg/circle/1`, size: new window.BMap.Size(40, 40)},
        {url: `${appConfig.rootUrl}/utils/svg/circle/2`, size: new window.BMap.Size(46, 46)},
        {url: `${appConfig.rootUrl}/utils/svg/circle/3`, size: new window.BMap.Size(52, 52)},
        {url: `${appConfig.rootUrl}/utils/svg/circle/4`, size: new window.BMap.Size(58, 58)},
        {url: `${appConfig.rootUrl}/utils/svg/circle/5`, size: new window.BMap.Size(64, 64)},
        {url: `${appConfig.rootUrl}/utils/svg/circle/6`, size: new window.BMap.Size(70, 70)},
        {url: `${appConfig.rootUrl}/utils/svg/circle/7`, size: new window.BMap.Size(76, 76)},
        {url: `${appConfig.rootUrl}/utils/svg/circle/8`, size: new window.BMap.Size(82, 82)},
        {url: `${appConfig.rootUrl}/utils/svg/circle/9`, size: new window.BMap.Size(88, 88)},
        {url: `${appConfig.rootUrl}/utils/svg/circle/10`, size: new window.BMap.Size(94, 94)},
      ]
    );
  };

  removeCtCodeMark = (points) => {
    if (markerClusterer) {
      markerClusterer.clearMarkers();
    }
  };

  onSelectChange = async (value) => {
    let data = {...this.state.newcriteria, ...this.state.criteria};
    let ownerArr = [];
    let peerArr = [];

    value.forEach(item => {
      if (data.owner_num) {
        data.owner_num[1].forEach(item1 => {
          if (item == item1) {
            ownerArr.push(item)
          }
        })
      }
      if (data.peer_num) {
        data.peer_num[1].forEach(item2 => {
          if (item == item2) {
            peerArr.push(item)
          }
        })
      }
    });

    if (data.owner_num) {
      data.owner_num = ['IN', ownerArr];
    }
    if (data.peer_num) {
      data.peer_num = ['IN', peerArr];
    }

    if (data.owner_num && data.owner_num[1].length === 0 && data.peer_num) {
      delete data.owner_num
    }
    if (data.peer_num && data.peer_num[1].length === 0 && data.owner_num) {
      delete data.peer_num
    }


    let res = await ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-codeandstartedhourclass`, {criteria: data});

    if (res.meta.success) {
      let p = formatCodeandstartedhourclass(res.data).points;
      this.renderHotMap(p);
      if (this.map.getZoom() >= maxZoom || this.state.showCT[0]) {
        this.onCodeCheckBoxChange(false);
        this.setState({
          points: p,
        }, () => {
          this.onCodeCheckBoxChange(true);
        });
      } else {
        this.setState({points: p})
      }
    } else {
      this.renderHotMap([]);
      this.onCodeCheckBoxChange(false);
      this.setState({points: []})
    }

    this.setState({newcriteria: data, selectOptValue: value});
  };

  onChangeDouble = (doubleValue) => {
    const hour = [];
    for (let i = doubleValue[0]; i <= doubleValue[1]; i++) {
      hour.push(i);
    }

    let criteria = {...this.state.newcriteria};

    criteria.started_hour_class = ['IN', hour];
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-codeandstartedhourclass`, {
      criteria,
      view: {}
    }).then(res => {
      if (res.meta && res.meta.success) {
        let p = formatCodeandstartedhourclass(res.data).points;
        this.renderHotMap(p);
        if (this.map.getZoom() >= maxZoom || this.state.showCT[0]) {
          this.onCodeCheckBoxChange(false);
          this.setState({
            points: p,
          }, () => {
            this.onCodeCheckBoxChange(true);
          });
        } else {
          this.setState({points: p})
        }
      }
    }).catch(err => {
      console.log(err);
    });
    this.setState({
      rangValue: doubleValue,
      newcriteria: criteria
    });
  };

  initC3(myChart,rowData) {
    this.setState({
      myChart,
    });
    let yData = [];
    for (let i =6; i< 30; i++){
      yData.push(parseInt(rowData[i]))
    }
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
    downloadIamge(this.state.myChart, 'B4-基站vs通话时段(小时)');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-codeandstartedhourclass.xlsx`, {
      criteria: this.props.search.criteria,
      view: {}
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params, view = {}, adhoc) {
    const {fetchCodeandstartedhourclassChart} = this.props.actions;
    fetchCodeandstartedhourclassChart({case_id: this.props.caseId, ...{criteria: params, view, adhoc}});
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.title && nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria, {}, {});
      let data = nextProps.search.criteria;
      let arr = [];
      if (data) {
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

    if (nextProps.codeandstartedhourclassHotMap && JSON.stringify(nextProps.codeandstartedhourclassHotMap) !== JSON.stringify(this.state.hotMapData)) {
      firstReq = true;
      this.renderHotMap(nextProps.codeandstartedhourclassHotMap);
      this.setState({
        points: nextProps.codeandstartedhourclassHotMap,
        hotMapData: nextProps.codeandstartedhourclassHotMap
      });
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
    this.props.actions.clearCodeandstartedhourclassChart();
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
        <ChartTitle title={this.props.title || 'B4-基站vs通话时段(小时)'} align="center" handleChart={this.handleChart}
                    getImgURL={this.getImgURL} getExcel={this.getExcel}/>
        {/*<div id="codeandstartedhourclass" style={{height: 300, display: this.state.isChart ? 'block' : 'none'}}/>*/}
        {/*{*/}
        {/*!this.state.isChart ? <ExcelView id="codeandstartedhourclassExcel" styles={this.props.styles}*/}
        {/*hotSetting={this.state.hotSetting ? this.state.hotSetting : null}*/}
        {/*colHeaders={this.state.colHeaders}*/}
        {/*data={this.props.codeandstartedhourclassList}/> : null*/}
        {/*}*/}
        <ExcelView id="codeandstartedhourclassExcel" styles={this.props.styles}
                   hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                   colHeaders={this.state.colHeaders}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.codeandstartedhourclassList}/>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          margin: '10px 0',
          padding: '10px 0',
          backgroundColor: '#eee'
        }}>
          <Select mode="multiple" showSearch value={this.state.selectOptValue} onChange={this.onSelectChange}
                  style={{flex: 1}}>
            {
              this.state.selectOptData.map(num => {
                return (
                  <Option value={num} key={num}>{num}</Option>
                );
              })
            }
          </Select>
          <div className='rangeWrap'>
            <CheckboxGroup value={this.state.showCT} dataSource={list} onChange={this.onCheckBoxChange}/>
            <div className="custom-range" style={{width: 465, height: '100%'}}>
              <Range slider="double" max={23} value={this.state.rangValue} onChange={this.onChangeDouble}
                     tipRender={this.formatter} scales={10} marks={rangData}/>
            </div>
          </div>
        </div>
        <div id="codeandstartedhourclass" className={'pbStatChart'}/>
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
    codeandstartedhourclassList: state.pbStat.codeandstartedhourclassList,
    codeandstartedhourclassItems: state.pbStat.codeandstartedhourclassItems,
    codeandstartedhourclassHotMap: state.pbStat.codeandstartedhourclassHotMap,
    search: state.search,
    labelCells: state.labelCells,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CodeAndstartedhourclass);
