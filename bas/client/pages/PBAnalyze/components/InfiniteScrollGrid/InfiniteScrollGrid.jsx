import cn from 'classnames';
import React, { PureComponent } from 'react';
import { Tab, Button, Icon } from '@alifd/next';

import { Grid, AutoSizer, List, ScrollSync } from 'react-virtualized';
import IceContainer from '@icedesign/container';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import ScrollTitle from './ScrollTitle.jsx';
import clsx from 'clsx';

import { MenuProvider } from 'react-contexify';
import ContextMenu from '../ContextMenu';


import { connect } from 'react-redux';
import { compose } from 'redux';
import { PBAnalyzeReducer } from '../../../../stores/PBAnalyze/reducer';
import injectReducer from '../../../../utils/injectReducer';
import { getPBAnalyze } from '../../../../stores/PBAnalyze/actions';

import './style.css';

var dateFormat = require('dateformat');

const LEFT_COLOR_FROM = hexToRgb('#eeeeee');
const LEFT_COLOR_TO = hexToRgb('#fafafa');
const TOP_COLOR_FROM = hexToRgb('#fafafa');
const TOP_COLOR_TO = hexToRgb('#fafafa');

const TabPane = Tab.TabPane;
const panes = [
  { tab: '全部', key: 1, closeable: false },
];
const tableTitle = ['计费类型', '状态', '己方通话地', '本方号码', '人员信息', '联系类型', '对方号码', '短号', '人员信息', '归属地', '对方通话地', '长途', '虚拟',
  '日期', '时间', '时间类别', '周几', '时间性质', '时长分', '时长类别', '基站代码', '基站标注',
];

class InfiniteScrollGrid extends PureComponent {
  static displayName = 'InfiniteScrollGrid';

  constructor(props, context) {
    super(props, context);

    this.state = {
      panes: panes,
      activeKey: panes[0].key,
      columnWidth: 79,
      columnCount: 22,
      height: 600,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 40,
      // rowCount: 0,
      scrollTitle: false,
    };

    this._renderBodyCell = this._renderBodyCell.bind(this);
    this._renderHeaderCell = this._renderHeaderCell.bind(this);
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this);
    this.addTabpane = this.addTabpane.bind(this);
  }

  componentDidMount() {
    function randomPB() {
      let res = [];
      for (let i = 0; i < 3000; i++) {
        i % 2 === 0 ?
          res.push({
            id: 1,
            case_id: 1,
            owner_num: 13906633778,
            owner_short_num: null,
            owner_comm_loc: '温州',
            peer_num: 13912345778,
            peer_short_num: null,
            peer_comm_loc: '温州',
            duration: 15,
            started_time: 1540000000000,
            bill_type: 1,
            owner_num_st: 1,
            comm_direction: 11, //12
            long_dist: 0,
            ven: 0,
            attribution: '浙江温州',
            cell_tower: '4399:1237:0',
            lac_hex: '6777',
            cid_hex: '30647',
            ct_label: '红点工业区',
            created_at: null,
            updated_at: null,
            owner_label: '张小三',
            peer_label: '李小四',
            time_class: 0,
            duration_class: 1,
          })
          :
          res.push({
            id: 1,
            case_id: 1,
            owner_num: 13906633778,
            owner_short_num: null,
            owner_comm_loc: '常州',
            peer_num: 13912345778,
            peer_short_num: null,
            peer_comm_loc: '常州',
            duration: 15,
            started_time: 1548656755926,
            bill_type: 2,
            owner_num_st: 1,
            comm_direction: 12, //12
            long_dist: 0,
            ven: 0,
            attribution: '浙江温州',
            cell_tower: '6777:77b7:0',
            lac_hex: '6777',
            cid_hex: '30647',
            ct_label: '上海碎进隧道1800',
            created_at: null,
            updated_at: null,
            owner_label: '李小四',
            peer_label: '张小三',
            time_class: 0,
            duration_class: 1,
          });
      }
      return res;
    }

    let _this = this;
    this.props.getPBAnalyze(randomPB());
    window.onscroll = function () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop >= 371) {
        _this.setState({
          scrollTitle: true,
        });
      } else {
        _this.setState({
          scrollTitle: false,
        });
      }
    };
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  remove(targetKey) {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((item, i) => {
      if (item.key == targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key != targetKey);
    if (lastIndex >= 0 && activeKey == targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });
  }

  onClose(targetKey) {
    this.remove(targetKey);
  }

  onChange(activeKey) {
    this.setState({ activeKey });
  }

  addTabpane() {
    let panes = this.state.panes;
    let activeKey = Math.random();
    panes.push({ tab: 'new tab', key: activeKey });
    this.setState({
      panes: panes,
      activeKey: activeKey,
    });
  }


  render() {
    const state = this.state;
    const {
      columnCount,
      columnWidth,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,

    } = this.state;
    const rowCount = this.props.PBAnalyze.length || 0;
    const row =
      (key) => {
        return <ScrollSync ref={'k1' + key}>
          {({
              clientHeight,
              clientWidth,
              onScroll,
              scrollHeight,
              scrollLeft,
              scrollTop,
              scrollWidth,
            }) => {
            const x = scrollLeft / (scrollWidth - clientWidth);
            const y = scrollTop / (scrollHeight - clientHeight);
            this.onScroll = onScroll;
            const leftBackgroundColor = mixColors(
              LEFT_COLOR_FROM,
              LEFT_COLOR_TO,
              y,
            );
            const leftColor = '#111';
            const topBackgroundColor = mixColors(
              TOP_COLOR_FROM,
              TOP_COLOR_TO,
              x,
            );
            const topColor = '#111';
            const middleBackgroundColor = mixColors(
              leftBackgroundColor,
              topBackgroundColor,
              0.5,
            );
            const middleColor = '#111';
            return (
              <div className="GridRow">
                <div
                  className="LeftSideGridContainer"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    color: leftColor,
                    backgroundColor: `rgb(${topBackgroundColor.r},${
                      topBackgroundColor.g
                      },${topBackgroundColor.b})`,
                  }}>
                  <Grid
                    cellRenderer={this._renderLeftHeaderCell}
                    className="HeaderGrid"
                    width={50}
                    height={rowHeight}
                    rowHeight={rowHeight}
                    columnWidth={50}
                    rowCount={1}
                    columnCount={1}
                  />
                </div>
                <div
                  className="LeftSideGridContainer"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: rowHeight,
                    color: leftColor,
                    backgroundColor: `rgb(${leftBackgroundColor.r},${
                      leftBackgroundColor.g
                      },${leftBackgroundColor.b})`,
                  }}>
                  <Grid
                    ref={'l2' + key}
                    overscanColumnCount={overscanColumnCount}
                    overscanRowCount={overscanRowCount}
                    cellRenderer={this._renderLeftSideCell}
                    columnWidth={this._getColumnWidth}
                    columnCount={1}
                    className="LeftSideGrid"
                    height={height - scrollbarSize()}
                    rowHeight={rowHeight}
                    rowCount={rowCount}
                    scrollTop={scrollTop}
                    width={45}
                  />
                </div>
                <div className="GridColumn">
                  <AutoSizer disableHeight ref={'k2' + key}>
                    {({ width }) => (
                      <div>
                        <div
                          style={{
                            backgroundColor: `rgb(${topBackgroundColor.r},${
                              topBackgroundColor.g
                              },${topBackgroundColor.b})`,
                            color: topColor,
                            height: rowHeight,
                            width: width - scrollbarSize(),
                          }}>
                          <Grid
                            ref="sc3"
                            className="HeaderGrid"
                            columnWidth={this._getColumnWidth}
                            columnCount={columnCount}
                            height={rowHeight}
                            overscanColumnCount={overscanColumnCount}
                            cellRenderer={this._renderHeaderCell}
                            rowHeight={rowHeight}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            width={width - scrollbarSize()}
                          />
                        </div>
                        <MenuProvider id="menu_id">
                          <div
                            ref="ha"
                            style={{
                              backgroundColor: `rgb(${middleBackgroundColor.r},${
                                middleBackgroundColor.g
                                },${middleBackgroundColor.b})`,
                              color: middleColor,
                              height,
                              width,
                            }}>
                            <Grid
                              ref={'k3' + key}
                              className="BodyGrid"
                              columnWidth={this._getColumnWidth}
                              columnCount={columnCount}
                              height={height}
                              onScroll={onScroll}
                              overscanColumnCount={overscanColumnCount}
                              overscanRowCount={overscanRowCount}
                              cellRenderer={this._renderBodyCell}
                              rowHeight={rowHeight}
                              rowCount={rowCount}
                              width={width}
                            />
                          </div>
                        </MenuProvider>

                      </div>
                    )}
                  </AutoSizer>
                </div>
              </div>
            );
          }}
        </ScrollSync>;
      };
    return (
      <IceContainer className="infinite-scroll-grid" id="context">
        {/*
                      <ContextMenu search={this.addTabpane} rangeId="context"/>
            */}
        {this.state.scrollTitle && <ScrollTitle/>}
        {row(1)}
        <ContextMenu/>
      </IceContainer>
    );
  }

  _getColumnWidth({ index }) {
    switch (index) {
      case 2:
        return 60;
      case 3:
        return 100;
      case 6:
        return 100;
      case 10:
        return 60;
      case 11:
        return 35;
      case 12:
        return 35;
      case 13:
        return 130;
      case 20:
        return 80;
      case 21:
        return 100;
      default:
        return 45;
    }
  }

  _renderBodyCell({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return;
    }
    return this._renderLeftSideCell({ columnIndex, key, rowIndex, style });
  }

  _renderHeaderCell({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return;
    }

    return this._renderLeftHeaderCell({ columnIndex, key, rowIndex, style });
  }

  _renderLeftHeaderCell({ columnIndex, key, style }) {
    return (
      <div className="headerCell" key={key} style={style}>
        {`${tableTitle[columnIndex]}`}
      </div>
    );
  }

  onDblclick(e) {
    console.log(e.target.innerText);
  }

  _renderLeftSideCell({ columnIndex, key, rowIndex, style }) {
    // var className =
    // columnIndex === this.state.hoveredColumnIndex ||
    // rowIndex === this.state.hoveredRowIndex
    //   ? 'item hoveredItem'
    //   : 'item';
    const rowClass =
      rowIndex == this.state.hoveredRowIndex || columnIndex == this.state.hoveredColumnIndex
        ? 'oddRow' : 'evenRow';
    const titleClass = rowIndex % 2 === 0
      ? 'redRow' : 'greenRow';
    const classNames = clsx(rowClass, 'cell');
    const titleNames = clsx(titleClass, 'cell');
    const hover = (columnIndex) => {
      this.setState({
        hoveredColumnIndex: columnIndex,
        hoveredRowIndex: rowIndex,
      }, () => {
        this.refs['k1' + this.state.activeKey] && this.refs['k1' + this.state.activeKey].refs['k2' + this.state.activeKey] && this.refs['k1' + this.state.activeKey].refs['k2' + this.state.activeKey].refs['k3' + this.state.activeKey] && this.refs['k1' + this.state.activeKey].refs['k2' + this.state.activeKey].refs['k3' + this.state.activeKey].forceUpdate();
        this.refs['k1' + this.state.activeKey].refs['l2' + this.state.activeKey].forceUpdate();
      });
    };
    return (
      <div className={classNames} key={key} style={style} onMouseOver={() => hover(columnIndex)} onDoubleClick={this.onDblclick}>
        {transCall.call(this, rowIndex, columnIndex)}
      </div>
    );

    function transCall(rowIndex, columnIndex) {
      if (columnIndex == '0') {
        return this.props.PBAnalyze[rowIndex].bill_type;
      } else if (columnIndex == '1') {
        return this.props.PBAnalyze[rowIndex].owner_num_st;
      } else if (columnIndex == '2') {
        return this.props.PBAnalyze[rowIndex].owner_comm_loc;
      } else if (columnIndex == '3') {
        return this.props.PBAnalyze[rowIndex].owner_num;
      } else if (columnIndex == '4') {
        return this.props.PBAnalyze[rowIndex].owner_label;
      } else if (columnIndex == '5') {
        return this.props.PBAnalyze[rowIndex].comm_direction;
      } else if (columnIndex == '6') {
        return this.props.PBAnalyze[rowIndex].peer_num;
      } else if (columnIndex == '7') {
        return this.props.PBAnalyze[rowIndex].peer_short_num;
      } else if (columnIndex == '8') {
        return this.props.PBAnalyze[rowIndex].peer_label;
      } else if (columnIndex == '9') {
        return this.props.PBAnalyze[rowIndex].attribution;
      } else if (columnIndex == '10') {
        return this.props.PBAnalyze[rowIndex].peer_comm_loc;
      } else if (columnIndex == '11') {
        return this.props.PBAnalyze[rowIndex].long_dist;
      } else if (columnIndex == '12') {
        return this.props.PBAnalyze[rowIndex].ven;
      } else if (columnIndex == '13') {
        return this.props.PBAnalyze[rowIndex].started_time_full;
      } else if (columnIndex == '14') {
        return this.props.PBAnalyze[rowIndex].started_time_hour;
      } else if (columnIndex == '15') {
        return this.props.PBAnalyze[rowIndex].started_time_state;
      } else if (columnIndex == '16') {
        return this.props.PBAnalyze[rowIndex].started_time_week;
      } else if (columnIndex == '17') {
        return this.props.PBAnalyze[rowIndex].time_class;
      } else if (columnIndex == '18') {
        return this.props.PBAnalyze[rowIndex].duration;
      } else if (columnIndex == '19') {
        return this.props.PBAnalyze[rowIndex].duration_class;
      } else if (columnIndex == '20') {
        return this.props.PBAnalyze[rowIndex].cell_tower;
      } else if (columnIndex == '21') {
        return this.props.PBAnalyze[rowIndex].ct_label;
      } else {
        return ``;
      }
    }
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

/**
 * Ported from sass implementation in C
 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
 */
function mixColors(color1, color2, amount) {
  const weight1 = amount;
  const weight2 = 1 - amount;

  const r = Math.round(weight1 * color1.r + weight2 * color2.r);
  const g = Math.round(weight1 * color1.g + weight2 * color2.g);
  const b = Math.round(weight1 * color1.b + weight2 * color2.b);

  return { r, g, b };
}

const mapStateToProps = (state) => {
  return { PBAnalyze: state.PBAnalyze.items || [] };
};

const mapDispatchToProps = {
  getPBAnalyze,
};
const withReducer = injectReducer({ key: 'PBAnalyze', reducer: PBAnalyzeReducer });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withReducer,
  withConnect,
)(InfiniteScrollGrid);
