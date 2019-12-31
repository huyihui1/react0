/**
 *  isHide 隐藏报表类型Input
 */
/* eslint-disable no-unused-vars */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Loading, Balloon } from '@alifd/next';
import { WindowScroller, AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import { MenuProvider, contextMenu } from 'react-contexify';
import IceLabel from '@icedesign/label';
import 'react-virtualized/styles.css';
import { PBAnalyzeReducer } from '../../../../stores/PBAnalyze/reducer';
import injectReducer from '../../../../utils/injectReducer';
import { installExternalLibs } from '../../../../utils/utils';
import PBTableMessage from '../../../common/PbTableMessage';

import './style.css';

import { getPBAnalyze, clearItems, searchPBAnalyze, searchCode, fetchLabelPNs } from '../../../../stores/PBAnalyze/actions';
import { toggleNav } from '../../../../stores/case/actions';
import ContextMenu from '../ContextMenu';
import ScrollTitle from './ScrollTitle';


const tableTitle = [
  {
    key: 'bill_type',
    label: '计费类型',
    width: 55,
  },
  {
    key: 'owner_num_status',
    label: '状态',
    width: 55,
  },
  {
    key: 'owner_comm_loc',
    label: '本方通话地',
    width: 55,
  },
  {
    key: 'owner_num',
    label: '本方号码',
    width: 150,
  },
  {
    key: 'owner_cname',
    label: '人员信息',
    width: 80,
  },
  {
    key: 'comm_direction',
    label: '联系类型',
    width: 50,
  },
  {
    key: 'peer_num',
    label: '对方号码',
    width: 150,
  },
  {
    key: 'peer_short_num',
    label: '短号',
    width: 70,
  },
  {
    key: 'peer_cname',
    label: '人员信息',
    width: 80,
  },
  {
    key: 'peer_num_attr',
    label: '归属地',
    width: 75,
  },
  {
    key: 'peer_comm_loc',
    label: '对方通话地',
    width: 55,
  },
  {
    key: 'long_dist',
    label: '长途',
    width: 50,
  },
  {
    key: 'ven',
    label: '虚拟',
    width: 50,
  },
  {
    key: 'started_day',
    label: '日期',
    width: 140,
  },
  {
    key: 'started_time',
    label: '时间',
    width: 60,
  },
  {
    key: 'started_time_l1_class',
    label: '时间类型',
    width: 50,
  },
  {
    key: 'weekday',
    label: '周几',
    width: 30,
  },
  {
    key: 'time_class',
    label: '时间性质',
    width: 50,
  },
  {
    key: 'duration',
    label: '时长分',
    width: 60,
  },
  {
    key: 'duration_class',
    label: '时长类别',
    width: 80,
  },
  // {
  //   key: 'cell_tower',
  //   label: '基站代码',
  //   width: 80,
  // },
  {
    key: 'owner_ct_code',
    label: '基站',
    width: 110,
  },
];

let oldCode = null;

class ConnectionsList extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      rowIndex: -2,
      rowSelection: [],
      activeIndex: -2,
      isScrollTitle: false,
      isRequest: true,
      criteria: {},
      codeInfo: '',
      selectionData: {},
      showTableMessage: false,
      labelPNs: [],
    };
    this.loc = null;
    this.attr = null;
    this.onRowMouseOver = this.onRowMouseOver.bind(this);
    this.rowClassName = this.rowClassName.bind(this);
    // this.cellRenderer = this.cellRenderer.bind(this);
    this.onColumnClick = this.onColumnClick.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.setRef = this.setRef.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.translateCallback = this.translateCallback.bind(this);
    this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.onRowRightClick = this.onRowRightClick.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.offSelectData = this.offSelectData.bind(this);
  }


  onRowMouseOver({ event, index, rowData }) {
    this.setState({
      rowIndex: index,
    });
  }

  rowClassName({ index }) {
    const { rowIndex, activeIndex } = this.state;
    if (index === rowIndex) {
      return 'oddRow';
    }
    // if (index === activeIndex) {
    //   return 'greenRow';
    // }
  }

  onRowClick({ index }) {
    this.setState({
      activeIndex: index,
    });
  }

  onRowRightClick({ event, index, rowData }) {
    console.log(rowData);
    this.rowData = rowData;
  }

  onColumnClick({ columnData, dataKey, event }) {

  }
  offSelectData() {
    this.setState({ selectionData: {}, showTableMessage: false });
  }
  onRowDoubleClick({ rowData }) {
    const selectionData = window.getSelection().toString();
    const t = {};
    if (rowData.owner_num === selectionData) {
      t.data = selectionData;
      t.selectData = { owner_num: rowData.owner_num };
      this.setState({
        selectionData: t,
        showTableMessage: true,
      });
    } else if (rowData.peer_num === selectionData) {
      t.data = selectionData;
      t.selectData = { peer_num: rowData.peer_num };
      this.setState({
        selectionData: t,
        showTableMessage: true,
      });
    }
  }

  async onVisibleChange(visible, code) {
    if (visible && code !== oldCode) {
      oldCode = code;
      const codeInfo = await searchCode(code, { fmt: 16 });
      this.setState({
        codeInfo,
      }, () => {
        if (window.BMap) {
          this.renderMap();
        } else {
          installExternalLibs(document.body, this.renderMap);
        }
      });
    } else if (visible) {
      if (window.BMap) {
        this.renderMap();
      } else {
        installExternalLibs(document.body, this.renderMap);
      }
    }
  }
  rowRenderer(data) {
    const { selectionData } = this.state;
    if (data.rowData.owner_num === selectionData.data || data.rowData.peer_num === selectionData.data) {
      data.style = { ...data.style, background: '#d2e3fd', borderBottom: '1px solid #cecaca' };
    }
    return defaultTableRowRenderer(data);
  }
  formatDataKey(arr, key, value) {
    let ownerCname = null;
    let peerCname = null;
    arr.forEach(item => {
      if (item[key] === value.owner_num) {
        ownerCname = { item, key: 'owner_cname' };
      } else if (item[key] === value.peer_num) {
        peerCname = { item, key: 'peer_cname' };
      }
    });
    if (ownerCname && peerCname) {
      return {ownerCname, peerCname};
    } else if (ownerCname) {
      return {ownerCname}
    } else if (peerCname) {
      return {peerCname}
    }
    return null
  }
  cellRenderer({ cellData, dataKey, rowData }) {
    if (dataKey === 'owner_cname' || dataKey === 'peer_cname') {
      const result = this.formatDataKey(this.state.labelPNs, 'num', rowData);
      if (result.ownerCname && result.ownerCname.key === dataKey) {
        return (
          <div title={result.ownerCname.item.label}>
            <IceLabel inverse={false} style={{ fontSize: '12px', backgroundColor: result.ownerCname.item.label_bg_color, color: result.ownerCname.item.label_txt_color, padding: '2px' }}>{result.ownerCname.item.label}</IceLabel>
          </div>
        )
      }
      if (result.peerCname && result.peerCname.key === dataKey) {
        return (
          <div title={result.peerCname.item.label}>
            <IceLabel inverse={false} style={{ fontSize: '12px', backgroundColor: result.peerCname.item.label_bg_color, color: result.peerCname.item.label_txt_color, padding: '2px' }}>{result.peerCname.item.label}</IceLabel>
          </div>
        )
      }
    }
    if (cellData === '主叫' && dataKey === 'comm_direction') {
      return <div style={{ color: '#f63' }}>{cellData}</div>;
    }
    if (dataKey === 'peer_comm_loc') {
      this.loc = cellData;
    }
    if (dataKey === 'peer_num_attr') {
      this.attr = cellData;
    }
    if (this.loc && this.attr) {
      if (this.attr.indexOf(this.loc) === -1 && dataKey === 'peer_comm_loc') {
        return <div style={{ color: '#f63' }}>{this.loc}</div>;
      }
    }
    if (dataKey === 'started_time_l1_class') {
      if (cellData === '傍晚' || cellData === '晚上') {
        return <div style={{ color: 'blue' }}>{cellData}</div>;
      }
      if (cellData === '深夜' || cellData === '凌晨') {
        return <div style={{ color: '#f33' }}>{cellData}</div>;
      }
    }
    if (dataKey === 'duration_class') {
      if (cellData === '5~10分' || cellData === '>10分') {
        return <div style={{ color: '#f33' }}>{cellData}</div>;
      }
    }
    if (dataKey === 'owner_num_status' && cellData === '漫游') {
      return <div style={{ color: 'blue' }}>{cellData}</div>;
    }
    if (dataKey === 'weekday' && cellData === '六' || dataKey === 'weekday' && cellData === '日') {
      return <div style={{ color: 'blue' }}>{cellData}</div>;
    }
    if (dataKey === 'owner_ct_code') {
      const { codeInfo } = this.state;
      return (
        <Balloon animation={false} align="l" trigger={<span>{cellData}</span>} triggerType="hover" onVisibleChange={(b) => { this.onVisibleChange(b, cellData); }}>
          <div>
            <h3 style={{ minWidth: '240px' }}>地址: {codeInfo.data && codeInfo.data.addr}</h3>
            <span>经纬度: ({(codeInfo.data && codeInfo.data.glat)}, {(codeInfo.data && codeInfo.data.glng)})</span>
            <div id="minMap" style={{ width: '100%', height: '300px' }} />
          </div>
        </Balloon>
      );
    }

    return cellData;

    // const { selectColumn: { data, key } } = this.state;
    // return data === `${cellData}` && key === dataKey ? <div style={{ background: '#fcef3c' }} title={cellData}>{cellData}</div> : cellData;
  }
  setRef(ref) {
    this.windowScroller = ref;
  }
  onScroll({ scrollTop }) {
    const bodyScrollHeight = document.body.scrollHeight;
    if (scrollTop > bodyScrollHeight / 2 && this.state.isRequest) {
      this.props.searchPBAnalyze(this.props.caseId, { ...this.props.criteria, id: ['>', this.props.PBAnalyzes.id] }, false).then(res => {
        if (res.data.length === 500) {
          this.setState({
            isRequest: true,
          });
        } else {
          this.setState({
            isRequest: false,
          });
        }
      });
      this.setState({
        isRequest: false,
      });
      console.log('继续请求数据');
    }
    if (scrollTop > 0 && this.props.PBAnalyze.length > 0) {
      this.setState({
        isScrollTitle: true,
      });
    } else {
      this.setState({
        isScrollTitle: false,
      });
    }
  }
  //  初始化百度地图
  renderMap() {
    const { codeInfo } = this.state;
    const top_right_navigation = new window.BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM });
    const mapType1 = new window.BMap.MapTypeControl(
      {
        mapTypes: [BMAP_NORMAL_MAP, ],
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
    const ggPoint = new window.BMap.Point(codeInfo.data.glng * 1, codeInfo.data.glat * 1);
    this.map = new window.BMap.Map('minMap');
    this.map.addControl(mapType1);
    this.map.addControl(top_right_navigation);
    this.map.centerAndZoom(ggPoint, 3);
    // this.map.enableScrollWheelZoom(true); // 允许鼠标缩放
    if (codeInfo.data.glat) {
      const convertor = new window.BMap.Convertor();
      const pointArr = [];
      pointArr.push(ggPoint);
      convertor.translate(pointArr, 3, 5, this.translateCallback);
    }
  }
  // 坐标转换完之后的回调函数
  translateCallback(data) {
    if (data.status === 0) {
      const { codeInfo } = this.state;
      const sContent = `<div>
        <h3>地址: ${codeInfo.data.addr}</h3>
        <span>(${(data.points[0].lat * 1)}, ${(data.points[0].lng * 1)})</span>
      </div>`;
      //  增加范围
      this.map.clearOverlays();
      // const circle = new window.BMap.Circle(data.points[0], bsSearchs.items.radius, { strokeColor: 'red', strokeWeight: 2, fillColor: 'red', fillOpacity: 0.1 });
      // this.map.addOverlay(polyline);
      // this.map.addOverlay(circle);
      const marker = new window.BMap.Marker(data.points[0]);
      this.map.addOverlay(marker);
      // const infoWindow = new window.BMap.InfoWindow(sContent);
      // marker.addEventListener('click', function () {
      //   this.openInfoWindow(infoWindow);
      // });
      this.map.setCenter(data.points[0]);
      this.map.centerAndZoom(data.points[0], 18);
    }
  }
  handleEvent(e) {
    e.preventDefault();
    contextMenu.show({
      id: 'menu_id',
      event: e,
      props: {
        rowData: this.rowData,
      },
    });
  }
  async componentDidMount() {
    // this.props.toggleNav();
    this.props.getWindowScroller(this.windowScroller);
    const res = await fetchLabelPNs(this.props.caseId);
    if (res) {
      this.setState({
        labelPNs: res.data,
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    this.windowScroller.updatePosition();
    if (nextProps.criteria && Object.keys(nextProps.criteria).length !== 0 && this.state.criteria !== nextProps.criteria) {
      this.props.searchPBAnalyze(nextProps.caseId, nextProps.criteria);
      this.setState({
        criteria: nextProps.criteria,
      });
    }
  }
  componentWillUnmount() {
    // this.props.toggleNav();
    this.props.clearItems();
  }
  render() {
    const { PBAnalyze, caseId } = this.props;
    const { showTableMessage, selectionData } = this.state;
    return (
      <Fragment>
        <div style={{ display: showTableMessage ? 'block' : 'none' }}>
          <PBTableMessage data={{ criteria: { ...this.props.criteria }, selectData: selectionData.selectData }} caseId={caseId} onSubmit={this.offSelectData} />
        </div>
        <WindowScroller ref={this.setRef} onScroll={this.onScroll}>
          {
            ({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => {
              return (
                <div id="windowScroller">
                  {
                    this.state.isScrollTitle ? <ScrollTitle /> : null
                  }
                  <AutoSizer disableHeight>
                    {
                      ({ width }) => {
                        return (
                          <div ref={registerChild} onContextMenu={this.handleEvent}>
                            <MenuProvider id="menu_id">
                              <Loading visible={this.props.isLoading} style={{ height: 270 }} tip="加载中...">
                                <Table
                                  ref="Table"
                                  autoHeight
                                  width={width}
                                  height={height}
                                  headerHeight={70}
                                  rowHeight={50}
                                  rowCount={PBAnalyze.length}
                                  rowGetter={({ index }) => PBAnalyze[index]}
                                  isScrolling={isScrolling}
                                  onScroll={onChildScroll}
                                  scrollTop={scrollTop}
                                  rowClassName={this.rowClassName}
                                  onRowMouseOver={this.onRowMouseOver}
                                  onRowRightClick={this.onRowRightClick}
                                  onColumnClick={this.onColumnClick}
                                  onRowDoubleClick={this.onRowDoubleClick}
                                  rowRenderer={this.rowRenderer}
                                >
                                  {
                                    tableTitle.map(item => {
                                      return (
                                        <Column
                                          key={item.label}
                                          dataKey={item.key}
                                          label={item.label}
                                          disableSort
                                          width={item.width}
                                          cellRenderer={this.cellRenderer}
                                        />
                                      );
                                    })
                                  }
                                </Table>
                              </Loading>
                            </MenuProvider>
                            {PBAnalyze.length > 0 ? <ContextMenu /> : null}
                          </div>
                        );
                      }
                    }
                  </AutoSizer>
                </div>
              );
            }
          }
        </WindowScroller>
      </Fragment>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    criteria: state.search.criteria,
    PBAnalyze: state.PBAnalyze.items || [],
    PBAnalyzes: state.PBAnalyze,
    caseId: state.cases.case.id,
    isLoading: state.PBAnalyze.isLoading,
  };
};

const mapDispatchToProps = {
  getPBAnalyze,
  toggleNav,
  clearItems,
  searchPBAnalyze,
};
const withReducer = injectReducer({ key: 'PBAnalyze', reducer: PBAnalyzeReducer });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);


export default compose(
  withReducer,
  withConnect,
)(ConnectionsList);
