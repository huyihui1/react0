/**
 *  isHide 隐藏报表类型Input
 */
/* eslint-disable no-unused-vars */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Loading, Balloon, Icon, Checkbox } from '@alifd/next';
import { WindowScroller, AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import { MenuProvider, contextMenu } from 'react-contexify';
import IceLabel from '@icedesign/label';
import moment from 'moment';
import echarts from 'echarts';
import solarLunar from 'solarlunar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import * as Scroll from 'react-scroll';

import 'react-virtualized/styles.css';
import { PBAnalyzeReducer } from '../../../stores/PBAnalyze/reducer';
import injectReducer from '../../../utils/injectReducer';
import { installExternalLibs } from '../../../utils/utils';
import PBTableMessage from '../../common/PbTableMessage';
import HighlightCode from '../../common/HighlightCode';
import MapComponent from '../../common/MapComponent';
import LocGroupMap from '../../common/LocGroupMap';
import ajax from '../../../utils/ajax';
import appConfig from '../../../appConfig';
import ScrollTitle from '../../PBAnalyze/components/InfiniteScrollGrid/ScrollTitle';



import { getPBAnalyze, clearItems, searchPBAnalyze, searchCode, handleLoading } from '../../../stores/PBAnalyze/actions';
import { toggleNav } from '../../../stores/case/actions';
// import ContextMenu from '../ContextMenu';
// import ScrollTitle from './ScrollTitle';
import { coordOffsetDecrypt } from '../../../utils/basCoord';

// 回到顶部动画设置, 值越小越快
const scrollTime = 300;
const scroll = Scroll.animateScroll;

const pageCount = 100;

const topIcon = (
  <svg t="1569296853164" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
       p-id="3812" width="32" height="32">
    <path
      d="M796.422846 524.478323 537.312727 265.185862c-6.368176-6.39914-14.688778-9.471415-22.976697-9.407768-1.119849-0.096331-2.07972-0.639914-3.19957-0.639914-4.67206 0-9.024163 1.087166-13.023626 2.879613-4.032146 1.536138-7.87163 3.872168-11.136568 7.135385L227.647682 524.27706c-12.512727 12.480043-12.54369 32.735385-0.032684 45.248112 6.239161 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.624056-9.34412L479.1356 363.426421l0 563.712619c0 17.695686 14.336138 31.99914 32.00086 31.99914s32.00086-14.303454 32.00086-31.99914L543.13732 361.8576l207.91012 207.73982c6.240882 6.271845 14.496116 9.440452 22.687703 9.440452s16.319527-3.103239 22.560409-9.311437C808.870206 557.277355 808.902889 536.989329 796.422846 524.478323z"
      p-id="3813" fill="#8a8a8a"></path>
    <path
      d="M864.00258 192 160.00258 192c-17.664722 0-32.00086-14.336138-32.00086-32.00086S142.337858 128 160.00258 128l704 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.698266 192 864.00258 192z"
      p-id="3814" fill="#8a8a8a"></path>
  </svg>
);


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
    width: 30,
  },
  {
    key: 'ven',
    label: '虚拟',
    width: 30,
  },
  {
    key: 'started_day',
    label: '日期',
    width: 120,
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
    label: '本方基站',
    width: 55,
  },
  {
    key: 'peer_ct_code',
    label: '对方基站',
    width: 55,
  },
];

const noDataText = '暂无地址';

let oldCode = null;

class PBAnalyzeList extends PureComponent {
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
      caseEvents: [],
      myChart: null,
      toggleMiniTimeLine: true,
      summaryDate: null,
      numberLabelerConfig: {
        visible: false,
      },
      ctLabel: [],
      hlColField: '',
      hlColValues: [],
      colValues: [],
      rowData: {},
      ownerCodeArr: [],
      peerCodeArr: [],
      showCtLoc: false,
      initPageCount: 0
    };
    this.loc = null;
    this.attr = null;
    this.startedDay = null;
    this.num = null;
    this.stopRequest = false;
    this.page = 2;
    this.codeColors = {};
    this.codeColorIndex = 0;
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
    this.rowRenderer = this.rowRenderer.bind(this);
    this.onRowRightClick = this.onRowRightClick.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.offSelectData = this.offSelectData.bind(this);
    this.fetchCountByDist = this.fetchCountByDist.bind(this);
    this.showNumberLabeler = this.showNumberLabeler.bind(this);
    this.dateFilter = this.dateFilter.bind(this);
    this.fetchCtLabels = this.fetchCtLabels.bind(this);
    this.ctLabelRender = this.ctLabelRender.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
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
    this.rowData.rowIndex = index;
    event.target.click && event.target.click();
  }

  onColumnClick({ columnData, dataKey, event }) {
    if (this.rowData) {
      this.rowData.dataKey = dataKey;
    }
  }
  offSelectData() {
    this.setState({ colValues: [], hlColField: '', hlColValues: [], showTableMessage: false });
    this.fetchCountByDist(this.props.caseId, { criteria: { ...this.props.criteria }, view: {} });
  }


  async onVisibleChange(visible, code) {
    this.stopRequest = !visible;
    if (visible) {
      const codeInfo = await searchCode(code);
      this.state.ctLabel.forEach(item => {
        if (item.ct_code == code) {
          codeInfo.label = item;
        }
      });
      if (this.stopRequest) return;
      this.setState({
        codeInfo,
      }, () => {
        if (window.BMap) {
          this.renderMap();
        } else {
          installExternalLibs(document.body, this.renderMap);
        }
      });
    } else {
      this.setState({
        codeInfo: '',
      });
    }
  }
  rowRenderer(data) {
    const { hlColField, colValues } = this.state;
    const rowData = data.rowData;
    if (rowData) {
      if (colValues.indexOf(rowData[hlColField]) !== -1) {
        data.style = { ...data.style, background: '#d2e3fd', borderBottom: '1px solid #cecaca' };
      }
      // if (this.props.criteria && this.props.criteria.adhoc && this.props.criteria.adhoc.numA === rowData.owner_num) {
      //   data.className += ' numA';
      // } else if (this.props.criteria && this.props.criteria.adhoc && this.props.criteria.adhoc.numB === rowData.owner_num) {
      //   data.className += ' numB';
      // }
    }
    if (this.props.isHighlight && rowData.highlight) {
      data.style = { ...data.style, background: '#f5efaf', borderBottom: '1px solid #cecaca' };
    }
    return defaultTableRowRenderer(data);
  }
  formatLabelPNsDataKey(arr, key, value) {
    let ownerCname = null;
    let peerCname = null;
    arr.forEach(item => {
      if (item[key] === value.owner_num) {
        ownerCname = { item, key: 'owner_cname' };
      }
      if (item[key] === value.peer_num) {
        peerCname = { item, key: 'peer_cname' };
      }
    });
    if (ownerCname && peerCname) {
      return { ownerCname, peerCname };
    } else if (ownerCname) {
      return { ownerCname };
    } else if (peerCname) {
      return { peerCname };
    }
    return null;
  }
  formatCaseEventData(arr, value) {
    return arr.filter(item => {
      return moment(value).format('YYYY-MM-DD').valueOf() >= moment(item.started_at).format('YYYY-MM-DD').valueOf() && moment(value).format('YYYY-MM-DD').valueOf() <= moment(item.ended_at).format('YYYY-MM-DD').valueOf();
    });
  }
  ctLabelRender(labels) {
    if (labels.label) {

    }
  }

  handleCtCode = (rowIndex, key) => {
    const { ownerCodeArr, peerCodeArr } = this.state;
    if (key === 'owner_ct_code') {
      const idx = ownerCodeArr.indexOf(rowIndex);
      if (idx === -1) {
        ownerCodeArr.push(rowIndex);
      } else {
        ownerCodeArr.splice(idx, 1);
      }
      this.setState({
        ownerCodeArr,
      }, () => {
        this.table.forceUpdateGrid();
      });
    } else {
      const idx = peerCodeArr.indexOf(rowIndex);
      if (idx === -1) {
        peerCodeArr.push(rowIndex);
      } else {
        peerCodeArr.splice(idx, 1);
      }
      this.setState({
        peerCodeArr,
      }, () => {
        this.table.forceUpdateGrid();
      });
    }
  }

  clickHandler(event, rowData, cellData, dataKey, rowIndex) {
    event.stopPropagation();
    const keyObj = {
      comm_direction: {
        未知: 0,
        主叫: 11,
        '<---': 12,
        呼转: 13,
        主短: 21,
        被短: 22,
        主彩: 31,
        被彩: 32,
      },
      bill_type: {
        通话: 1,
        短信: 2,
        彩信: 3,
      },
      owner_num_status: {
        其他: 0,
        本地: 1,
        漫游: 2,
      },
      started_time_l1_class: {
        早晨: 0,
        上午: 1,
        中午: 2,
        下午: 3,
        傍晚: 4,
        晚上: 5,
        深夜: 6,
        凌晨: 7,
      },
      weekday: {
        一: 1,
        二: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        日: 7,
      },
      long_dist: {
        长: 1,
      },
      ven: {
        虚: 1,
      },
      time_class: {
        私人时间: 0,
        Work: 1,
      },
      duration_class: {
        其他: 0,
        '1~15秒': 1,
        '16~90秒': 2,
        '1.5~3分': 3,
        '3~5分': 4,
        '5~10分': 5,
        '>10分': 6,
      },
    };
    if (this.rowData) {
      this.rowData.dataKey = dataKey;
    }
    // In that case, event.ctrlKey does the trick.
    if (event.altKey) {
      const { hlColValues, colValues } = this.state;
      let value = null;
      console.log(dataKey);
      if (keyObj[dataKey]) {
        value = keyObj[dataKey][cellData];
      } else {
        value = cellData;
      }
      if (this.state.hlColField === dataKey) {
        const index = hlColValues.indexOf(value);
        if (index !== -1) {
          hlColValues.splice(index, 1);
          colValues.splice(index, 1);
        } else {
          hlColValues.push(value);
          colValues.push(cellData);
        }
        this.setState({
          hlColValues: [...hlColValues],
          colValues,
          showTableMessage: true,
        }, () => {
          this.table.forceUpdateGrid();
        });
      } else {
        this.setState({
          hlColField: dataKey,
          hlColValues: [value],
          colValues: [cellData],
          showTableMessage: true,
        }, () => {
          this.table.forceUpdateGrid();
        });
      }
      const t = {};
      // if (rowData[dataKey] === cellData) {
      //   t.data = cellData;
      //   if (keyObj[dataKey]) {
      //     t.selectData = { [dataKey]: keyObj[dataKey][cellData] };
      //   } else {
      //     t.selectData = { [dataKey]: cellData };
      //   }
      //   this.setState({
      //     selectionData: t,
      //     showTableMessage: true,
      //   });
      // }
      rowData.dataKey = dataKey;
      this.setState({
        rowData,
      });
    } else if (event.ctrlKey) {
      this.handleCtCode(rowIndex, dataKey);
    }
  }

  codeLocRender = (showCtLoc, isLabel, ownerCodeArr, peerCodeArr, rowIndex, cellData, dataKey, rowData) => {
    if (showCtLoc) {
      if ((dataKey === 'owner_ct_code' && ownerCodeArr.indexOf(rowIndex) !== -1) || (dataKey === 'peer_ct_code' && peerCodeArr.indexOf(rowIndex) !== -1)) {
        if (isLabel) {
          return (
            <Fragment>
              <span style={{ display: 'inline-block', width: '100%', backgroundColor: isLabel.marker_color, color: '#fff' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{isLabel.label}</span>
            </Fragment>
          );
        }
        return (
          <HighlightCode cellData={cellData} dataKey={dataKey} rowData={rowData} rowIndex={rowIndex} clickHandler={this.clickHandler} codeColors={this.codeColors} />
        );
      }
      return (
        <span className='ctLocText' labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }} title={dataKey === 'peer_ct_code' ? rowData.peer_ct_dist + rowData.peer_ct_town || noDataText : rowData.owner_ct_dist + rowData.owner_ct_town || noDataText}>{dataKey === 'peer_ct_code' ? rowData.peer_ct_dist + rowData.peer_ct_town || noDataText : rowData.owner_ct_dist + rowData.owner_ct_town || noDataText}</span>
      );
    }
    return null;
  }

  cellRenderer({ cellData, dataKey, rowData, rowIndex }) {
    const { ext } = this.props;
    if (dataKey === 'owner_num' || dataKey === 'peer_num') {
      const { numberLabelerConfig } = this.state;
      return (
        <div className="num-box" style={{ display: 'inline-flex' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>
          <span>
            {cellData}
          </span>
        </div>
      );
    }
    if (dataKey === 'peer_short_num') {
      if (cellData) {
        return (
          <span labeldata={`${JSON.stringify({ num: rowData.owner_num, sn: cellData })}`}>{cellData}</span>
        );
      }
    }

    if (dataKey === 'owner_cname' || dataKey === 'peer_cname') {
      const result = this.formatLabelPNsDataKey(this.state.labelPNs, 'num', rowData);
      if (result) {
        if (result.ownerCname && result.ownerCname.key === dataKey) {
          return (
            <div title={result.ownerCname.item.label}>
              <IceLabel inverse={false} style={{ fontSize: '12px', backgroundColor: result.ownerCname.item.label_bg_color, color: result.ownerCname.item.label_txt_color, padding: '2px' }}>{result.ownerCname.item.label}</IceLabel>
            </div>
          );
        }
        if (result.peerCname && result.peerCname.key === dataKey) {
          return (
            <div title={result.peerCname.item.label}>
              <IceLabel inverse={false} style={{ fontSize: '12px', backgroundColor: result.peerCname.item.label_bg_color, color: result.peerCname.item.label_txt_color, padding: '2px' }}>{result.peerCname.item.label}</IceLabel>
            </div>
          );
        }
      } else {
        return cellData;
      }
    }
    if (dataKey === 'started_day') {
      const { caseEvents } = this.state;
      const renderTimeline = (caseEvents) => {
        return (
          <div style={{ paddingLeft: '15px' }}>
            <ul style={{ listStyle: 'initial' }}>
              {
                caseEvents.map((item, index) => {
                  const date = new Date(item.started_at);
                  const year = date.getFullYear();
                  const month = date.getMonth() + 1;
                  const day = date.getDate();
                  const solar2lunarData = solarLunar.solar2lunar(year, month, day);
                  return (
                    <li key={item.name + index}>
                      <h3>
                        <IceLabel inverse={false} style={{ backgroundColor: item.color, color: '#fff', padding: '2px' }}>{moment(item.started_at).format('YYYY-MM-DD')}{item.ended_at ? `~${moment(item.ended_at).format('YYYY-MM-DD')}` : null}</IceLabel>
                        <span style={{ marginLeft: '5px' }}>{solar2lunarData.monthCn}{solar2lunarData.dayCn}</span>
                      </h3>
                      <span>{item.name}</span>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        );
      };
      if (rowData.overlap_duration) {
        return (
          <h3 style={{fontSize: '14px', color: 'red', fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap'}} title={`重合${rowData.overlap_duration / 1000}秒`}>重合{rowData.overlap_duration / 1000}秒</h3>
        )
      }
      if (rowIndex === 0) {
        this.startedDay = cellData;
        const res = this.formatCaseEventData(caseEvents, cellData);
        if (res.length > 0) {
          return (
            <Balloon align="l"
              closable={false}
              trigger={
                <div style={{ color: 'blue', fontWeight: 'bold' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>
                  <div style={{ display: 'inline-block', position: 'relative' }} labeldata={`${JSON.stringify({ time: `${rowData.started_day} ${rowData.started_time}` })}`}>
                    {cellData}
                    <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', width: '100%', bottom: 0 }}>
                      {
                    res.map(item => {
                      return (
                        <div key={item.id} style={{ flex: 1, background: item.color, height: '2px' }} />
                      );
                    })
                  }
                    </div>
                  </div>
                </div>
            }
            >
              {renderTimeline(res)}
            </Balloon>
          );
        }
        return <div style={{ color: 'blue', fontWeight: 'bold' }} labeldata={`${JSON.stringify({ time: `${rowData.started_day} ${rowData.started_time}` })}`} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData}</div>;
      }
      const date = new Date(cellData);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const solar2lunarData = solarLunar.solar2lunar(year, month, day);
      if (this.startedDay !== cellData) {
        this.startedDay = cellData;
        const res = this.formatCaseEventData(caseEvents, cellData);
        if (res.length > 0) {
          return (
            <Balloon align="l"
              closable={false}
              trigger={
                <div style={{ color: 'blue', fontWeight: 'bold' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>
                  <div style={{ display: 'inline-block' }} labeldata={`${JSON.stringify({ time: `${rowData.started_day} ${rowData.started_time}` })}`}>
                    {cellData}
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      {
                      res.map(item => {
                        return (
                          <div key={item.id} style={{ flex: 1, background: item.color, height: '2px' }} />
                        );
                      })
                    }
                    </div>
                  </div>
                </div>
            }
            >
              {renderTimeline(res)}
            </Balloon>
          );
        }
        return <div style={{ color: 'blue', fontWeight: 'bold' }} labeldata={`${JSON.stringify({ time: `${rowData.started_day} ${rowData.started_time}` })}`} title={`${solar2lunarData.monthCn}${solar2lunarData.dayCn}`}>{cellData}</div>;
      } else if (this.startedDay === cellData) {
        return <div style={{ color: '#bdb5b5' }} title={`${solar2lunarData.monthCn}${solar2lunarData.dayCn}`} labeldata={`${JSON.stringify({ time: `${rowData.started_day} ${rowData.started_time}` })}`} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{moment(cellData).format('YYMM.DD日')}</div>;
      }
    }
    if (dataKey === 'started_time' && cellData) {
      return <span labeldata={`${JSON.stringify({ time: `${rowData.started_day} ${rowData.started_time}` })}`}>{cellData}</span>;
    }
    if (dataKey === 'comm_direction') {
      if (rowData.owner_ct_code && rowData.peer_ct_code) {
        return (
          <Balloon align="r"
            closable={false}
            trigger={
              <div style={{ color: cellData === '主叫' ? '#f63' : null }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>
                   }
            popupProps={{ code: [rowData.owner_ct_code, rowData.peer_ct_code] }}
          >
            <div style={{ width: '600px', height: '350px' }}>
              <MapComponent code={[rowData.owner_ct_code, rowData.peer_ct_code]} ctLabel={this.state.ctLabel} commDirection={rowData.comm_direction} cellData={cellData} />
            </div>
          </Balloon>
        );
      }
      return <div style={{ color: cellData === '主叫' ? '#f63' : null }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>;
    }
    if (dataKey === 'owner_comm_loc') {
      return <div onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>;
    }
    if (dataKey === 'peer_comm_loc') {
      this.loc = cellData;
      return <div onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>;
    }
    if (dataKey === 'peer_num_attr') {
      this.attr = cellData;
      return <div onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>;
    }
    if (this.loc && this.attr) {
      if (this.attr.indexOf(this.loc) === -1 && dataKey === 'peer_comm_loc') {
        return <div style={{ color: '#f63' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{this.loc}</div>;
      }
    }
    if (dataKey === 'started_time_l1_class') {
      if (cellData === '傍晚' || cellData === '晚上') {
        return <div style={{ color: 'blue' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>;
      }
      if (cellData === '深夜' || cellData === '凌晨') {
        return <div style={{ color: '#f33' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>;
      }
    }
    if (dataKey === 'duration_class') {
      if (cellData === '5~10分' || cellData === '>10分') {
        return <div style={{ color: '#f33' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>;
      }
    }
    if (dataKey === 'owner_num_status' && cellData === '漫游') {
      return <div style={{ color: 'blue' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>;
    }
    if (dataKey === 'weekday' && cellData === '六' || dataKey === 'weekday' && cellData === '日') {
      return <div style={{ color: 'blue' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>;
    }
    if (dataKey === 'owner_ct_code' && cellData || dataKey === 'peer_ct_code' && cellData) {
      const { codeInfo, ownerCodeArr, peerCodeArr, showCtLoc } = this.state;
      if (ext && ext[rowData.started_day] && this.codeColors[rowData.started_day] === undefined) {
        if (rowIndex === 0) {
          this.codeColors = {};
          this.codeColorIndex = 0;
        }
        this.codeColors[rowData.started_day] = this.codeColorIndex;
        this.codeColorIndex += 1;
        if (this.codeColorIndex === 10) {
          this.codeColorIndex = 0;
        }
      }
      if (codeInfo && (Object.values(codeInfo.data)[0] || []).length > 0) {
        let isLabel = null;
        this.state.ctLabel.forEach(item => {
          if (item.ct_code == cellData) {
            isLabel = item;
          }
        });
        if (this.props.pageTitle && ext && ext[rowData.started_day] && this.props.search.loc_rule === 'scope_ct') {
          let codes = null;
          for (let i = 0; i < ext[rowData.started_day].length; i++) {
            if (ext[rowData.started_day][i].indexOf(cellData) !== -1) {
              codes = ext[rowData.started_day][i];
              break;
            }
          }
          if (codes) {
            return (
              <Balloon animation={false}
                shouldUpdatePosition
                align="l"
                closable={false}
                trigger={<span style={{display: 'inline-block'}}>
                  {
                this.codeLocRender(showCtLoc, isLabel, ownerCodeArr, peerCodeArr, rowIndex, cellData, dataKey, rowData)
              }
                  {
                           showCtLoc === false ? (((dataKey === 'owner_ct_code' && ownerCodeArr.indexOf(rowIndex) !== -1) || (dataKey === 'peer_ct_code' && peerCodeArr.indexOf(rowIndex) !== -1)) ? (
                             <span className='ctLocText' labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }} title={dataKey === 'peer_ct_code' ? rowData.peer_ct_dist + rowData.peer_ct_town || noDataText : rowData.owner_ct_dist + rowData.owner_ct_town || noDataText}>{dataKey === 'peer_ct_code' ? rowData.peer_ct_dist + rowData.peer_ct_town || noDataText : rowData.owner_ct_dist + rowData.owner_ct_town || noDataText}</span>
                           ) : isLabel ? (
                             <Fragment>
                               <span style={{ display: 'inline-block', width: '100%', backgroundColor: isLabel.marker_color, color: '#fff' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{isLabel.label}</span>
                             </Fragment>
                             // <IceLabel inverse={false} style={{ fontSize: '12px', backgroundColor: codeInfo.label.marker_color, color: "#fff", padding: '2px' }}>{codeInfo.label.label}</IceLabel>
                           ) : (
                             <HighlightCode cellData={cellData} dataKey={dataKey} rowData={rowData} rowIndex={rowIndex} clickHandler={this.clickHandler} codeColors={this.codeColors} />
                           )) : null
                         }
                </span>}
                triggerType="hover"
              >
                <LocGroupMap code={codes} id={codes + rowIndex} activeCode={cellData} ctLabel={this.state.ctLabel} />
              </Balloon>
            );
          }
        }
        return (
          <Balloon animation={false}
            shouldUpdatePosition
            align="l"
            closable={false}
            trigger={<span style={{display: 'inline-block'}}>
              {
                this.codeLocRender(showCtLoc, isLabel, ownerCodeArr, peerCodeArr, rowIndex, cellData, dataKey, rowData)
              }
              {
                showCtLoc === false ? (((dataKey === 'owner_ct_code' && ownerCodeArr.indexOf(rowIndex) !== -1) || (dataKey === 'peer_ct_code' && peerCodeArr.indexOf(rowIndex) !== -1)) ? (
                  <span className='ctLocText' labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }} title={dataKey === 'peer_ct_code' ? rowData.peer_ct_dist + rowData.peer_ct_town || noDataText : rowData.owner_ct_dist + rowData.owner_ct_town || noDataText}>{dataKey === 'peer_ct_code' ? rowData.peer_ct_dist + rowData.peer_ct_town || noDataText : rowData.owner_ct_dist + rowData.owner_ct_town || noDataText}</span>
                ) : isLabel ? (
                  <Fragment>
                    <span style={{ display: 'inline-block', width: '100%', backgroundColor: isLabel.marker_color, color: '#fff' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{isLabel.label}</span>
                  </Fragment>
                  // <IceLabel inverse={false} style={{ fontSize: '12px', backgroundColor: codeInfo.label.marker_color, color: "#fff", padding: '2px' }}>{codeInfo.label.label}</IceLabel>
                ) : (
                  <HighlightCode cellData={cellData} dataKey={dataKey} rowData={rowData} rowIndex={rowIndex} clickHandler={this.clickHandler} codeColors={this.codeColors} />
                )) : null
              }
                     </span>}
            popupStyle={{ maxWidth: 'initial', width: '500px' }}
            triggerType="hover"
            onVisibleChange={(b) => { this.onVisibleChange(b, cellData); }}
          >
            <div style={{ width: '100%' }}>
              {
                isLabel ? (
                  <h3 style={{ marginBottom: '5px' }}>
                    标注: <IceLabel inverse={false} style={{ fontSize: '16px', backgroundColor: isLabel.marker_color, color: '#fff', padding: '2px' }}>{isLabel.label}</IceLabel>
                  </h3>
                  ) : null
              }
              <p style={{ fontSize: '14px', marginTop: '0' }}>
                <span style={{ fontSize: '16px' }}>基站:</span> {cellData} <FontAwesomeIcon icon={faExchangeAlt} style={{ marginLeft: '8px' }} /> {`${parseInt(cellData.split(':')[0], 16)}:${parseInt(cellData.split(':')[1], 16)}:${parseInt(cellData.split(':')[2], 16)}`}
              </p>
              <p style={{ minWidth: '240px', fontSize: '14px' }}> {codeInfo.data && JSON.stringify(codeInfo.data) != '{}' && Object.values(codeInfo.data)[0].length > 0 && Object.values(codeInfo.data)[0][1].address}</p>
              {/* <span>经纬度: ({(codeInfo.data && JSON.stringify(codeInfo.data) != '{}' && Object.values(codeInfo.data)[0][0] && Object.values(codeInfo.data)[0][0][0])}, {(codeInfo.data && JSON.stringify(codeInfo.data) != '{}' && Object.values(codeInfo.data)[0][0] && Object.values(codeInfo.data)[0][0][1])})</span> */}
              <div id="minMap" style={{ width: '100%', height: '300px' }} />
            </div>
          </Balloon>
        );
      }
      let isLabel = null;
      this.state.ctLabel.forEach(item => {
        if (item.ct_code == cellData) {
          isLabel = item;
        }
      });
      return (
        <Balloon animation={false}
          shouldUpdatePosition
          align="l"
          closable={false}
          trigger={<span style={{display: 'inline-block'}}>
            {
              this.codeLocRender(showCtLoc, isLabel, ownerCodeArr, peerCodeArr, rowIndex, cellData, dataKey, rowData)
            }
            {
              showCtLoc === false ? (((dataKey === 'owner_ct_code' && ownerCodeArr.indexOf(rowIndex) !== -1) || (dataKey === 'peer_ct_code' && peerCodeArr.indexOf(rowIndex) !== -1)) ? (
                <span className='ctLocText' labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }} title={dataKey === 'peer_ct_code' ? rowData.peer_ct_dist + rowData.peer_ct_town || noDataText : rowData.owner_ct_dist + rowData.owner_ct_town || noDataText}>{dataKey === 'peer_ct_code' ? rowData.peer_ct_dist + rowData.peer_ct_town || noDataText : rowData.owner_ct_dist + rowData.owner_ct_town || noDataText}</span>
              ) : isLabel ? (
                <Fragment>
                  <span style={{ display: 'inline-block', width: '100%', backgroundColor: isLabel.marker_color, color: '#fff' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{isLabel.label}</span>
                </Fragment>
              ) : (
                <HighlightCode cellData={cellData} dataKey={dataKey} rowData={rowData} rowIndex={rowIndex} clickHandler={this.clickHandler} codeColors={this.codeColors} />
              )) : null
            }
                   </span>}
          popupStyle={{ maxWidth: 'initial', width: '500px' }}
          triggerType="hover"
          onVisibleChange={(b) => { this.onVisibleChange(b, cellData); }}
        >
          <div style={{ width: '100%' }}>
            <h3 style={{ minWidth: '240px' }}>{
                codeInfo ? '基站数据暂未收录.' : '加载中...'
              }
            </h3>
          </div>
        </Balloon>
      );
    }

    return <div onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{cellData}</div>;

    // const { selectColumn: { data, key } } = this.state;
    // return data === `${cellData}` && key === dataKey ? <div style={{ background: '#fcef3c' }} title={cellData}>{cellData}</div> : cellData;
  }
  setRef(ref) {
    this.windowScroller = ref;
  }
  onScroll({ scrollTop }) {
    const bodyScrollHeight = document.body.scrollHeight;
    if (scrollTop > 0 && this.props.PBAnalyze.length > 0) {
      this.setState({
        isScrollTitle: true,
      });
    } else {
      this.setState({
        isScrollTitle: false,
      });
    }
    if (this.props.noPaging) {
      return;
    }
    if ((scrollTop > bodyScrollHeight / 2 || document.documentElement.scrollTop > bodyScrollHeight / 2) && this.state.isRequest && Object.keys(this.state.criteria).length > 0) {
      let params = { ...this.props.criteria, page: this.page };
      if (this.props.pagingType) {
        params = this.props.pagingType(this.props.PBAnalyze);
      } else if (this.state.initPageCount < pageCount) {
        return
      }
      this.props.searchPBAnalyze(this.props.caseId, params, false, this.props.componentProps && this.props.componentProps.url, true).then(res => {
        if (res.data.length > 0 || this.props.pagingType && res.data.length > 0) {
          this.page += 1
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
  }
  //  初始化百度地图
  renderMap() {
    const { codeInfo } = this.state;
    let data = null;
    if (codeInfo && codeInfo.data) {
      data = Object.keys(codeInfo.data).length > 0 && Object.values(codeInfo.data)[0].length > 0 ? Object.values(codeInfo.data)[0] : null;
    }
    const top_right_navigation = new window.BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM });
    const mapType1 = new window.BMap.MapTypeControl(
      {
        mapTypes: [BMAP_NORMAL_MAP],
        anchor: BMAP_ANCHOR_TOP_LEFT,
      }
    );
    const pointStyle = {
      // 指定Marker的icon属性为Symbol
      icon: new window.BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
        scale: 1, // 图标缩放大小
        fillColor: codeInfo && codeInfo.label ? codeInfo.label.marker_color : '#f00', // 填充颜色
        fillOpacity: 0.8, // 填充透明度
      }),
    };
    if (!data || !document.getElementById('minMap')) return;
    const p = coordOffsetDecrypt(data[0][0] * 1, data[0][1] * 1);
    const ggPoint = new window.BMap.Point(p[0] * 1, p[1] * 1);
    this.map = new window.BMap.Map('minMap');
    this.map.addControl(mapType1);
    this.map.addControl(top_right_navigation);
    // this.map.enableScrollWheelZoom(true); // 允许鼠标缩放
    const sContent = `<div>
        <h3>地址: ${data[1].address}</h3>
        <span>(${(data[0][0] * 1)}, ${(data[0][1] * 1)})</span>
      </div>`;
    //  增加范围
    this.map.clearOverlays();
    // const circle = new window.BMap.Circle(data.points[0], bsSearchs.items.radius, { strokeColor: 'red', strokeWeight: 2, fillColor: 'red', fillOpacity: 0.1 });
    // this.map.addOverlay(polyline);
    // this.map.addOverlay(circle);
    const marker = new window.BMap.Marker(ggPoint, pointStyle);
    this.map.addOverlay(marker);
    // const infoWindow = new window.BMap.InfoWindow(sContent);
    // marker.addEventListener('click', function () {
    //   this.openInfoWindow(infoWindow);
    // });
    this.map.setCenter(ggPoint);
    this.map.centerAndZoom(ggPoint, appConfig.mapZoom);
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
      this.map.centerAndZoom(data.points[0], appConfig.mapZoom);
    }
  }
  handleEvent(e) {
    e.preventDefault();
    contextMenu.show({
      id: 'menu_id',
      event: e,
      props: {
        rowData: this.rowData,
        caseId: this.props.caseId,
      },
    });
  }
  async componentDidMount() {
    this.props.getWindowScroller(this.windowScroller);
    window.onscroll = () => {
      const t = document.documentElement.scrollTop || document.body.scrollTop;
      if (Array.isArray(this.props.PBAnalyze) && this.props.PBAnalyze.length == 0) return;
      const topDom = document.getElementById('top');
      if (t > 500) {
        topDom.classList.add('show');
        this.setState({
          toggleMiniTimeLine: false,
        });
      } else {
        topDom.classList.remove('show');
        this.setState({
          toggleMiniTimeLine: true,
        });
      }
    };
    window.addEventListener('resize', () => {
      this.windowScroller && this.windowScroller.updatePosition();
    });

    // window.addEventListener('click', (e) => {
    //   e.stopPropagation();
    //   if (e.altKey) {
    //     console.log(e.target.innerText);
    //   }
    // });
  }
  async fetchCtLabels(caseId) {
    const res = await ajax.get(`/cases/${caseId}/ct_labels`);
    console.log(res);
    if (res.meta && res.meta.success) {
      this.setState({
        ctLabel: res.data,
      });
    }
  }
  async fetchCountByDist(caseId, criteria, bool = true) {
    const summary = await ajax.get(`/cases/${caseId}/summary`);
    const startDate = moment(summary.data.pb_started_at).format('YYYY-MM-DD');
    const endDate = moment(summary.data.pb_ended_at).format('YYYY-MM-DD');

    if (bool) {
      const c = Object.assign({}, criteria);
      delete criteria.criteria.daily_rec;
      delete criteria.criteria['order-by'];
      ajax.post(`/cases/${caseId}/pbills/records/count-by-dist`, c).then(res => {
        const chartData = [];
        if (res.data.length == 0) {
          this.state.myChart.setOption({
            series: [{
              name: '',
              data: [],
            }],
          });
          return;
        }
        // if (res.data[0].started_day != startDate) {
        //   chartData.push([0, startDate]);
        // }
        res.data.forEach(item => {
          chartData.push([item.count, item.started_day]);
        });
        // if (res.data[res.data.length - 1].started_day != endDate) {
        //   chartData.push([0, endDate]);
        // }

        this.state.myChart.setOption({
          series: [{
            // 根据名字对应到相应的系列
            name: '',
            data: chartData,
            // itemStyle: bool ? {
            //   color: '#6cffec',
            // } : null
          }],
        });
      });
    }
    this.setState({
      summaryDate: {
        startDate,
        endDate,
      },
      // toggleMiniTimeLine: true
    });
  }

  fetchPBAnalyze = async (caseId, params, componentProps, initPageCount) => {
    const res = await this.props.searchPBAnalyze(caseId, params, false, componentProps && componentProps.url, true);
    if (res.data.length > 0 && initPageCount < pageCount) {
      initPageCount += res.data.length;
      this.page += 1;
      const params = { ...this.props.criteria, page: this.page};
      this.fetchPBAnalyze(caseId, params, componentProps, initPageCount);
      this.setState({
        initPageCount
      })
    }
  }

  async componentWillReceiveProps(nextProps) {
    this.windowScroller.updatePosition();
    if (nextProps.criteria && Object.keys(nextProps.criteria).length !== 0 && this.state.criteria !== nextProps.criteria) {
      let {initPageCount} = this.state;
      this.codeColorIndex = 0;
      this.codeColors = {};
      console.log(this.codeColors);
      const params = Object.assign({}, nextProps.criteria);
      const daily_rec = nextProps.criteria.daily_rec;
      const orderBy = nextProps.criteria['order-by'];
      delete params.daily_rec;
      delete params['order-by'];
      const payload = { criteria: { ...params }, view: { 'order-by': orderBy }, adhoc: { daily_rec } };
      initPageCount = 0;
      this.page = 2;
      this.props.searchPBAnalyze(nextProps.caseId, { ...nextProps.criteria, page: 1 }, true, nextProps.componentProps && nextProps.componentProps.url).then(res => {
        if (res.meta.success) {
          initPageCount += res.data.length;
          if (res.data.length > 0 && initPageCount < pageCount) {
            let params = { ...nextProps.criteria, page: this.page};
            this.fetchPBAnalyze(nextProps.caseId, params, nextProps.componentProps && nextProps.componentProps.url, initPageCount);
          } else {
            this.setState({
              initPageCount
            })
          }
        }
      })
      if (nextProps.componentProps && nextProps.componentProps.url) {
        this.fetchCountByDist(nextProps.caseId, {}, false);
      } else {
        // 获取缩略图数据
        console.log(nextProps.criteria);
        this.fetchCountByDist(nextProps.caseId, payload);
      }
      this.setState({
        criteria: nextProps.criteria,
        isRequest: true,
      });
      this.fetchCtLabels(nextProps.caseId);
    }
    if (nextProps.criteria && Object.keys(nextProps.criteria).length === 0) {
      this.setState({
        criteria: nextProps.criteria,
      });
    }
    // if (nextProps.labelCells) {
    //   this.setState({
    //     ctLabel: nextProps.labelCells.items,
    //   });
    // }
    if (nextProps.labelPNs) {
      this.setState({
        labelPNs: nextProps.labelPNs.items || [],
      });
    }
    if (nextProps.caseEvents) {
      this.setState({
        caseEvents: nextProps.caseEvents.items,
      });
    }
    if (nextProps.iconOnly) {
      this.state.myChart && this.state.myChart.setOption({
        tooltip: {
          position: [25, 10],
        },
      });
    } else if (this.state.myChart && !nextProps.iconOnly) {
      this.state.myChart.setOption({
        tooltip: {
          position: null,
        },
      });
    }
  }
  componentWillUnmount() {
    // this.props.toggleNav();
    this.props.clearItems();
    this.props.handleLoading(false);
    window.onscroll = null
    oldCode = null;
    this.page = 2;
    this.setState = (state, callback) => {

    };
  }
  //  数组排序
  compare(property) {
    return function (a, b) {
      const value1 = a[property];
      const value2 = b[property];
      return value1 - value2;
    };
  }
  dateFilter(item) {
    const { summaryDate } = this.state;
    if (summaryDate) {
      return moment(item.started_at).format('YYYY-MM-DD') <= summaryDate.endDate;
    }
    return null;
  }

  showNumberLabeler(id = '', num = '', rowIndex) {
    if (num) {
      this.setState({
        numberLabelerConfig: {
          visible: true,
          caseId: id,
          num,
          rowIndex,
        },
      });
      this.num = num;
    } else {
      this.setState({
        numberLabelerConfig: {
          visible: !this.state.numberLabelerConfig.visible,
          caseId: id,
          num,
          rowIndex: null,
        },
      });
    }
  }

  onCheckboxChange = (checked) => {
    let { ownerCodeArr, peerCodeArr } = this.state;
    ownerCodeArr = [];
    peerCodeArr = [];
    this.setState({
      showCtLoc: checked,
      ownerCodeArr,
      peerCodeArr,
    });
  }

  onTop = () => {
    scroll.scrollTo(0, {
      duration: scrollTime
    });
  }

  render() {
    const { PBAnalyze, caseId, isLoading, iconOnly, caseEvents, countMessage } = this.props;
    const { showTableMessage, hlColField, hlColValues, colValues, criteria, toggleMiniTimeLine, summaryDate, rowData } = this.state;
    let allDays = null;
    if (summaryDate) {
      allDays = new Date(summaryDate.endDate).getTime() - new Date(summaryDate.startDate).getTime();
      allDays = Math.abs(parseInt(allDays / (1000 * 60 * 60 * 24), 0));
    }
    const params = { criteria: countMessage ? countMessage(this.state.criteria, rowData) : { ...this.props.criteria }, hlColField, hlColValues, colValues };
    return (
      <Fragment>
        {/*<div style={{ display: showTableMessage ? 'block' : 'none' }}>*/}
          {/*<PBTableMessage data={params} caseId={caseId} onSubmit={this.offSelectData} fetchCountByDist={this.fetchCountByDist} />*/}
        {/*</div>*/}
        <div id="top" onClick={this.onTop}>
          {topIcon}
        </div>
        {
          PBAnalyze.length > 0 ? (
            <p style={{fontSize: '14px', textAlign: 'center'}}>共找到 <span style={{color: 'red', fontSize: '16px', fontWeight: 'bold'}}>{PBAnalyze.length / 3}</span> 次通话时间重合</p>
          ) : null
        }
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
                            <MenuProvider id="menu_id" event="handleEvent">
                              <div className={this.state.isScrollTitle ? 'p-fixed' : 'p-absolute'}>
                                <Checkbox onChange={this.onCheckboxChange}>显示地址</Checkbox>
                              </div>
                              <Loading visible={this.props.isLoading} style={{ height: 400 }} tip="加载中...">
                                <Table
                                  ref={(e) => { this.table = e; }}
                                  autoHeight
                                  width={width}
                                  height={height}
                                  headerHeight={70}
                                  rowHeight={50}
                                  rowCount={PBAnalyze.length}
                                  rowGetter={({ index }) => PBAnalyze[index]}
                                  isScrolling={isScrolling}
                                  // onScroll={onChildScroll}
                                  scrollTop={scrollTop}
                                  rowClassName={this.rowClassName}
                                  onRowMouseOver={this.onRowMouseOver}
                                  onRowRightClick={this.onRowRightClick}
                                  onColumnClick={this.onColumnClick}
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
                            {/*{PBAnalyze.length > 0 ? <ContextMenu /> : null}*/}
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
    labelPNs: state.labelPNs,
    labelCells: state.labelCells,
    caseEvents: state.caseEvents,
    PBAnalyze: state.PBAnalyze.items || [],
    PBAnalyzes: state.PBAnalyze,
    caseId: state.cases.case.id,
    isLoading: state.PBAnalyze.isLoading,
    iconOnly: state.cases.iconOnly,
    ext: state.PBAnalyze.ext,
    search: state.search,
  };
};

const mapDispatchToProps = {
  getPBAnalyze,
  toggleNav,
  clearItems,
  searchPBAnalyze,
  handleLoading,
};
const withReducer = injectReducer({ key: 'PBAnalyze', reducer: PBAnalyzeReducer });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);


export default compose(
  withReducer,
  withConnect,
)(PBAnalyzeList);
