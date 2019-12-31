import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect, Provider} from 'react-redux';
import {Balloon, Select, Checkbox, Range} from '@alifd/next';
import ReactDOM from 'react-dom';
import {saveAs} from 'file-saver';
import ajaxs from '../../../utils/ajax';

import {actions} from '../../../stores/pbStat';
import {downloadIamge, installExternalLibs, getLocTransform} from '../../../utils/utils';
import {formatOwnernumandctandstartedhourclass} from '../../../stores/pbStat';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import {
  setColWidths,
  TAGGING_COL_WIDTH,
} from '../../../handontableConfig';
import {store} from '../../../index';
import MapComponent from '../../common/MapComponent';

import columns from '../../../utils/hotColsDef';
import appConfig from '../../../appConfig';
import {addrComponent, codeMap, ownerNumTagRenders} from "../../../utils/hotRenders";

const colHeaders = [
  '基站代码',
  '出现频率',
  '基站标注',
  '本方号码',
  '号码标注',
  '标签',
  '联系天数',
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

class OwnernumAndctandstartedhourclass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      ownernumandctandstartedhourclassItems: [],
      colHeaders,
      hotSetting: {
        // renderer: this.cellRender.bind(this),
        fixedColumnsLeft: 3,
        colWidths: [],
        manualColumnResize: true,
        manualRowResize: true,
        columns: columns.ownernumAndctandstartedhourclass,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: (td, row, col, prop, value, cellProperties) => {
          // console.log(td, row, col);
          if (col === 0) {
            const dom = document.createElement('div');
            const component = codeMap(value,appConfig.reportMap);
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
          if (col === 5) {
            const dom = document.createElement('div');
            let owner_num = cellProperties.instance.getDataAtRowProp(row, 'owner_num');
            let component = ownerNumTagRenders(owner_num)
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
        }
      },
      drilldownOptions: {
        '总计': ['owner_ct_code', 'owner_num'],
        '联系天数': ['owner_ct_code', 'owner_num'],
        '04时': ['owner_ct_code', 'owner_num', {started_hour_class: '0'}],
        '05时': ['owner_ct_code', 'owner_num', {started_hour_class: '1'}],
        '06时': ['owner_ct_code', 'owner_num', {started_hour_class: '2'}],
        '07时': ['owner_ct_code', 'owner_num', {started_hour_class: '3'}],
        '08时': ['owner_ct_code', 'owner_num', {started_hour_class: '4'}],
        '09时': ['owner_ct_code', 'owner_num', {started_hour_class: '5'}],
        '10时': ['owner_ct_code', 'owner_num', {started_hour_class: '6'}],
        '11时': ['owner_ct_code', 'owner_num', {started_hour_class: '7'}],
        '12时': ['owner_ct_code', 'owner_num', {started_hour_class: '8'}],
        '13时': ['owner_ct_code', 'owner_num', {started_hour_class: '9'}],
        '14时': ['owner_ct_code', 'owner_num', {started_hour_class: '10'}],
        '15时': ['owner_ct_code', 'owner_num', {started_hour_class: '11'}],
        '16时': ['owner_ct_code', 'owner_num', {started_hour_class: '12'}],
        '17时': ['owner_ct_code', 'owner_num', {started_hour_class: '13'}],
        '18时': ['owner_ct_code', 'owner_num', {started_hour_class: '14'}],
        '19时': ['owner_ct_code', 'owner_num', {started_hour_class: '15'}],
        '20时': ['owner_ct_code', 'owner_num', {started_hour_class: '16'}],
        '21时': ['owner_ct_code', 'owner_num', {started_hour_class: '17'}],
        '22时': ['owner_ct_code', 'owner_num', {started_hour_class: '18'}],
        '23时': ['owner_ct_code', 'owner_num', {started_hour_class: '19'}],
        '00时': ['owner_ct_code', 'owner_num', {started_hour_class: '20'}],
        '01时': ['owner_ct_code', 'owner_num', {started_hour_class: '21'}],
        '02时': ['owner_ct_code', 'owner_num', {started_hour_class: '22'}],
        '03时': ['owner_ct_code', 'owner_num', {started_hour_class: '23'}],
      },
      domArr: [],
      owner_nums: [],
      selectOptData: [],
      showCT: [],
      points: [],
      showHeatmap: true,
      rangValue: [0, 23],
      hotMapData: null,
    };
    this.domArr = [];
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getExcel = this.getExcel.bind(this);
  }

  componentDidMount() {
    if (window.BMap) {
      this.renderMap();
    } else {
      installExternalLibs(document.body, this.renderMap);
    }
    const {hotSetting} = this.state;
    const colWidthsArr = setColWidths(colHeaders);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting});
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


  cellLabelRender = (arr, code) => {
    let dom = null;
    Array.isArray(arr) && arr.forEach(item => {
      if (item.ct_code === code) {
        dom = `<div style="background: ${item.marker_color}; color: #fff; text-align: center">${item.label}</div>`;
      }
    });
    return dom;
  };

  cellRender(instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = '';
    td.style.textAlign = 'center';
    const {domArr} = this.state;


    if (value) {
      td.innerHTML = value;
    }

    if (col === 0) {
      const dom = document.createElement('div');
      const component = (
        <Provider store={store}>
          <Balloon align="r"
                   trigger={<span>{value}</span>}
                   closable={false}
                   afterClose={() => {
                     // console.log('卸载组件');
                     // ReactDOM.unmountComponentAtNode(dom)
                   }}
          >
            <div style={{width: '800px', height: '500px'}}>
              <MapComponent code={value} ctLabel={this.props.labelCells.items}/>
            </div>
          </Balloon>
        </Provider>
      );
      ReactDOM.render(component, dom);
      td.innerHTML = '';
      td.appendChild(dom);
      domArr.push(dom);
      this.setState({
        domArr,
      });
    }

    if (col === 4) {
      const ownerNum = instance.getDataAtCell(row, 3);
      if (ownerNum) {
        const result = this.numLabelRender(this.props.labelPNs.items, ownerNum);
        if (result.dom) {
          td.innerHTML = result.dom;
        } else if (value) {
          td.innerHTML = value;
        }
      }
    } else if (col === 5) {
      let newVal = [];
      const ownerNum = instance.getDataAtCell(row, 3);
      const tags = this.numLabelRender(this.props.labelPNs.items, ownerNum);
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
    } else if (col === 2) {
      td.style.width = `${TAGGING_COL_WIDTH}px`;
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
    return td;
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
    this.map = new window.BMap.Map('ownernumandctandstartedhourclass', {enableMapClick: false});
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

  handleChart(bool) {
    this.setState({
      isChart: bool,
    });
  }

  getImgURL() {
    downloadIamge(this.state.myChart, 'B7-本方号码常用基站');
  }

  getExcel() {
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownernumandctandstartedhourclass.xlsx`, {
      criteria: this.props.search.criteria,
      view: {},
    }, {responseType: 'blob'}, true).then(res => {
      saveAs.saveAs(window.URL.createObjectURL(res.data), res.fileName);
    });
  }

  fetchData(params) {
    const {fetchOwnernumAndctandstartedhourclassChart} = this.props.actions;
    fetchOwnernumAndctandstartedhourclassChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    let rangValue = [0, 23];
    if (params.started_hour_class) {
      const rangVal = params.started_hour_class[1];
      rangValue = rangVal.length > 1 ? [rangVal[0], rangVal[rangVal.length - 1]] : [rangVal[0], rangVal[0]];
    }
    firstReq = true;
    if (markerClusterer) {
      this.removeCtCodeMark();
    }
    this.setState({
      showHeatmap: true,
      showCT: [],
      points: [],
      rangValue,
      hotMapData: null,
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      });
    }
    if (nextProps.ownernumandctandstartedhourclassHotMap && JSON.stringify(nextProps.ownernumandctandstartedhourclassHotMap) !== JSON.stringify(this.state.hotMapData)) {
      const val = Object.values(nextProps.ownernumandctandstartedhourclassHotMap);
      const k = Object.keys(nextProps.ownernumandctandstartedhourclassHotMap);
      let points = [];
      val.forEach(item => {
        points = [...points, ...item];
      });
      firstReq = true;
      this.renderHotMap(points);
      this.setState({
        hotMapData: nextProps.ownernumandctandstartedhourclassHotMap,
        owner_nums: k,
        selectOptData: k,
        points,
      });
    }
  }


  componentWillUnmount() {
    this.unmountCompsOnDoms();
    this.props.actions.clearOwnernumAndctandstartedhourclassChart();
    markerClusterer = null;
  }

  unmountCompsOnDoms = () => {
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
  }


  onSelectChange = async (value) => {
    const {rangValue} = this.state;
    let points = [];
    const hour = [];
    for (let i = rangValue[0]; i <= rangValue[1]; i++) {
      hour.push(i);
    }
    let res = await ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownernumandctandstartedhourclass`, {
      criteria: {
        ...this.state.criteria,
        owner_num: ["IN", value],
        started_hour_class: ['IN', hour]
      }
    });
    if (res.meta.success) {
      let p = formatOwnernumandctandstartedhourclass(res.data).points;
      value.forEach(num => {
        points = [...points, ...p[num]];
      });
      this.renderHotMap(points);
      if (this.map.getZoom() >= maxZoom || this.state.showCT[0]) {
        this.onCodeCheckBoxChange(false);
        this.setState({
          points,
        }, () => {
          this.onCodeCheckBoxChange(true);
        });
      }
    } else {
      this.renderHotMap(points);
      this.onCodeCheckBoxChange(false);
    }


    this.setState({
      owner_nums: value,
    });
  }

  formatter = (val) => {
    let value = val * 1 + 4;
    if (value >= 24) {
      value -= 24;
    }
    return `${value}时`;
  }
  onChangeDouble = (doubleValue) => {
    const hour = [];
    for (let i = doubleValue[0]; i <= doubleValue[1]; i++) {
      hour.push(i);
    }
    const criteria = Object.assign({}, this.props.search.criteria);
    criteria.owner_num = ['IN', this.state.owner_nums];
    criteria.started_hour_class = ['IN', hour];
    ajaxs.post(`/cases/${this.props.caseId}/pbills/overview/group-by-ownernumandctandstartedhourclass`, {criteria}).then(res => {
      if (res.meta && res.meta.success) {
        let points = formatOwnernumandctandstartedhourclass(res.data).points;
        const val = Object.values(points);
        let p = [];
        val.forEach(item => {
          p = [...p, ...item];
        });
        this.renderHotMap(p);
        if (this.map.getZoom() >= maxZoom || this.state.showCT[0]) {
          this.onCodeCheckBoxChange(false);
          this.setState({
            points: p,
          }, () => {
            this.onCodeCheckBoxChange(true);
          });
        } else {
          this.setState({
            points: p,
          });
        }
      }
    }).catch(err => {
      console.log(err);
    });
    this.setState({
      rangValue: doubleValue,
    });
  }

  onCodeCheckBoxChange = (checked) => {
    if (checked) {
      this.addCtCodeMark(this.state.points);
    } else {
      this.removeCtCodeMark(this.state.points);
    }
    this.setState({
      showCT: [checked],
    });
  }
  addCtCodeMark = (points) => {
    const markers = [];
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
    // console.log(markerClusterer.getStyles());
  }
  removeCtCodeMark = (points) => {
    if (markerClusterer) {
      markerClusterer.clearMarkers();
    }
  }
  onCheckBoxChange = (selectedItems) => {
    if (selectedItems.length > 1) {
      selectedItems = [selectedItems.pop()];
    }
    this.onCodeCheckBoxChange(selectedItems[0]);
    this.setState({
      showCT: selectedItems,
    });
  }

  render() {
    const {owner_nums, selectOptData} = this.state;
    return (
      <div className="chart-item">
        <ChartTitle title="B7-基站vs本方号码"
                    align="center"
                    handleChart={this.handleChart}
                    getImgURL={this.getImgURL}
                    getExcel={this.getExcel}
        />
        <ExcelView id="ownernumandctandstartedhourclassExcel"
                   colHeaders={this.state.colHeaders}
                   drilldown={this.state.drilldownOptions}
                   hotSetting={this.state.hotSetting || null}
                   data={this.props.ownernumandctandstartedhourclassList}
        />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          margin: '10px 0',
          padding: '10px 0',
          backgroundColor: '#eee'
        }}>
          <Select mode="multiple" showSearch value={owner_nums} onChange={this.onSelectChange} style={{flex: 1}}>
            {
              selectOptData.map(num => {
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
        <div id="ownernumandctandstartedhourclass" className={'pbStatChart'}/>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    ownernumandctandstartedhourclassList: state.pbStat.ownernumandctandstartedhourclassList,
    ownernumandctandstartedhourclassItems: state.pbStat.ownernumandctandstartedhourclassItems,
    ownernumandctandstartedhourclassHotMap: state.pbStat.ownernumandctandstartedhourclassHotMap,
    search: state.search,
    labelPNs: state.labelPNs,
    labelCells: state.labelCells,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(OwnernumAndctandstartedhourclass);
