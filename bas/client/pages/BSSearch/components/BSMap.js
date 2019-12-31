import React, {Component, Fragment} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMapMarkerAlt, faCircle, faRuler} from '@fortawesome/free-solid-svg-icons';
import IceLabel from '@icedesign/label';
import {Form, Input, Radio, Grid, Button, Field, Balloon, Message, Select} from '@alifd/next';
import {actions as bsActions} from '../../../stores/bsSearch/index';
import {installExternalLibs, getUrlRequest} from '../../../utils/utils';
import {actions as labelCellActions} from '../../../stores/labelCell';
import appConfig from '../../../appConfig';
import {coordOffsetDecrypt, xaddrDecrypt} from '../../../utils/basCoord';
import ajaxs from '../../../utils/ajax';
import {FormBinder as IceFormBinder} from "@icedesign/form-binder";
import {far} from "@fortawesome/free-regular-svg-icons";
// 谷歌坐标
// const x = 116.32715863448607;
// const y = 39.990912172420714;

const FormItem = Form.Item;
const {Row, Col} = Grid;

let myDistanceToolObject = {};

const labelSpan = (
  <span>
    <span style={{color: 'red'}}>粘贴格式要求：</span>
     每行一条基站代码，基站代码的样式为LAC:CI:MNC或者NID:BID:SID
  </span>
);

const MNCSpan = (
  <span style={{whiteSpace: 'nowrap'}}>
    <span style={{color: 'red', marginRight: '5px'}}>MNC</span>
    {/* 00移动 01联通 11电信4G */}
  </span>
);

const SIDSpan = (
  <span style={{whiteSpace: 'nowrap'}}>
    <span style={{color: 'red', marginRight: '5px'}}>SID</span>
    {/* 00移动 01联通 11电信4G */}
  </span>
);

const LACSpan = (
  <span style={{whiteSpace: 'nowrap'}}>
    <span style={{color: 'red', marginRight: '5px'}}>LAC / TAC</span>
  </span>
);

const NIDSpan = (
  <span style={{whiteSpace: 'nowrap'}}>
    <span style={{color: 'red', marginRight: '5px'}}>NID</span>
  </span>
);

const CISpan = (
  <span style={{whiteSpace: 'nowrap'}}>
    <span style={{color: 'red', marginRight: '5px'}}>CI</span>
    {/* Cell Identity 2G(Cell id) 3G/4G(ECI) */}
  </span>
);

const BIDSpan = (
  <span style={{whiteSpace: 'nowrap'}}>
    <span style={{color: 'red', marginRight: '5px'}}>BID</span>
    {/* Cell Identity 2G(Cell id) 3G/4G(ECI) */}
  </span>
);
const stateSpan = (
  <span style={{whiteSpace: 'nowrap'}}>
    <span style={{color: 'red', marginRight: '5px'}}>城市</span>
    {/* Cell Identity 2G(Cell id) 3G/4G(ECI) */}
  </span>
);

let drawingManager = {};

class BSMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      radio: '0',
      radio1: '0',
      radio2: '0',
      binaryType: '1',
      activeCode: null,
      codeList: [],
      codeMultipleList: [],
      cityList: [],
      ctLabel: null,
      inputValue: 0x00,
      inputDECValue: 0x00,
      lacvalue: '',
      tacvalue: '',
      zoom: 13,
      stateData: [],
      cityData: [],
      bdPoint: null,
      color: null,
      currentZoom: null,
    };
    this.field = new Field(this, {
      onChange: (name, value) => {
        // console.log('onChange', name, value,);
        if (name === 'lac') {
          if (/^[1-9]\d*$/.test(value)) {
            const v = parseInt(value, 0);
            this.field.setValue('tac', v.toString(16).toUpperCase());
          } else {
            value = '';
            this.field.setValue('tac', '');
          }
        } else if (name === 'tac') {
          if (/^[a-fA-F0-9]+$/.test(value)) {
            const v = parseInt(value, 16);
            this.field.setValue('lac', v);
          } else {
            this.field.setValue('lac', '');
          }
        } else if (name === 'ci') {
          if (/^[1-9]\d*$/.test(value)) {
            const v = parseInt(value, 0);
            this.field.setValue('ci2', v.toString(16).toUpperCase());
          } else {
            this.field.setValue('ci2', '');
          }
        } else if (name === 'ci2') {
          if (/^[a-fA-F0-9]+$/.test(value)) {
            const v = parseInt(value, 16);
            this.field.setValue('ci', v);
          } else {
            this.field.setValue('ci', '');
          }
        } else if (name === 'mnc') {
          if (/^[1-9]\d*$/.test(value)) {
            const v = parseInt(value, 0);
            this.field.setValue('mnc2', v.toString(16).toUpperCase());
          } else {
            this.field.setValue('mnc2', '');
          }
        } else if (name === 'mnc2') {
          if (/^[a-fA-F0-9]+$/.test(value)) {
            const v = parseInt(value, 16);
            this.field.setValue('mnc', v);
          } else {
            this.field.setValue('mnc', '');
          }
        } else if (name === 'cityCi') {
          if (/^[1-9]\d*$/.test(value)) {
            const v = parseInt(value, 0);
            this.field.setValue('cityCiHEX', v.toString(16).toUpperCase());
          } else {
            this.field.setValue('cityCiHEX', '');
          }
        } else if (name === 'cityCiHEX') {
          if (/^[a-fA-F0-9]+$/.test(value)) {
            const v = parseInt(value, 16);
            this.field.setValue('cityCi', v);
          } else {
            this.field.setValue('cityCi', '');
          }
        } else if (name === 'cityMnc') {
          if (/^[1-9]\d*$/.test(value)) {
            const v = parseInt(value, 0);
            this.field.setValue('cityMncHex', v.toString(16).toUpperCase());
          } else {
            this.field.setValue('cityMncHex', '');
          }
        } else if (name === 'cityMncHex') {
          if (/^[a-fA-F0-9]+$/.test(value)) {
            const v = parseInt(value, 16);
            this.field.setValue('cityMnc', v);
          } else {
            this.field.setValue('cityMnc', '');
          }
        } else if (name === 'state') {
          this.getCityList(value)
        }
      },
    });
    this.translateCallback = this.translateCallback.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.fetchMultiple = this.fetchMultiple.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRadio1Change = this.onRadio1Change.bind(this);
    this.onRadio2Change = this.onRadio2Change.bind(this);
    this.setData = this.setData.bind(this);
    this.clearMap = this.clearMap.bind(this);
    this.lacOnChange = this.lacOnChange.bind(this);
    this.tacOnChange = this.tacOnChange.bind(this);
    this.measuring = this.measuring.bind(this);
  }

  myCircle = (e, overlay, style) => {
    this.map.setDefaultCursor('crosshair');
    this.map.disableDragging();
    let flag = false;

    let mousedownFun = function (mousedownEvent) {
      let radius = 0;
      let circle = null;
      let that = this;

      let mousemoveFun = function (e) {
        this.removeOverlay(circle);
        if (radius === this.getDistance(overlay.point, e.point)) {
          flag = true
        }

        // if (flag){
        //   radius = this.getDistance(overlay.point, e.point);
        //   circle = new BMap.Circle(overlay.point,radius,{strokeColor: style ? style : 'blue', strokeWeight:1}); //创建圆
        //   this.addOverlay(circle);
        // } else if (!flag) {
        //   radius += this.getDistance(mousedownEvent.point, overlay.point) / 5;
        //   if (this.getDistance(overlay.point, e.point) - radius <= 100){
        //     radius = this.getDistance(overlay.point, e.point);
        //   }
        //   circle = new BMap.Circle(overlay.point,radius,{strokeColor:style ? style : 'blue', strokeWeight:1}); //创建圆
        //   this.addOverlay(circle);
        // }

        radius = this.getDistance(overlay.point, e.point);
        circle = new BMap.Circle(overlay.point, radius, {strokeColor: style ? style : 'blue', strokeWeight: 1}); //创建圆
        this.addOverlay(circle);

      };

      let mouseupFun = function (mouseupEvent) {
        this.enableDragging();
        this.removeEventListener('mousemove', mousemoveFun);
        this.removeEventListener('mouseup', mouseupFun);
        this.removeEventListener('mousedown', mousedownFun);
        this.setDefaultCursor('pointer');


        //创建文字标签
        let opts = {
          position: mouseupEvent.point,    // 指定文本标注所在的地理位置（当前鼠标的位置）
          offset: new BMap.Size(5, -15)    //设置文本偏移量
        };
        let label = null;
        if (radius.toFixed(0) < 1000) {
          label = new BMap.Label("半径：" + `<span style='color: #ff6319'>${radius.toFixed(0)}</span>` + "米", opts);  // 创建文本标注对象
        } else {
          label = new BMap.Label("半径：" + `<span style='color: #ff6319'>${(radius / 1000).toFixed(2)}</span>` + "公里", opts);  // 创建文本标注对象
        }
        label.setStyle({
          color: 'rgb(51, 51, 51)',
          border: "1px solid rgb(255, 1, 3)",
          padding: '3px 5px',
          backgroundColor: '#fff',//#2267AD
        });
        label.setOffset(new BMap.Size(15, -5));


        //创建X图标
        let myIcon = new BMap.Icon("http://api.map.baidu.com/images/mapctrls.gif", new BMap.Size(15, 15));
        myIcon.setImageOffset(new BMap.Size(0, -14));
        let marker = new BMap.Marker(mouseupEvent.point, {icon: myIcon});  // 创建标注
        marker.setOffset(new BMap.Size(8, 8));

        //创建半径
        let polyline = new BMap.Polyline([
          overlay.point,
          mouseupEvent.point
        ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});//后面参数为划线的样式

        //添加覆盖物
        this.addOverlay(polyline);//添加半径直线
        this.addOverlay(label);//添加label
        this.addOverlay(marker);//添加删除图标

        //删除图标绑定事件
        marker.addEventListener('click', function () {
          that.removeOverlay(marker);
          that.removeOverlay(label);
          that.removeOverlay(polyline);
          that.removeOverlay(circle);
        });


      };


      this.addEventListener('mousemove', mousemoveFun);
      this.addEventListener("mouseup", mouseupFun);
    };

    this.map.addEventListener("mousedown", mousedownFun);
  };


  //  初始化百度地图
  renderMap(x = 116.404, y = 39.915) {
    const {login: {summary}} = this.props;
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
    const ggPoint = new window.BMap.Point(x, y);
    this.map = new window.BMap.Map('baseMap');
    this.map.addControl(mapType1);
    this.map.addControl(top_right_navigation);
    myDistanceToolObject = new window.BMapLib.DistanceTool(this.map, {lineStroke: 2});
    this.map.enableScrollWheelZoom(); // 允许鼠标缩放
    this.map.addEventListener('zoomend', function () {
      that.setState({currentZoom: that.map.getZoom()})
    });


    //实例化鼠标绘制工具
    drawingManager = new window.BMapLib.DrawingManager(this.map, {
      isOpen: false, //是否开启绘制模式
      enableDrawingTool: false, //是否显示工具栏
      drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new window.BMap.Size(0, 10), //偏离值
        scale: 0.8
      },
      circleOptions: {
        strokeColor: 'blue',
        strokeWeight: 1,
      },
      markerOptions: {
        enableDragging: true
      },
      // enableCalculate:true
    });

    let that = this;
    let centerPoint = null;//圆心
    let endPoint = null;   //结束点;
    let radius = null;     //半径
    this.map.addEventListener("mousemove", function () {
      if (drawingManager._mask != null) {
        drawingManager._mask.addEventListener('mousedown', function (e) {
          centerPoint = e.point
        });
        drawingManager._mask.addEventListener('mouseup', function (e) {
          endPoint = e.point;
        });
      }
    });
    drawingManager.addEventListener('overlaycomplete', function (e, overlay) {
      let overLay = e.overlay;
      if (e.drawingMode === 'circle') {
        let centerMarker = null;
        if (that.state.bdPoint) {
          endPoint.lng = endPoint.lng + (that.state.bdPoint.lng - centerPoint.lng);
          endPoint.lat = endPoint.lat + (that.state.bdPoint.lat - centerPoint.lat);
          centerPoint = that.state.bdPoint;
          radius = drawingManager._map.getDistance(that.state.bdPoint, endPoint);
          e.overlay.setCenter(that.state.bdPoint);
          that.setState({bdPoint: null});
        } else {
          //获取半径距离
          radius = drawingManager._map.getDistance(centerPoint, endPoint);
          //创建中心点
          centerMarker = new BMap.Marker(centerPoint);
        }
        //创建文字标签
        let opts = {
          position: endPoint,    // 指定文本标注所在的地理位置（当前鼠标的位置）
          offset: new BMap.Size(5, -15)    //设置文本偏移量
        };
        let label = null;
        if (radius.toFixed(0) < 1000) {
          label = new BMap.Label("半径：" + `<span style='color: #ff6319'>${radius.toFixed(0)}</span>` + "米", opts);  // 创建文本标注对象
        } else {
          label = new BMap.Label("半径：" + `<span style='color: #ff6319'>${(radius / 1000).toFixed(2)}</span>` + "公里", opts);  // 创建文本标注对象
        }
        label.setStyle({
          color: 'rgb(51, 51, 51)',
          border: "1px solid rgb(255, 1, 3)",
          padding: '3px 5px',
          backgroundColor: '#fff',//#2267AD
        });
        label.setOffset(new BMap.Size(15, -5));


        //创建X图标
        let myIcon = new BMap.Icon("http://api.map.baidu.com/images/mapctrls.gif", new BMap.Size(15, 15));
        myIcon.setImageOffset(new BMap.Size(0, -14));
        let marker = new BMap.Marker(endPoint, {icon: myIcon});  // 创建标注
        marker.setOffset(new BMap.Size(8, 8));

        //创建半径
        let polyline = new BMap.Polyline([
          centerPoint,
          endPoint
        ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});//后面参数为划线的样式

        //添加覆盖物
        that.map.addOverlay(polyline);//添加半径直线
        that.map.addOverlay(label);//添加label
        that.map.addOverlay(marker);//添加删除图标
        that.map.addOverlay(centerMarker);//中心点

        //删除图标绑定事件
        marker.addEventListener('click', function () {
          that.map.removeOverlay(overLay);
          that.map.removeOverlay(marker);
          that.map.removeOverlay(label);
          that.map.removeOverlay(polyline);
          that.map.removeOverlay(centerMarker);
        });

        if (centerMarker) {
          let opts = {
            width: 300,     // 信息窗口宽度
            height: 160,     // 信息窗口高度
            title: "添加标记", // 信息窗口标题
          };
          let text = '';
          let preservationFun = null;
          let editFun = null;
          let getDom = null;
          let editContent = `
              <div>
                <button style="margin: 5px 0 20px 0">搜索区域内基站</button> <input type="checkbox">移动<input type="checkbox">联通<input type="checkbox">电信<input type="checkbox">CDMA
                 <textarea style="width: 100%;height:60px" id="textarea" placeholder=${text ? text : "我的备注"}></textarea>
                 <div style="line-height: 35px;text-align: right"><span id="Preservation">保存</span></div>
                </div>`;
          let showContent = null;
          let infoWindow = new BMap.InfoWindow(editContent, opts);
          centerMarker.openInfoWindow(infoWindow);

          preservationFun = function () {
            showContent = `
              <div>
              <button style="margin: 5px 0 20px 0">搜索区域内基站</button> <input type="checkbox">移动<input type="checkbox">联通<input type="checkbox">电信<input type="checkbox">CDMA
              <div style="height: 30px; line-height: 30px;border-top: 1px solid #ccc;">${text}</div>
              </div>
              `;
            infoWindow.setContent(showContent);
            infoWindow.setTitle(`<div id="edit"><span>我的标记</span><span style="margin-left: 200px">编辑</span></div>`);
            infoWindow.setHeight(100);
            if (document.getElementById('edit')) {
              document.getElementById('edit').onclick = editFun;
            }
          };


          getDom = function () {
            document.getElementById('textarea').onchange = function (e) {
              text = e.target.value;
            };
            document.getElementById('Preservation').onclick = preservationFun;
          };

          editFun = function () {
            editContent = `
                 <div>
                   <button style="margin: 5px 0 20px 0">搜索区域内基站</button> <input type="checkbox">移动<input type="checkbox">联通<input type="checkbox">电信<input type="checkbox">CDMA
                   <textarea style="width: 100%;height:60px" id="textarea" placeholder=${text ? text : "我的备注"}></textarea>
                   <div style="line-height: 35px;text-align: right"><span id="Preservation">保存</span></div>
                 </div>`;
            infoWindow.setContent(editContent);
            infoWindow.setTitle('编辑标注');
            infoWindow.setHeight(160);
            getDom()
          };


          if (!infoWindow.isOpen()) {
            let fun = function () {
              infoWindow.setContent(editContent);
              getDom();
              infoWindow.removeEventListener('open', fun)
            };
            infoWindow.addEventListener('open', fun);
          } else {
            getDom()
          }


          //点添加点击事件
          centerMarker.addEventListener('click', function () {
            this.openInfoWindow(infoWindow);
            if (document.getElementById('edit')) {
              document.getElementById('edit').onclick = editFun;
            } else {
              getDom()
              preservationFun();
            }
          });


        }

        drawingManager.circleOptions.strokeColor = 'blue';
      } else {

        let overlay = e.overlay;
        overlay.addEventListener('rightclick', (e) => {
          that.myCircle(e, overlay)
        });


        let text = '';
        let preservationFun = null;
        let editFun = null;
        let getDom = null;
        let editContent = `
        <div>
        <!--<button style="margin: 5px 0 20px 0">搜索区域内基站</button> <input type="checkbox">移动<input type="checkbox">联通<input type="checkbox">电信<input type="checkbox">CDMA-->
        <textarea style="width: 100%;height:60px" id="textarea" placeholder=${text ? text : "我的备注"}></textarea>
        <div style="line-height: 35px;text-align: right"><span id="Preservation">保存</span><span id="remove">删除</span></div>
        </div>`;
        let showContent = null;


        let opts = {
          width: 300,     // 信息窗口宽度
          height: 160,     // 信息窗口高度
          title: "添加标记", // 信息窗口标题
        };
        let infoWindow = new BMap.InfoWindow(editContent, opts);
        overlay.openInfoWindow(infoWindow);


        preservationFun = function () {
          showContent = `
              <div>
              <!--<button style="margin: 5px 0 20px 0">搜索区域内基站</button> <input type="checkbox">移动<input type="checkbox">联通<input type="checkbox">电信<input type="checkbox">CDMA-->
              <div style="height: 30px; line-height: 30px;border-top: 1px solid #ccc;">${text}</div>
              </div>
              `;
          infoWindow.setContent(showContent);
          infoWindow.setTitle(`<div id="edit"><span>我的标记</span><span style="margin-left: 200px">编辑</span></div>`);
          infoWindow.setHeight(100);
          document.getElementById('edit').onclick = editFun;
        };


        getDom = function () {
          document.getElementById('textarea').onchange = function (e) {
            text = e.target.value;
          };

          document.getElementById('remove').onclick = function () {
            that.map.removeOverlay(overlay);
          };

          document.getElementById('Preservation').onclick = preservationFun;
        };

        editFun = function () {
          editContent = `
                 <div>
                   <!--<button style="margin: 5px 0 20px 0">搜索区域内基站</button> <input type="checkbox">移动<input type="checkbox">联通<input type="checkbox">电信<input type="checkbox">CDMA-->
                   <textarea style="width: 100%;height:60px" id="textarea" placeholder=${text ? text : "我的备注"}></textarea>
                   <div style="line-height: 35px;text-align: right"><span id="Preservation">保存</span><span id="remove">删除</span></div>
                 </div>`;
          infoWindow.setContent(editContent);
          infoWindow.setTitle('编辑标注');
          infoWindow.setHeight(160);
          getDom()
        };


        if (!infoWindow.isOpen()) {
          let fun = function () {
            infoWindow.setContent(editContent);
            getDom();
            infoWindow.removeEventListener('open', fun)
          };
          infoWindow.addEventListener('open', fun);
        } else {
          getDom()
        }


        //点添加点击事件
        overlay.addEventListener('click', function () {
          this.openInfoWindow(infoWindow);
          if (document.getElementById('edit')) {
            document.getElementById('edit').onclick = editFun;
          } else {
            getDom()
          }
        });
      }
      drawingManager.close();
    });


    if (summary && summary.pb_city) {
      this.map.centerAndZoom(summary.pb_city, appConfig.bigMapZoom);
      return;
    } else {
      ajaxs.get(`/cases/${this.props.caseId}/summary`).then(res => {
        if (res.meta && res.meta.success) {
          this.map.centerAndZoom(res.data.pb_city, appConfig.bigMapZoom);
        }
      })
    }
    this.map.centerAndZoom(ggPoint, 10);
    const myCity = new window.BMap.LocalCity();
    myCity.get((result) => {
      this.map.setCenter(result.name);
    });
  }


  measuring() {
    myDistanceToolObject.open();
  }

  Circle = () => {
    drawingManager.open();
    drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE)
  };

  marker = () => {
    drawingManager.open();
    drawingManager.setDrawingMode(BMAP_DRAWING_MARKER)
  };


  // 坐标转换完之后的回调函数
  translateCallback(data) {
    if (data.status === 0) {
      const {bsSearchs} = this.props;
      //  增加连接线
      // const polyline = new window.BMap.Polyline([
      //   data.points[0],
      //   new window.BMap.Point(x, y),
      // ], { strokeColor: 'red', strokeWeight: 2 });
      const sContent = `<div>
        <h3>地址: ${bsSearchs.items.addr}</h3>
        <span>(${(data.points[0].lat * 1)}, ${(data.points[0].lng * 1)})</span>
      </div>`;
      //  增加范围
      this.map.clearOverlays();
      // const circle = new window.BMap.Circle(data.points[0], bsSearchs.items.radius, { strokeColor: 'red', strokeWeight: 2, fillColor: 'red', fillOpacity: 0.1 });
      // this.map.addOverlay(polyline);
      // this.map.addOverlay(circle);
      const marker = new window.BMap.Marker(data.points[0]);
      this.map.addOverlay(marker);
      const infoWindow = new window.BMap.InfoWindow(sContent, {offset: new window.BMap.Size(0, -15),});
      marker.openInfoWindow(infoWindow);
      marker.addEventListener('click', function () {
        this.openInfoWindow(infoWindow);
      });
      this.map.setCenter(data.points[0]);
      this.map.centerAndZoom(data.points[0], 15);
    }
  }

  fetchData(values, bool = false, isPush = true) {
    const {fetchBsSearchs, fetchLabelCells} = this.props.actions;
    const {codeList, ctLabel, zoom, inputDECValue} = this.state;
    let {mnc, tac, ci2} = values;
    const that = this;
    let ctCode = null;
    if (bool) {
      ctCode = values;
    } else {
      if (typeof tac === 'object') {
        tac = [tac[0]];
      }
      if (typeof ci2 === 'object') {
        ci2 = [ci2[0]];
      }
      ctCode = `${tac}:${ci2}:${isNaN(parseInt(mnc)) ? mnc : parseInt(mnc)}`;
    }
    ctCode = ctCode.toUpperCase();

    fetchBsSearchs({case_id: this.props.caseId, ct_codes: [ctCode], coord: '2', fmt: '16'}).then(async res => {
      const {body} = res;
      const codeObj = {
        code: ctCode,
        color: 'red',
        bdPoint: null,
        infoWindow: null,
      };
      if (body.data.glat) {
        const ggPoint = new window.BMap.Point(body.data.glng * 1, body.data.glat * 1);
        const convertor = new window.BMap.Convertor();
        const pointArr = [];
        pointArr.push(ggPoint);
        convertor.translate(pointArr, 3, 5, this.translateCallback);
      } else if (body.data[ctCode].length > 0) {
        let pointStyle = {};
        let label = null;
        if (ctLabel && ctLabel.body.meta && ctLabel.body.meta.success) {
          const data = ctLabel.body.data;
          data.forEach(item => {
            if (item.ct_code === ctCode) {
              codeObj.color = item.marker_color;
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
        let p = coordOffsetDecrypt(body.data[ctCode][0][0] * 1, body.data[ctCode][0][1] * 1);
        const bdPoint = new window.BMap.Point(p[0] * 1, p[1] * 1);
        codeObj.bdPoint = bdPoint;
        const sContent = `<div>
          <h3 style="margin-bottom: 5px">
            标注: <span style="font-size: '16px'; background: ${label && label.marker_color}; color: #fff; padding: 2px">${label && label.label}</span>
          </h3>
          <p style="font-size: 14px; margin-top: 0">
                <span style="font-size: 16px">基站:</span> ${ctCode} <FontAwesomeIcon icon={faExchangeAlt} style="margin-left: 8px" /> ${`${parseInt(ctCode.split(':')[0], 16)}:${parseInt(ctCode.split(':')[1], 16)}:${parseInt(ctCode.split(':')[2], 16)}`}
          </p>
          <h3 style="font-size: 14px">${body.data[ctCode][1].address}</h3>
        </div>`;
        //  增加范围
        // this.map.clearOverlays();
        // const circle = new window.BMap.Circle(data.points[0], bsSearchs.items.radius, { strokeColor: 'red', strokeWeight: 2, fillColor: 'red', fillOpacity: 0.1 });
        // this.map.addOverlay(polyline);
        // this.map.addOverlay(circle);
        const marker = new window.BMap.Marker(bdPoint, pointStyle);
        codeObj.marker = marker;
        this.map.addOverlay(marker);
        const infoWindow = new window.BMap.InfoWindow(sContent, {offset: new window.BMap.Size(0, -15),});
        codeObj.infoWindow = infoWindow;
        this.map.openInfoWindow(infoWindow, bdPoint);

        marker.addEventListener('rightclick', function (e) {
          if (label) {
            that.myCircle(e, marker, label.marker_color)
          } else {
            that.myCircle(e, marker)
          }
          that.setState({bdPoint})
        });

        marker.addEventListener('click', function () {
          this.map.openInfoWindow(infoWindow, bdPoint);
        });
        this.map.setCenter(bdPoint);
        this.map.setZoom(zoom);
        this.map.addEventListener("zoomend", () => {
          this.setState({
            zoom: this.map.getZoom()
          })
          this.map.setCenter(bdPoint);
          this.map.setZoom(this.map.getZoom());
        })
      } else {
        Message.warning('未查询到基站.');
        codeObj.color = '#ccc';
      }
      if (isPush) {
        codeList.unshift(codeObj);
      }
      this.setState({
        codeList,
        activeCode: ctCode,
      });
    });
  }

  fetchMultiple(codes, bool = false, cityInfo) {
    let {ctLabel, binaryType, zoom, codeList} = this.state;
    let that = this;
    const {fetchBsSearchs} = this.props.actions;
    if (bool) {
      codes = Array.isArray(codes) ? JSON.parse(JSON.stringify(codes)) : [codes];
      if (codes.length === 0) {
        Message.warning(`未查询到${cityInfo}包含的基站.`);
      }
    }
    fetchBsSearchs({
      case_id: this.props.caseId,
      ct_codes: codes,
      coord: '2',
      fmt: binaryType === '1' ? '16' : '10'
    }).then(async res => {
      const {body} = res;
      for (const k in body.data) {
        let codeObj = {
          code: null,
          color: 'red',
        };
        codeObj.code = k;
        if (body.data[k].length > 0) {
          let pointStyle = {};
          let label = null;
          if (ctLabel && ctLabel.body.meta && ctLabel.body.meta.success) {
            const data = ctLabel.body.data;
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              if (item.ct_code === k) {
                label = item;
                pointStyle = {
                  // 指定Marker的icon属性为Symbol
                  icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                    scale: 1, // 图标缩放大小
                    fillColor: item.marker_color, // 填充颜色
                    fillOpacity: 0.8, // 填充透明度
                  }),
                };
                codeObj.color = item.marker_color;
                break;
              }
            }
          }
          let p = coordOffsetDecrypt(body.data[k][0][0] * 1, body.data[k][0][1] * 1);
          const bdPoint = new window.BMap.Point(p[0] * 1, p[1] * 1);
          const code10 = `${parseInt(k.split(':')[0], 16)}:${parseInt(k.split(':')[1], 16)}:${parseInt(k.split(':')[2], 16)}`
          const sContent = `<div>
          <h3 style="margin-bottom: 5px; font-size: 13px">
            标注: <span style="font-size: '13px'; background: ${label && label.marker_color}; color: #fff; padding: 2px">${label && label.label}</span>
          </h3>
                <span style="font-size: 13px">基站:</span> ${k} <FontAwesomeIcon icon={faExchangeAlt} style="margin-left: 8px" /> ${code10}
          </p>
          <h3 style="font-size: 12px">${body.data[k][1].address}</h3>
        </div>`;
          //  增加范围
          // this.map.clearOverlays();
          // const circle = new window.BMap.Circle(data.points[0], bsSearchs.items.radius, { strokeColor: 'red', strokeWeight: 2, fillColor: 'red', fillOpacity: 0.1 });
          // this.map.addOverlay(polyline);
          // this.map.addOverlay(circle);
          const marker = new window.BMap.Marker(bdPoint, pointStyle);
          this.map.addOverlay(marker);
          const infoWindow = new window.BMap.InfoWindow(sContent, {offset: new window.BMap.Size(0, -15)});
          if (codes[0] === k) {
            this.map.openInfoWindow(infoWindow, bdPoint);
            this.setState({
              activeCode: k,
            });
          }

          marker.addEventListener('rightclick', function (e) {
            if (label) {
              that.myCircle(e, marker, label.marker_color)
            } else {
              that.myCircle(e, marker)
            }
            that.setState({bdPoint})
          });

          marker.addEventListener('click', function () {
            this.map.openInfoWindow(infoWindow, bdPoint);
          });
          this.map.addEventListener("zoomend", () => {
            this.setState({
              zoom: this.map.getZoom()
            })
            this.map.setCenter(bdPoint);
            this.map.setZoom(this.map.getZoom());
          })
          this.map.setCenter(bdPoint);
          this.map.setZoom(zoom);
        } else {
          codeObj.color = '#ccc';
        }
        codes[codes.indexOf(k)] = codeObj;
      }
      if (bool) return;
      codeList = [...codes, ...codeList]
      this.setState({
        codeList
      });
    });
  }


  getLocCityCi = (value, bool = false) => {
    let {ctLabel, binaryType, zoom, bdPoint, codeList} = this.state;
    let that = this;
    const {actions, caseId} = this.props;
    actions.getLocCityCiBsSearch({caseId, city: value.city, ci: value.cityCi, mnc: value.cityMnc}).then(async res => {
      const {body} = res;
      let codes = [];
      let codeArr = []
      if (Object.keys(body.data).length === 0) {
        Message.warning(`未查询到${value.city}:${value.cityCi}:${value.cityMnc}包含的基站.`);
      }
      for (const k in body.data) {
        let codeObj = {
          code: null,
          color: 'red',
        };
        codeObj.code = k;
        codeArr.push(k)
        if (body.data[k].length > 0) {
          let pointStyle = {};
          let label = null;
          if (ctLabel && ctLabel.body.meta && ctLabel.body.meta.success) {
            const data = ctLabel.body.data;
            data.forEach(item => {
              if (item.ct_code === k) {
                label = item;
                pointStyle = {
                  // 指定Marker的icon属性为Symbol
                  icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                    scale: 1, // 图标缩放大小
                    fillColor: item.marker_color, // 填充颜色
                    fillOpacity: 0.8, // 填充透明度
                  }),
                };
                codeObj.color = item.marker_color;
              }
            });
          }
          let p = coordOffsetDecrypt(body.data[k][0][0] * 1, body.data[k][0][1] * 1);
          const bdPoint = new window.BMap.Point(p[0] * 1, p[1] * 1);
          const sContent = `<div>
          <h3 style="margin-bottom: 5px">
            标注: <span style="font-size: '16px'; background: ${label && label.marker_color}; color: #fff; padding: 2px">${label && label.label}</span>
          </h3>
          <p style="font-size: 14px; margin-top: 0">
                <span style="font-size: 16px">基站:</span> ${k} <FontAwesomeIcon icon={faExchangeAlt} style="margin-left: 8px" /> ${`${parseInt(k.split(':')[0], 16)}:${parseInt(k.split(':')[1], 16)}:${parseInt(k.split(':')[2])}`}
          </p>
          <h3 style="font-size: 14px">${body.data[k][1].address}</h3>
        </div>`;
          //  增加范围
          // this.map.clearOverlays();
          // const circle = new window.BMap.Circle(data.points[0], bsSearchs.items.radius, { strokeColor: 'red', strokeWeight: 2, fillColor: 'red', fillOpacity: 0.1 });
          // this.map.addOverlay(polyline);
          // this.map.addOverlay(circle);
          const marker = new window.BMap.Marker(bdPoint, pointStyle);
          this.map.addOverlay(marker);
          const infoWindow = new window.BMap.InfoWindow(sContent, {offset: new window.BMap.Size(0, -15),});
          this.map.openInfoWindow(infoWindow, bdPoint);

          // if (typeof codes[0] === 'object' ? codes[0].ct_code === k : codes[0] === k) {
          //   this.map.openInfoWindow(infoWindow, bdPoint);
          //   this.setState({
          //     activeCode: k,
          //   });
          // }

          marker.addEventListener('rightclick', function (e) {
            if (label) {
              that.myCircle(e, marker, label.marker_color)
            } else {
              that.myCircle(e, marker)
            }
            that.setState({bdPoint})
          });


          marker.addEventListener('click', function () {
            this.map.openInfoWindow(infoWindow, bdPoint);
          });

          this.map.addEventListener("zoomend", () => {
            this.setState({
              zoom: this.map.getZoom()
            })
            this.map.setCenter(bdPoint);
            this.map.setZoom(this.map.getZoom());
          })
          this.map.setCenter(bdPoint);
          this.map.setZoom(zoom);

        }
        codes.push(codeObj);
      }
      codeList = [{key: value.city + ':' + value.cityCi + ':' + value.cityMnc, list: codes, codeArr}, ...codeList]
      this.setState({
        codeList
      });
    });
  };


  async componentDidMount() {
    const map = document.querySelector('#baseMap');
    const header = document.querySelector('.ice-layout-header.ice-layout-header-normal.ice-design-layout-header');
    // map.style.minHeight = `${document.documentElement.offsetHeight - (header.offsetHeight + 20 + 102)}px`;
    map.style.height = `${document.documentElement.offsetHeight}px`;
    //  动态加载地图
    if (window.BMap) {
      this.renderMap();
    } else {
      installExternalLibs(document.body, this.renderMap);
    }
    if (this.props.route.location.search) {
      this.setData(this.props.route.location.search);
    }
    if (this.props.actions && this.props.actions.fetchLabelCells) {
      const ctLabel = await this.props.actions.fetchLabelCells({caseId: this.props.caseId});
      this.setState({
        ctLabel,
      });
    }
    this.getStateList();
  }


  getStateList = () => {
    ajaxs.get('/utils/provinces').then(res => {
      if (res.meta.success) {
        let arr = res.data[0];
        let stateData = [];
        let obj = {};
        for (let key in arr) {
          obj = {
            label: key,
            value: arr[key],
            code: arr[key]
          }
          stateData.push(obj)
        }
        this.setState({stateData})
      }
    })
  };

  getCityList = (code) => {
    let city = null;
    this.state.stateData.forEach(item => {
      if (item.code == code) {
        if (item.label.indexOf('市') !== -1) {
          city = item.label
        }
      }
    });

    ajaxs.get('/utils/provinces/' + code + '/cities').then(res => {
      if (res.meta.success) {
        const {value1} = this.state;
        let arr = res.data[0]
        let cityData = [];
        let obj = {};
        for (let key in arr) {
          obj = {
            label: key,
            value: city ? city : key,
          };
          cityData.push(obj)
        }
        this.field.setValue('city', cityData[0].value);
        this.setState({cityData})
      }
    })
  };

  async setData(search) {
    const params = await getUrlRequest(search);
    this.field.setValues({
      tac: params.owner_lac,
      lac: parseInt(params.owner_lac, 16),
      ci2: params.owner_ci,
      ci: parseInt(params.owner_ci, 16),
    });
    this.setState({
      inputValue: params.owner_mnc,
      inputDECValue: parseInt(params.owner_mnc, 16)
    });
  }

  handleSubmit(value) {
    const {radio} = this.state;
    if (radio === '1') {
      if (!value.codes) return;
      let codes = value.codes;
      codes = codes.split(/[\r\n]/);
      for (let i = 0; i < codes.length; i++) {
        if (codes[i] === "") {
          codes.splice(i--, 1)
        } else {
          const code = codes[i].replace(/\s+/g, '');
          codes[i] = code;
        }
      }
      this.fetchMultiple(codes);
    } else if (radio === '2') {
      if (value.city && (value.cityMnc || value.cityMnc == 0) && (value.cityMnc !== "") && (value.cityCi || value.cityCi == 0) && (value.cityCi !== "")) {
        this.getLocCityCi(value)
      }
    } else if (value.mnc !== null && value.lac && value.ci) {
      console.log(value);
      this.fetchData(value);
    }
  }

  onChange(value) {
    this.setState({
      radio: value,
      binaryType: '1'
    });
  }

  onBinaryTypeChange = (value) => {
    this.setState({
      binaryType: value,
    });
  }

  onRadio2Change(value) {
    this.setState({
      radio2: value,
    }, callback => {
      if (value === '0') {
        this.setState({inputValue: 0x00, inputDECValue: 0x00});
      } else if (value === '1') {
        this.setState({inputValue: 0x01, inputDECValue: 0x01});
      } else if (value === '2') {
        this.setState({inputValue: parseInt(11, 0).toString(16).toUpperCase(), inputDECValue: 11});
      } else {
        this.setState({inputValue: '', inputDECValue: ''});
      }
    });
  }

  onRadio1Change(value) {
    this.setState({
      radio1: value,
    });
  }

  clearMap() {
    console.log(this.state.cityList);
    this.map.clearOverlays();
    this.setState({
      activeCode: null,
    });
  }


  lacOnChange(value) {
    // if (/^[1-9]\d*$/.test(value)) {
    //   this.setState({lacvalue: value})
    // } else {
    //   this.setState({lacvalue: ''})
    // }
  }

  tacOnChange(value) {
    // if (/^[a-fA-F0-9]+$/.test(value)) {
    //   this.setState({tacvalue: value})
    // } else {
    //   this.setState({tacvalue: ''})
    // }
  }

  onSidDECChange = (val) => {
    if (val) {
      this.setState({
        inputDECValue: val,
        inputValue: parseInt(val, 0).toString(16).toUpperCase()
      })
    } else {
      this.setState({
        inputDECValue: '',
        inputValue: ''
      })
    }
  }

  onSidHEXChange = (val) => {
    if (val) {
      this.setState({
        inputDECValue: parseInt(val, 16),
        inputValue: val
      })
    } else {
      this.setState({
        inputDECValue: '',
        inputValue: ''
      })
    }
  }

  render() {
    const {radio, ctLabel, codeList, activeCode, radio2, codeMultipleList, binaryType, cityList} = this.state;
    const {init, getValue} = this.field;
    return (
      <div className="bs-box">

        <div className="bs-map" style={{position: 'relative'}}>
          <div id="baseMap"/>
          <div style={styles.zoom}>当前等级:{this.state.currentZoom}</div>
          {/*<div style={{position: 'absolute', top: '55px', right: '7px'}} onClick={this.measuring}>测量</div>*/}
          {/*<div style={{*/}
          {/*position: 'absolute',*/}
          {/*top: '80px',*/}
          {/*right: '7px',*/}
          {/*width: '100px',*/}
          {/*height: '40px',*/}
          {/*display: 'flex',*/}
          {/*border: '1px solid',*/}
          {/*backgroundColor: '#fff',*/}
          {/*justifyContent:'center'*/}
          {/*}}>*/}
          {/*<div><FontAwesomeIcon icon={faCircle} style={{*/}
          {/*color: '#5584FF',*/}
          {/*width: '30px',*/}
          {/*height: '30px'*/}
          {/*}}/></div>*/}
          {/*<div><FontAwesomeIcon icon={faRuler} style={{*/}
          {/*color: '#5584FF',*/}
          {/*width: '30px',*/}
          {/*height: '30px'*/}
          {/*}}/></div>*/}
          {/*</div>*/}
          <div style={styles.box}>
            <div style={styles.img1} onClick={this.Circle}></div>
            <div style={styles.img2} onClick={this.measuring}></div>
            <div style={styles.img3} onClick={this.marker}></div>
          </div>
        </div>
        <div className="bs-list">
          <Row gutter="4" style={{marginBottom: '16px'}}>
            <Col>
              <Radio.Group name="radio" value={radio} onChange={this.onChange}>
                <Radio value="0">经典输入</Radio>
                <Radio value="2">城市基站</Radio>
                <Radio value="1">粘贴识别</Radio>
              </Radio.Group>
            </Col>
          </Row>
          {radio === '0' || radio === '2' ? <Row gutter="4" style={{marginBottom: '16px'}}>
            <Col>
              <Radio.Group name="radio2" value={radio2} onChange={this.onRadio2Change}>
                <Radio value="0">移动</Radio>
                <Radio value="1">联通</Radio>
                <Radio value="2">电信</Radio>
                <Radio value="3">CDMA</Radio>
              </Radio.Group>
            </Col>
          </Row> : ''}

          {/* <Row gutter="4" style={{marginBottom: '16px'}}> */}
          {/* <Col> */}
          {/* <Radio.Group name="radio1" value={radio1} onChange={this.onRadio1Change}> */}
          {/* <Radio value="0">GSM / UMTS / LTE</Radio> */}
          {/* <Radio value="1">CDMA</Radio> */}
          {/* </Radio.Group> */}
          {/* </Col> */}
          {/* </Row> */}
          <Form field={this.field} style={{height: '100%'}}>
            {/*{*/}
            {/*radio === '0' ? (*/}
            {/*<Fragment>*/}
            {/*<Row gutter="4">*/}
            {/*<Col l={24}>*/}
            {/*{*/}
            {/*radio2 === '3' ? <FormItem {...formItemLayout}*/}
            {/*labelAlign={labelAlign}*/}
            {/*label={this.state.radio2 === '3' ? SIDSpan : MNCSpan}*/}
            {/*>*/}
            {/*<Input name="mnc2"*/}
            {/*addonTextAfter="DEC"*/}
            {/*style={{ marginTop: '10px' }}*/}
            {/*οninput={"value=value.replace(/[^\d]/g,'')"}*/}
            {/*value={this.state.inputDECValue}*/}
            {/*onChange={this.onSidDECChange}*/}
            {/*/>*/}
            {/*<Input name="mnc"*/}
            {/*style={{ background: '#f5f5f5', marginTop: '10px' }}*/}
            {/*value={this.state.inputValue}*/}
            {/*addonTextAfter="HEX"*/}
            {/*onChange={this.onSidHEXChange}*/}
            {/*/>*/}
            {/*</FormItem>*/}
            {/*:*/}
            {/*<FormItem {...formItemLayout}*/}
            {/*labelAlign={labelAlign}*/}
            {/*label={this.state.radio2 === '3' ? SIDSpan : MNCSpan}*/}
            {/*>*/}
            {/*<Input addonTextAfter="DEC" style={{ marginTop: '10px' }} value={this.state.inputDECValue} />*/}
            {/*<Input name="mnc" style={{ marginTop: '10px' }} value={this.state.inputValue} addonTextAfter="HEX"  />*/}
            {/*</FormItem>*/}
            {/*}*/}
            {/*</Col>*/}
            {/*</Row>*/}
            {/*<Row gutter="4">*/}
            {/*<Col l={24}>*/}
            {/*<FormItem {...formItemLayout}*/}
            {/*labelAlign={labelAlign}*/}
            {/*label={this.state.radio2 === '3' ? NIDSpan : LACSpan}*/}
            {/*>*/}
            {/*<Input name="lac" addonTextAfter="DEC" style={{ marginTop: '10px' }} />*/}
            {/*<Input name="tac" style={{ background: '#f5f5f5', marginTop: '10px' }} addonTextAfter="HEX" />*/}
            {/*</FormItem>*/}
            {/*</Col>*/}
            {/*</Row>*/}
            {/*<Row gutter="4">*/}
            {/*<Col l={24}>*/}
            {/*<FormItem {...formItemLayout}*/}
            {/*labelAlign={labelAlign}*/}
            {/*label={this.state.radio2 === '3' ? BIDSpan : CISpan}*/}
            {/*>*/}
            {/*<Input name="ci" addonTextAfter="DEC" style={{ marginTop: '10px' }} />*/}
            {/*<Input name="ci2" style={{ background: '#f5f5f5', marginTop: '10px' }} addonTextAfter="HEX" />*/}
            {/*</FormItem>*/}
            {/*</Col>*/}
            {/*</Row>*/}
            {/*</Fragment>*/}
            {/*) : (*/}
            {/*<Row gutter="4">*/}
            {/*<Col l={24}>*/}
            {/*<FormItem {...formItemLayout} labelAlign={labelAlign} label={labelSpan} labelTextAlign="left">*/}
            {/*/!*<Radio.Group value={binaryType} onChange={this.onBinaryTypeChange}>*!/*/}
            {/*/!*<Radio value="0">10进制</Radio>*!/*/}
            {/*/!*<Radio value="1">16进制</Radio>*!/*/}
            {/*/!*</Radio.Group>*!/*/}
            {/*<Input.TextArea*/}
            {/*name="codes"*/}
            {/*placeholder=""*/}
            {/*// maxLength={5000}*/}
            {/*rows={15}*/}
            {/*// hasLimitHint*/}
            {/*aria-label="input max length 5000"*/}
            {/*/>*/}
            {/*</FormItem>*/}
            {/*</Col>*/}
            {/*</Row>*/}
            {/*)*/}
            {/*}*/}

            {
              radio === '0' ? (
                <Fragment>
                  <Row gutter="4">
                    <Col l={24}>
                      {
                        radio2 === '3' ? <FormItem {...formItemLayout}
                                                   labelAlign={labelAlign}
                                                   label={this.state.radio2 === '3' ? SIDSpan : MNCSpan}
                          >
                            <Input name="mnc2"
                                   addonTextAfter="10进制"
                                   style={{marginTop: '10px'}}
                                   οninput={"value=value.replace(/[^\d]/g,'')"}
                                   value={this.state.inputDECValue}
                                   onChange={this.onSidDECChange}
                            />
                            <Input name="mnc"
                                   style={{background: '#f5f5f5', marginTop: '10px'}}
                                   value={this.state.inputValue}
                                   addonTextAfter="16进制"
                                   onChange={this.onSidHEXChange}
                            />
                          </FormItem>
                          :
                          <FormItem {...formItemLayout}
                                    labelAlign={labelAlign}
                                    label={this.state.radio2 === '3' ? SIDSpan : MNCSpan}
                          >
                            <Input addonTextAfter="10进制" style={{marginTop: '10px'}} value={this.state.inputDECValue}/>
                            <Input name="mnc" style={{marginTop: '10px'}} value={this.state.inputValue}
                                   addonTextAfter="16进制"/>
                          </FormItem>
                      }
                    </Col>
                  </Row>
                  <Row gutter="4">
                    <Col l={24}>
                      <FormItem {...formItemLayout}
                                labelAlign={labelAlign}
                                label={this.state.radio2 === '3' ? NIDSpan : LACSpan}
                      >
                        <Input name="lac" addonTextAfter="10进制" style={{marginTop: '10px'}}/>
                        <Input name="tac" style={{background: '#f5f5f5', marginTop: '10px'}} addonTextAfter="16进制"/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter="4">
                    <Col l={24}>
                      <FormItem {...formItemLayout}
                                labelAlign={labelAlign}
                                label={this.state.radio2 === '3' ? BIDSpan : CISpan}
                      >
                        <Input name="ci" addonTextAfter="10进制" style={{marginTop: '10px'}}/>
                        <Input name="ci2" style={{background: '#f5f5f5', marginTop: '10px'}} addonTextAfter="16进制"/>
                      </FormItem>
                    </Col>
                  </Row>
                </Fragment>
              ) : ''
            }
            {
              radio === '1' ? (
                <Row gutter="4">
                  <Col l={24}>
                    <FormItem {...formItemLayout} labelAlign={labelAlign} label={labelSpan} labelTextAlign="left">
                      <Radio.Group value={binaryType} onChange={this.onBinaryTypeChange}>
                        <Radio value="0">10进制</Radio>
                        <Radio value="1">16进制</Radio>
                      </Radio.Group>
                      <Input.TextArea
                        name="codes"
                        placeholder=""
                        // maxLength={5000}
                        rows={15}
                        // hasLimitHint
                        aria-label="input max length 5000"
                      />
                    </FormItem>
                  </Col>
                </Row>
              ) : ''
            }
            {
              radio === '2' ? (
                <Fragment>
                  <Row gutter="4">
                    <Col l={24}>
                      <FormItem {...formItemLayout}
                                labelAlign={labelAlign}
                                label={stateSpan}
                      >
                        <Select
                          placeholder="省"
                          dataSource={this.state.stateData}
                          // onChange={this.handleStateChange}
                          style={{width: '48%'}}
                          // name='state'
                          {...init('state')}
                        />
                        <Select
                          placeholder="市"
                          dataSource={this.state.cityData}
                          style={{width: '48%', marginLeft: '2%'}}
                          name='city'
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter="4">
                    <Col l={24}>
                      {
                        radio2 !== '3' ? <FormItem {...formItemLayout}
                                                   labelAlign={labelAlign}
                                                   label={this.state.radio2 === '3' ? SIDSpan : MNCSpan}
                          >
                            <Input name="cityMnc"
                                   addonTextAfter="10进制"
                                   style={{marginTop: '10px'}}
                                   οninput={"value=value.replace(/[^\d]/g,'')"}
                                   value={this.state.inputDECValue}
                              // onChange={this.onSidDECChange}
                            />
                            <Input name="cityMncHex"
                                   style={{background: '#f5f5f5', marginTop: '10px'}}
                                   value={this.state.inputValue}
                                   addonTextAfter="16进制"
                              // onChange={this.onSidHEXChange}
                            />
                          </FormItem>
                          :
                          <FormItem {...formItemLayout}
                                    labelAlign={labelAlign}
                                    label={this.state.radio2 === '3' ? SIDSpan : MNCSpan}
                          >
                            <Input name='cityMnc' addonTextAfter="10进制" style={{marginTop: '10px'}}/>
                            <Input name="cityMncHex" style={{marginTop: '10px'}} addonTextAfter="16进制"/>
                          </FormItem>
                      }
                    </Col>
                  </Row>
                  <Row gutter="4">
                    <Col l={24}>
                      <FormItem {...formItemLayout}
                                labelAlign={labelAlign}
                                label={this.state.radio2 === '3' ? BIDSpan : CISpan}
                      >
                        <Input name="cityCi" addonTextAfter="10进制" style={{marginTop: '10px'}}/>
                        <Input name="cityCiHEX" style={{background: '#f5f5f5', marginTop: '10px'}}
                               addonTextAfter="16进制"/>
                      </FormItem>
                    </Col>
                  </Row>
                </Fragment>
              ) : ''
            }


            <Row justify="center">
              <Col span={6} style={{marginTop: '20px'}}>
                <Form.Submit type="primary" onClick={this.handleSubmit.bind(this)}>查询</Form.Submit>
              </Col>
              <Col span={6} style={{marginTop: '20px', marginLeft: '10px'}}>
                <Button type="secondary" onClick={this.clearMap}>清空</Button>
              </Col>
            </Row>
            <Row style={{height: '200px', overflowY: 'auto'}}>
              <Col span={24} style={{marginTop: '20px'}}>
                <ul>
                  {
                    codeList.map((item, index) => {
                      if (item.key) {
                        return (
                          <li className="codeList"
                              style={{color: activeCode === item.code ? 'null' : null, color: item.color}}
                              key={item.key + index}
                              onClick={() => {
                                this.fetchMultiple(item.codeArr, true, item.key);
                              }}
                          >
                            <span style={{color: item.codeArr.length > 0 ? null : '#ccc'}}>{item.key}</span>
                          </li>
                        );
                      } else {
                        return (
                          <li className="codeList"
                              style={{color: activeCode === item.code ? 'null' : null, color: item.color}}
                              key={item.code + index}
                              onClick={() => {
                                this.fetchData(item.code, true, false)
                              }}
                          >
                            <span>{item.code}</span>
                            <span><FontAwesomeIcon icon={faMapMarkerAlt} style={{color: item.color}}/></span>
                          </li>
                        );
                      }
                    })
                  }
                </ul>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const styles = {
  img1: {
    borderRight: '1px solid #d2d2d2',
    float: 'left',
    height: '100%',
    width: '57px',
    // backgroundImage: 'url(http://api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png)',
    background: 'url(http://api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png) no-repeat -113px -3px',
    cursor: 'pointer',
    backgroundSize: '340px'
  },
  img2: {
    borderRight: '1px solid #d2d2d2',
    float: 'left',
    height: '100%',
    width: '57px',
    // backgroundImage: 'url(http://api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png)',
    background: 'url(http://api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png) no-repeat -169px -3px',
    cursor: 'pointer',
    backgroundSize: '340px'
  },
  img3: {
    borderRight: '1px solid #d2d2d2',
    float: 'left',
    height: '100%',
    width: '57px',
    // backgroundImage: 'url(http://api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png)',
    background: 'url(http://api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png) no-repeat -56px -3px',
    cursor: 'pointer',
    backgroundSize: '340px'
  },
  box: {
    position: 'absolute',
    top: '9px',
    right: '40px',
    height: '36px',
    // width: '173px',
    border: '1px solid #ccc',
    display: 'flex'
  },
  zoom: {
    position: 'absolute',
    top: '12px',
    left: '54px',
    backgroundColor: '#fff'
  }
};


const formItemLayout = {
  labelCol: {fixedSpan: 4},
};
const labelAlign = 'top';

export default connect(
  state => ({
    bsSearchs: state.bsSearchs,
    caseId: state.cases.case.id,
    route: state.route,
    labelCells: state.labelCells,
    login: state.login
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...bsActions, ...labelCellActions}, dispatch),
  }),
)(BSMap);
