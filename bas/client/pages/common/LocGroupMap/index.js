import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Message} from '@alifd/next';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import {actions as bsActions} from '../../../stores/bsSearch/index';
import {installExternalLibs} from '../../../utils/utils';
import {actions as labelCellActions} from '../../../stores/labelCell';

import {isCellTowerCode} from '../../../gEvents';
import {coordOffsetDecrypt} from '../../../utils/basCoord';
import appConfig from '../../../appConfig';

class BatchMapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctLabel: null,
      code: null,
      ready: false,
      markersArr: []
    };
    this.fetchMultData = this.fetchMultData.bind(this);
    this.renderMap = this.renderMap.bind(this);
    // this.addArrow = this.addArrow.bind(this)
  }

  componentDidMount() {
    if (this.props.code && Array.isArray(this.props.code)) {
      this.fetchMultData(this.props.code);
      this.setState({
        code: this.props.code,
      }, () => {
        if (window.BMap) {
          this.renderMap();
        } else {
          installExternalLibs(document.body, this.renderMap);
        }
      });
    }

    this.props.getChildrenThis && this.props.getChildrenThis(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ctLabel) {
      this.setState({
        ctLabel: nextProps.ctLabel,
      });
    }
  }

  setHighlight = (value) => {
    this.state.markersArr.forEach(item => {
      item.marker.setIcon(new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
        scale: 1, // 图标缩放大小
        fillColor: 'red', // 填充颜色
        fillOpacity: 0.8, // 填充透明度
      }));

      if (item.code === value) {
        item.marker.setIcon(new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
          scale: 1.4, // 图标缩放大小
          fillColor: 'green', // 填充颜色
          fillOpacity: 0.8, // 填充透明度
        }))

        this.map.openInfoWindow(item.infoWindow, item.bdPoint)
      }
    });
  };

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
    this.map = new window.BMap.Map(this.props.id);
    this.map.addControl(mapType1);
    this.map.addControl(top_right_navigation);
    this.map.centerAndZoom(ggPoint, 10);
    // this.map.enableScrollWheelZoom(true); // 允许鼠标缩放
    const myCity = new window.BMap.LocalCity();
    // myCity.get((result) => {
    //   this.map.setCenter(result.name);
    // });
  }


  fetchMultData(values) {
    const {fetchBsSearchs} = this.props.actions;
    const {ctLabel, cellData, activeCode, clickMarker, isBool} = this.props;
    const ctCode = values;

    fetchBsSearchs({case_id: this.props.caseId, ct_codes: ctCode, coord: '2', fmt: '16'}).then(async res => {
      const {body} = res;
      const points = [];
      const markers = [];
      const markersArr = [];

      for (const k in body.data) {
        if (body.data[k].length > 0) {
          let pointStyle = {
            // 指定Marker的icon属性为Symbol
            icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
              scale: activeCode === k ? 1.4 : 1, // 图标缩放大小
              fillColor: activeCode === k ? 'green' : 'red', // 填充颜色
              fillOpacity: 0.8, // 填充透明度
            }),
          };
          let label = null;
          if (ctLabel) {
            ctLabel.forEach((item, index) => {
              if (item.ct_code === k) {
                label = item;
                pointStyle = {
                  // 指定Marker的icon属性为Symbol
                  icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                    scale: activeCode === k ? 1.4 : 1, // 图标缩放大小
                    fillColor: item.marker_color, // 填充颜色
                    fillOpacity: 0.8, // 填充透明度
                  }),
                };
              }
            });
          }
          const p = coordOffsetDecrypt(body.data[k][0][0] * 1, body.data[k][0][1] * 1);
          const bdPoint = new window.BMap.Point(p[0] * 1, p[1] * 1);
          points.push(bdPoint);
          const labelDom = `<h3 style="margin-bottom: 5px; font-size: 13px">
            标注: <span style="font-size: '16px'; background: ${label && label.marker_color}; color: #fff; padding: 2px">${label && label.label}</span>
          </h3>`;
          const sContent = `<div>
          ${label ? labelDom : ''}
          <p style="font-size: 13px; margin-top: 0; margin-bottom: 5px">
                <span style="font-size: 13px">基站:</span> ${k} <FontAwesomeIcon icon={faExchangeAlt} style="margin-left: 8px" /> ${`${parseInt(k.split(':')[0], 16)}:${parseInt(k.split(':')[1], 16)}:${parseInt(k.split(':')[2])}`}
          </p>
          <h3 style="font-size: 12px; margin: 0;">${body.data[k][1].address}</h3>
        </div>`;
          const marker = new window.BMap.Marker(bdPoint, pointStyle);
          markers.push(marker);
          this.map.addOverlay(marker);
          const infoWindow = new window.BMap.InfoWindow(sContent, {offset: new window.BMap.Size(0, -15)});
          const labelText = new window.BMap.Label(`${k}`, {offset: new window.BMap.Size(20, -10)});
          marker.setLabel(labelText);

          let obj = {
            code: k,
            marker: marker,
            infoWindow,
            bdPoint
          };
          markersArr.push(obj);

          marker.addEventListener('click', function () {
            this.map.openInfoWindow(infoWindow, bdPoint);
            clickMarker && clickMarker({code: k, isBool});
            markers.forEach(item => {
              item.setIcon(new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
                scale: 1, // 图标缩放大小
                fillColor: 'red', // 填充颜色
                fillOpacity: 0.8, // 填充透明度
              }))
            });

            marker.setIcon(new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
              scale: 1.4, // 图标缩放大小
              fillColor: 'green', // 填充颜色
              fillOpacity: 0.8, // 填充透明度
            }))
          });
        }
      }

      this.map.setViewport(points);
      this.setState({
        ready: true,
        markersArr
      });
    });
  }

  render() {
    const {code} = this.state;
    return (
      <Fragment>
        <div id="batchMapComponent" style={{height: '100%', position: 'relative'}}>
          <div id={this.props.id} style={this.props.styles || {...appConfig.locGroupMap}}/>
          <ReactPlaceholder type="text"
                            ready={this.state.ready}
                            type="rect"
                            color="#E0E0E0"
                            style={{height: '100%', position: 'absolute', top: 0, left: 0}}
          >
            <div style={{height: '100%'}}/>
          </ReactPlaceholder>
        </div>
      </Fragment>
    );
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
)(BatchMapComponent);
