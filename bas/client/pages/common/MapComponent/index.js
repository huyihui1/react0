import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Message} from '@alifd/next';
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import {actions as bsActions} from '../../../stores/bsSearch/index';
import {installExternalLibs} from '../../../utils/utils';
import {actions as labelCellActions} from '../../../stores/labelCell';

import {isCellTowerCode} from '../../../gEvents';
import { coordOffsetDecrypt } from '../../../utils/basCoord';

class MapComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ctLabel: null,
      code: null,
      ready: false
    }
    this.fetchData = this.fetchData.bind(this);
    this.fetchMultData = this.fetchMultData.bind(this);
    this.renderMap = this.renderMap.bind(this);
    // this.addArrow = this.addArrow.bind(this)
  }

  componentDidMount() {
    if (this.props.code && Array.isArray(this.props.code)) {
      this.fetchMultData(this.props.code)
      this.setState({
        code: this.props.code
      }, () => {
        if (window.BMap) {
          this.renderMap()
        } else {
          installExternalLibs(document.body, this.renderMap);
        }
      })
    } else if (this.props.code && isCellTowerCode(this.props.code)) {
      this.fetchData(this.props.code, true)
      this.setState({
        code: this.props.code
      }, () => {
        if (window.BMap) {
          this.renderMap()
        } else {
          installExternalLibs(document.body, this.renderMap);
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.code && isCellTowerCode(nextProps.code) && nextProps.code !== this.state.code) {
    //   this.fetchData(nextProps.code, true)
    //   this.setState({
    //     code: nextProps.code
    //   })
    // }

    if (nextProps.ctLabel) {
      this.setState({
        ctLabel: nextProps.ctLabel
      })
    }
  }


  // addArrow(polyline, length, angleValue) { //绘制箭头的函数
  //   let linePoint = polyline.getPath();//线的坐标串
  //   let arrowCount = linePoint.length;
  //   for (let i = 1; i < arrowCount; i++) { //在拐点处绘制箭头
  //     let pixelStart = this.map.pointToPixel(linePoint[i - 1]);
  //     let pixelEnd = this.map.pointToPixel(linePoint[i]);
  //
  //     let angle = angleValue;//箭头和主线的夹角
  //     let r = length; // r/Math.sin(angle)代表箭头长度
  //     let delta = 0; //主线斜率，垂直时无斜率
  //     let param = 0; //代码简洁考虑
  //     let pixelTemX, pixelTemY;//临时点坐标
  //     let pixelX, pixelY, pixelX1, pixelY1;//箭头两个点
  //     if (pixelEnd.x - pixelStart.x == 0) { //斜率不存在是时
  //       pixelTemX = pixelEnd.x;
  //       if (pixelEnd.y > pixelStart.y) {
  //         pixelTemY = pixelEnd.y - r;
  //       } else {
  //         pixelTemY = pixelEnd.y + r;
  //       }
  //       //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
  //       pixelX = pixelTemX - r * Math.tan(angle);
  //       pixelX1 = pixelTemX + r * Math.tan(angle);
  //       pixelY = pixelY1 = pixelTemY;
  //     } else  //斜率存在时
  //     {
  //       delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
  //       param = Math.sqrt(delta * delta + 1);
  //
  //       if ((pixelEnd.x - pixelStart.x) < 0) //第二、三象限
  //       {
  //         pixelTemX = pixelEnd.x + r / param;
  //         pixelTemY = pixelEnd.y + delta * r / param;
  //       } else//第一、四象限
  //       {
  //         pixelTemX = pixelEnd.x - r / param;
  //         pixelTemY = pixelEnd.y - delta * r / param;
  //       }
  //       //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
  //       pixelX = pixelTemX + Math.tan(angle) * r * delta / param;
  //       pixelY = pixelTemY - Math.tan(angle) * r / param;
  //
  //       pixelX1 = pixelTemX - Math.tan(angle) * r * delta / param;
  //       pixelY1 = pixelTemY + Math.tan(angle) * r / param;
  //     }
  //
  //     let pointArrow = this.map.pixelToPoint(new BMap.Pixel(pixelX, pixelY));
  //     let pointArrow1 = this.map.pixelToPoint(new BMap.Pixel(pixelX1, pixelY1));
  //     let Arrow = new BMap.Polyline([
  //       pointArrow,
  //       linePoint[i],
  //       pointArrow1
  //     ], {strokeColor: "blue", strokeWeight: 3, strokeOpacity: 0.5});
  //     this.map.addOverlay(Arrow);
  //   }
  // }


  renderMap(x = 116.404, y = 39.915) {
    const top_right_navigation = new window.BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_RIGHT,
      type: BMAP_NAVIGATION_CONTROL_ZOOM
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
    this.map = new window.BMap.Map(Array.isArray(this.state.code) ? this.state.code[0] + this.state.code[1] : this.state.code);
    this.map.addControl(mapType1);
    this.map.addControl(top_right_navigation);
    this.map.centerAndZoom(ggPoint, 10);
    // this.map.enableScrollWheelZoom(true); // 允许鼠标缩放
    const myCity = new window.BMap.LocalCity();
    // myCity.get((result) => {
    //   this.map.setCenter(result.name);
    // });
  }

  fetchData(values, bool = false) {
    const {fetchBsSearchs} = this.props.actions;
    const {ctLabel} = this.props;
    const that = this;
    let ctCode = null;
    if (bool) {
      ctCode = values;
    } else {
      let {mnc, tac, ci2} = values;
      if (typeof tac === 'object') {
        tac = [tac[0]];
      }
      if (typeof ci2 === 'object') {
        ci2 = [ci2[0]];
      }
      ctCode = `${tac}:${ci2}:${mnc[0]}`;
    }

    fetchBsSearchs({case_id: this.props.caseId, ct_codes: [ctCode], coord: '2', fmt: '16'}).then(async res => {
      const {body} = res;
      if (body.data[ctCode].length > 0) {
        let pointStyle = {};
        let label = null;
        if (ctLabel) {
          ctLabel.forEach(item => {
            if (item.ct_code === ctCode) {
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
        this.map.clearOverlays();
        // const circle = new window.BMap.Circle(data.points[0], bsSearchs.items.radius, { strokeColor: 'red', strokeWeight: 2, fillColor: 'red', fillOpacity: 0.1 });
        // this.map.addOverlay(polyline);
        // this.map.addOverlay(circle);
        const marker = new window.BMap.Marker(bdPoint, pointStyle);
        this.map.addOverlay(marker);
        const infoWindow = new window.BMap.InfoWindow(sContent, {
          offset: new window.BMap.Size(0, -15),
        });
        this.map.openInfoWindow(infoWindow, bdPoint);
        marker.addEventListener('click', function () {
          this.map.openInfoWindow(infoWindow, bdPoint);
        });
        this.map.setCenter(bdPoint);
        this.map.setZoom(18);
        this.setState({
          ready: true
        })
      } else {
        Message.warning('未查询到基站.');
      }
    });
  }

  fetchMultData(values) {
    const {fetchBsSearchs} = this.props.actions;
    const {ctLabel, cellData} = this.props;
    let ctCode = values;


    fetchBsSearchs({case_id: this.props.caseId, ct_codes: ctCode, coord: '2', fmt: '16'}).then(async res => {
      const {body} = res;
      const points = []
      if (body.data.glat) {
        const ggPoint = new window.BMap.Point(body.data.glng * 1, body.data.glat * 1);
        const convertor = new window.BMap.Convertor();
        const pointArr = [];
        pointArr.push(ggPoint);
        convertor.translate(pointArr, 3, 5, this.translateCallback);
      } else {
        for (const k in body.data) {
          if (body.data[k].length > 0) {
            let pointStyle = {
              // 指定Marker的icon属性为Symbol
              icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                scale: 1, // 图标缩放大小
                fillColor: k === ctCode[0] ? 'red' : 'green', // 填充颜色
                fillOpacity: 0.8, // 填充透明度
              }),
            };
            let label = null;
            if (ctLabel) {
              ctLabel.forEach((item, index) => {
                if (item.ct_code === k) {
                  label = item;
                  // pointStyle = {
                  //   // 指定Marker的icon属性为Symbol
                  //   icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                  //     scale: 1, // 图标缩放大小
                  //     fillColor: item.marker_color, // 填充颜色
                  //     fillOpacity: 0.8, // 填充透明度
                  //   }),
                  // };
                }
              });
            }
            let p = coordOffsetDecrypt(body.data[k][0][0] * 1, body.data[k][0][1] * 1);
            const bdPoint = new window.BMap.Point(p[0] * 1, p[1] * 1);
            points.push(bdPoint)
            const sContent = `<div>
          <h3 style="margin-bottom: 5px">
            标注: <span style="font-size: '16px'; background: ${label && label.marker_color}; color: #fff; padding: 2px">${label && label.label}</span>
          </h3>
          <p style="font-size: 14px; margin-top: 0">
                <span style="font-size: 16px">基站:</span> ${k} <FontAwesomeIcon icon={faExchangeAlt} style="margin-left: 8px" /> ${`${parseInt(k.split(':')[0], 16)}:${parseInt(k.split(':')[1], 16)}:${parseInt(k.split(':')[2])}`}
          </p>
          <h3 style="font-size: 14px">${body.data[k][1].address}</h3>
        </div>`;
            const marker = new window.BMap.Marker(bdPoint, pointStyle);
            this.map.addOverlay(marker);
            const infoWindow = new window.BMap.InfoWindow(sContent);
            marker.addEventListener('click', function () {
              this.map.openInfoWindow(infoWindow, bdPoint);
            });
          }
        }



        // let arr = [];
        // let polylinea = {};
        // for (let key in body.data) {
        //   arr.push(body.data[key][0]);
        // }
        //
        // if (cellData === '主叫') {
        //   polylinea = new BMap.Polyline([
        //     new BMap.Point(arr[0][0], arr[0][1]),
        //     new BMap.Point(arr[1][0], arr[1][1]),
        //   ], {strokeColor: "blue", strokeWeight: 0.1, strokeOpacity: 0.1});
        // } else {
        //   polylinea = new BMap.Polyline([
        //     new BMap.Point(arr[1][0], arr[1][1]),
        //     new BMap.Point(arr[0][0], arr[0][1]),
        //   ], {strokeColor: "blue", strokeWeight: 0.1, strokeOpacity: 0.1});
        // }
        // this.map.addOverlay(polylinea);
        // this.addArrow(polylinea, 5, Math.PI / 7);


        const curve = new window.BMapLib.CurveLine(points, {strokeColor: "blue", strokeWeight: 3, strokeOpacity: 0.5}); //创建弧线对象
        this.map.addOverlay(curve)
        this.map.setViewport(points);
        this.setState({
          ready: true
        })
      }
    });
  }

  render() {
    const {code} = this.state
    return (
      <Fragment>
        <div id="mapComponentBox" style={{height: '100%', position: 'relative'}}>
          <div id={Array.isArray(code) ? code[0] + code[1] : code} style={{height: '100%'}}>

          </div>
          <ReactPlaceholder type='text' ready={this.state.ready} type='rect' color='#E0E0E0'
                            style={{height: '100%', position: 'absolute', top: 0, left: 0}}>
            <div style={{height: '100%'}}></div>
          </ReactPlaceholder>
        </div>
      </Fragment>
    )
  }
}


export default connect(
  state => ({
    bsSearchs: state.bsSearchs,
    caseId: state.cases.case.id,
    route: state.route,
    labelCells: state.labelCells,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...bsActions, ...labelCellActions}, dispatch),
  }),
)(MapComponent);
