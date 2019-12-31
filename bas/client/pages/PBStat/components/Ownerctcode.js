import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {Provider, connect} from 'react-redux';
import {Balloon, Checkbox, Range, Select} from '@alifd/next';
import echarts from 'echarts';
import 'echarts/extension/bmap/bmap';
import {saveAs} from 'file-saver';
import ajaxs from '../../../utils/ajax';
import {store} from '../../../index';

import {actions, formatOwnernumandctandstartedhourclass} from '../../../stores/pbStat';
import {formatOwnerctcode} from '../../../stores/pbStat';

import {downloadIamge, getLocTransform, installExternalLibs} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import MapComponent from '../../common/MapComponent';
import {setColWidths} from '../../../handontableConfig';
import columns from '../../../utils/hotColsDef';
import {codeMap, addrComponent} from '../../../utils/hotRenders';
import appConfig from "../../../appConfig";


const colHeaders = [
  '基站代码',
  '标注',
  '地址',
  'LAC',
  'CI',
  '联系次数',
  '联系天数',
  '首末期间未出现天数',
  '首次出现时间',
  '最后出现时间',
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

class Ownerctcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      ownerctcodeItems: [],
      colHeaders,
      hotSetting: {
        fixedColumnsLeft: 2,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns: columns.ownerctcode,
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
          if (col === 2) {
            const dom = document.createElement('div');
            const component = addrComponent(value, styles)
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);//作用暂时不知道
          }
        }
      },
      drilldownOptions: {
        '联系次数': ['owner_ct_code'],
        '联系天数': ['owner_ct_code'],
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

  componentDidMount() {
    // const myChart = echarts.init(document.getElementById('ownerctcode'), 'light');
    // this.initC3(myChart);
    if (window.BMap) {
      this.renderMap();
    } else {
      installExternalLibs(document.body, this.renderMap);
    }

    const {hotSetting} = this.state;
    const colWidthsArr = setColWidths(colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting, hotMapData: []});
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
    this.map = new window.BMap.Map('ownerctcode', {enableMapClick: false});
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

  onCodeCheckBoxChange = (checked) => {
    if (checked) {
      this.addCtCodeMark(this.state.points)
      this.setState({
        showCT: [checked]
      })
    } else {
      this.removeCtCodeMark(this.state.points)
      this.setState({
        showCT: []
      })
    }

  }
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
      // if (count > 20) {
      //   pointStyle = {
      //     // 指定Marker的icon属性为Symbol
      //     icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
      //       scale: 1, // 图标缩放大小
      //       // fillColor: 'blue', // 填充颜色
      //       fillOpacity: 0.8, // 填充透明度
      //     }),
      //   };
      // }


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
  }
  removeCtCodeMark = (points) => {
    if (markerClusterer) {
      markerClusterer.clearMarkers();
    }
  }

  onCheckBoxChange = (selectedItems) => {
    this.onCodeCheckBoxChange(selectedItems[0]);
    this.setState({
      showCT: selectedItems,
    });
  };

  formatter = (val) => {
    let value = val * 1 + 4;
    if (value >= 24) {
      value -= 24;
    }
    return `${value}时`;
  }

  initC3(myChart) {
    this.setState({
      myChart,
    });
    const option = {
      animation: false,
      bmap: {
        center: [120.13066322374, 30.240018034923],
        zoom: 14,
        roam: true,
      },
      visualMap: {
        show: true,
        top: 'top',
        min: 0,
        max: 1,
        seriesIndex: 0,
        calculable: true,
        inRange: {
          color: ['blue', 'blue', 'green', 'yellow', 'red'],
        },
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'bmap',
        data: [
          [120.14322240845, 30.236064370321, 1],
          [120.14280555506, 30.23633761213, 1],
        ],
        pointSize: 5,
        blurSize: 6,
      }],
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
    downloadIamge(this.state.myChart, 'B1-基站CI');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownerctcode.xlsx`, {
      criteria: this.props.search.criteria,
      view: {},
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    this.unmountCompsOnDoms();
    const {fetchOwnerctcodeChart} = this.props.actions;
    fetchOwnerctcodeChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    firstReq = true;
    this.setState({
      showHeatmap: true,
      points: [],
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.caseId && nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria);

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
      });
    }

    if (nextProps.ownerctcodeHotMap && JSON.stringify(nextProps.ownerctcodeHotMap) !== JSON.stringify(this.state.hotMapData)) {
      firstReq = true;
      this.renderHotMap(nextProps.ownerctcodeHotMap);
      this.setState({
        points: nextProps.ownerctcodeHotMap,
        hotMapData: nextProps.ownerctcodeHotMap
      });
    }

  }

  componentWillUnmount() {
    this.props.actions.clearOwnerctcodeChart();
    this.unmountCompsOnDoms();
  }

  unmountCompsOnDoms = () => {
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
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


    let res = await ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownerctcode`, {criteria: data});

    if (res.meta.success) {
      let p = formatOwnerctcode(res.data).points;
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
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownerctcode`, {criteria, view: {}}).then(res => {
      if (res.meta && res.meta.success) {
        let p = formatOwnerctcode(res.data).points;
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
  }


  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="B1-基站CI"
                    align="center"
                    handleChart={this.handleChart}
                    getImgURL={this.getImgURL}
                    getExcel={this.getExcel}
        />
        <ExcelView id="ownerctcodeExcel"
                   colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting ? this.state.hotSetting : null}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.ownerctcodeList}
        />
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
        <div id="ownerctcode" className={'pbStatChart'}/>
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
    textAlign: 'left',
  },
};

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    ownerctcodeList: state.pbStat.ownerctcodeList,
    ownerctcodeItems: state.pbStat.ownerctcodeItems,
    ownerctcodeHotMap: state.pbStat.ownerctcodeHotMap,
    search: state.search,
    labelCells: state.labelCells,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(Ownerctcode);
