import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Message} from '@alifd/next';
import ReactPlaceholder from 'react-placeholder';
import IceLabel from '@icedesign/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/index';

import "react-placeholder/lib/reactPlaceholder.css";
import {actions as bsActions} from '../../../stores/bsSearch/index';
import {installExternalLibs} from '../../../utils/utils';
import {actions as labelCellActions} from '../../../stores/labelCell';

import {isCellTowerCode} from '../../../gEvents';
import { coordOffsetDecrypt } from '../../../utils/basCoord';
import appConfig from '../../../appConfig';

class SingleLocMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ctLabel: null,
      code: null,
      ready: false,
      codeInfo: {}
    }
    this.fetchData = this.fetchData.bind(this);
    this.renderMap = this.renderMap.bind(this);
    // this.addArrow = this.addArrow.bind(this)
  }

  componentDidMount() {
    if (this.props.code && isCellTowerCode(this.props.code)) {
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
    if (nextProps.ctLabel) {
      this.setState({
        ctLabel: nextProps.ctLabel
      })
    }
  }

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
        // const infoWindow = new window.BMap.InfoWindow(sContent, {
        //   offset: new window.BMap.Size(0, -15),
        // });
        // this.map.openInfoWindow(infoWindow, bdPoint);
        // marker.addEventListener('click', function () {
        //   this.map.openInfoWindow(infoWindow, bdPoint);
        // });
        this.map.setCenter(bdPoint);
        this.map.setZoom(appConfig.mapZoom);
        this.setState({
          ready: true,
          codeInfo: {
            code: ctCode,
            isLabel: label,
            address: body.data[ctCode][1].address
          }
        })
      } else {
        Message.warning('未查询到基站.');
      }
    });
  }


  render() {
    const {code, codeInfo} = this.state;

    return (
      <Fragment>
        <div id="mapComponentBox" style={{position: 'relative'}}>
          <div>
            <p style={{ fontSize: '14px', marginBottom: '0', marginTop: 0 }}>
              <span style={{ fontSize: '16px' }}>基站:</span> <span>{codeInfo.code}</span> <FontAwesomeIcon icon={faExchangeAlt} style={{ marginLeft: '8px' }} /> <span>{codeInfo.code ? `${parseInt(codeInfo.code.split(':')[0], 16)}:${parseInt(codeInfo.code.split(':')[1], 16)}:${parseInt(codeInfo.code.split(':')[2], 16)}` : null}</span>
              {
                codeInfo.isLabel ? (
                  <span style={{ marginLeft: '10px' }}>
                    <span style={{fontSize: '16px'}}>标注:</span> <IceLabel inverse={false} style={{ fontSize: '16px', backgroundColor: codeInfo.isLabel.marker_color, color: '#fff', padding: '2px' }}>{codeInfo.isLabel.label}</IceLabel>
                  </span>
                ) : null
              }
            </p>
            <p style={{ minWidth: '240px', fontSize: '14px', marginTop: '10px' }}><span style={{ fontSize: '16px' }}>地址:</span> {codeInfo.address}</p>
            <div id={Array.isArray(code) ? code[0] + code[1] : code} style={{...appConfig.singleLocMap}} />
          </div>
          <ReactPlaceholder type='text' ready={this.state.ready} type='rect' color='#E0E0E0'
                            style={{ position: 'absolute', top: 0, left: 0}}>
            {
              this.state.ready ? <div></div> : <div style={{...appConfig.singleLocMap}}></div>
            }
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
)(SingleLocMap);
