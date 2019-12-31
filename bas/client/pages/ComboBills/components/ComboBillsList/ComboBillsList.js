import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import solarLunar from 'solarlunar';
import moment from 'moment';
import IceLabel from '@icedesign/label';
import * as Scroll from 'react-scroll';
import { WindowScroller, AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import { Loading, Balloon, Icon, Checkbox } from '@alifd/next';
import _ from 'lodash';
import { actions as bbAnalyzeActions } from '../../../../bbStores/bbAnalyze';
import { actions as bbSearchActions } from '../../../../bbStores/bbSearchStore';
import { actions as comboBillsActions } from '../../../../stores/comboBills';
import { formatWeekDay, formatSameCity, formatTrxClass } from '../../../../utils/bbillsUtils';
import { isCellTowerCode } from '../../../../gEvents';

import ScrollTitle from './components/ScrollTitle';
import SingleLocMap from '../../../common/MapComponent/SingleLocMap';

import './index.css';
import { store } from '../../../../index';


const tableTitle = [
  {
    key: 'bill_type',
    label: '类别',
    width: 60,
  },
  {
    key: 'owner_num',
    label: '本方号码',
    width: 125,
  },
  {
    key: 'owner_name',
    label: '本方户名',
    width: 80,
  },
  {
    key: 'activity_type',
    label: '类型',
    width: 50,
  },
  {
    key: 'amt_or_duration',
    label: '时长/交易额',
    width: 100,
  },
  {
    key: 'bls',
    label: '余额',
    width: 100,
  },
  {
    key: 'peer_num',
    label: '对方号码',
    width: 125,
  },
  {
    key: 'peer_name',
    label: '对方户名',
    width: 80,
  },
  {
    key: 'peer_branch_or_loc',
    label: '对方行名/对方归属地',
    width: 125,
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
    key: 'weekday',
    label: '周几',
    width: 30,
  },
  {
    key: 'trx_branch_or_ocl',
    label: '机构名称/本方通话地',
    width: 100,
  },
  {
    key: 'trx_teller_or_owner_ct',
    label: '柜员号/本方基站',
    width: 120,
  },
  {
    key: 'trx_branch_num_or_pcl',
    label: '机构号/对方通话地',
    width: 110,
  },
  {
    key: 'memo',
    label: '备注/对方基站',
    width: 120,
  },
  {
    key: 'same_city',
    label: '外地/通话状态',
    width: 50,
  },
];

// 回到顶部动画设置, 值越小越快
const scrollTime = 300;
const scroll = Scroll.animateScroll;

const pageCount = 100;

const topIcon = (
  <svg t="1569296853164"
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="3812"
    width="32"
    height="32"
  >
    <path
      d="M796.422846 524.478323 537.312727 265.185862c-6.368176-6.39914-14.688778-9.471415-22.976697-9.407768-1.119849-0.096331-2.07972-0.639914-3.19957-0.639914-4.67206 0-9.024163 1.087166-13.023626 2.879613-4.032146 1.536138-7.87163 3.872168-11.136568 7.135385L227.647682 524.27706c-12.512727 12.480043-12.54369 32.735385-0.032684 45.248112 6.239161 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.624056-9.34412L479.1356 363.426421l0 563.712619c0 17.695686 14.336138 31.99914 32.00086 31.99914s32.00086-14.303454 32.00086-31.99914L543.13732 361.8576l207.91012 207.73982c6.240882 6.271845 14.496116 9.440452 22.687703 9.440452s16.319527-3.103239 22.560409-9.311437C808.870206 557.277355 808.902889 536.989329 796.422846 524.478323z"
      p-id="3813"
      fill="#8a8a8a"
    />
    <path
      d="M864.00258 192 160.00258 192c-17.664722 0-32.00086-14.336138-32.00086-32.00086S142.337858 128 160.00258 128l704 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.698266 192 864.00258 192z"
      p-id="3814"
      fill="#8a8a8a"
    />
  </svg>
);


class ComboBillsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rowIndex: -2,
      params: null,
      isScrollTitle: false,
      isLoading: false,
      initPageCount: 0,
      isRequest: true,
      showCtLoc: false,
      ownerCodeArr: [],
      peerCodeArr: [],
    };
    this.startedDay = null;
  }

  onTop = () => {
    scroll.scrollTo(0, {
      duration: scrollTime,
    });
  }

  rowClassName = ({ index }) => {
    const { rowIndex } = this.state;
    if (index === rowIndex) {
      return 'oddRow';
    }
  }
  onRowMouseOver = ({ event, index, rowData }) => {
    this.setState({
      rowIndex: index,
    });
  }

  _setRef = windowScroller => {
    this.windowScroller = windowScroller;
  };

  clickHandler = () => {

  }

  onOwnerCodeChange = (code, rowIndex) => {
    const { ownerCodeArr, showCtLoc } = this.state;
    if (ownerCodeArr.indexOf(code + rowIndex) === -1) {
      ownerCodeArr.push(code + rowIndex);
    } else {
      _.pull(ownerCodeArr, code + rowIndex);
    }
    this.setState({
      ownerCodeArr,
    }, () => {
      this.table.forceUpdateGrid();
    });
  }

  onPeerCodeChange = (code, rowIndex) => {
    const { peerCodeArr, showCtLoc } = this.state;
    if (peerCodeArr.indexOf(code + rowIndex) === -1) {
      peerCodeArr.push(code + rowIndex);
    } else {
      _.pull(peerCodeArr, code + rowIndex);
    }
    this.setState({
      peerCodeArr,
    }, () => {
      this.table.forceUpdateGrid();
    });
  }

  cellRenderer = ({ cellData, dataKey, rowData, rowIndex }) => {
    switch (dataKey) {
      case 'bill_type':
        if (cellData == 1) {
          return '通话';
        } else if (cellData == 2) {
          return '短信';
        } else if (cellData == 3) {
          return '彩信';
        }
        return cellData;

      case 'owner_num':
        if (rowData.type === 'bbill') {
          return <span title={cellData}>{cellData.substr(cellData.length - 5)}</span>;
        }
        return cellData;

      case 'peer_num':
        if (rowData.type === 'bbill') {
          return <span title={cellData}>{cellData.substr(cellData.length - 5)}</span>;
        }
        return cellData;

      case 'activity_type':
        if (rowData.trx_direction !== -1) {
          if (rowData.trx_direction === 1) {
            return (
              <span className="red">{formatTrxClass(cellData)}</span>
            );
          } else if (rowData.trx_direction === 2) {
            return (
              <span className="blue">{formatTrxClass(cellData)}</span>
            );
          }
          return cellData;
        }
        return this.trans_comm_direction(cellData);

      case 'amt_or_duration':
        const currency = rowData.currency === 'cny' ? '' : rowData.currency;
        if (rowData.trx_amt_class === 5) {
          return (
            <span className="blue" >{cellData} {currency}</span>
          );
        } else if (rowData.trx_amt_class === 6) {
          return (
            <span className="yellow" >{cellData} {currency}</span>
          );
        } else if (rowData.trx_amt_class > 6) {
          return (
            <span className="red" >{cellData} {currency}</span>
          );
        }
        return <span >{cellData} {currency}</span>;
      case 'bls':
        return cellData === -1 ? '' : cellData;
      case 'started_day':
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
        const date = new Date(cellData);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const solar2lunarData = solarLunar.solar2lunar(year, month, day);
        if (rowIndex === 0) {
          this.startedDay = cellData;
          const res = [];
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
          return <div style={{ color: 'blue', fontWeight: 'bold' }} title={`${solar2lunarData.monthCn}${solar2lunarData.dayCn}`} labeldata={`${JSON.stringify({ time: `${rowData.started_day} ${rowData.started_time}` })}`} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData}</div>;
        }
        if (this.startedDay !== cellData) {
          this.startedDay = cellData;
          const res = [];
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
      case 'weekday':
        const week = formatWeekDay(cellData);
        if (week === '六' || week === '日') {
          return (
            <span className="blue">{week}</span>
          );
        }
        return week;

      case 'same_city':
        if (rowData.type === 'bbill') {
          const sameCity = formatSameCity(cellData);
          if (sameCity === '外地') {
            return (
              <span className="blue">{sameCity}</span>
            );
          }
          return sameCity;
        }
        if (cellData === 0) {
          return '其他';
        } else if (cellData === 1) {
          return '本地';
        } else if (cellData === 2) {
          return '漫游';
        }
        return '';


      case 'trx_teller_or_owner_ct':
        if (isCellTowerCode(cellData)) {
          const { showCtLoc, ownerCodeArr } = this.state;
          const ele = () => {
            if (showCtLoc) {
              if (ownerCodeArr.indexOf(cellData + rowIndex) !== -1) {
                return (
                  <div className='ctLocText' onClick={() => { this.onOwnerCodeChange(cellData, rowIndex); }}>
                    {cellData}
                  </div>
                );
              }
              return (
                <div className='ctLocText' onClick={() => { this.onOwnerCodeChange(cellData, rowIndex); }}>
                  {rowData.owner_ct_dist + rowData.owner_ct_town}
                </div>
              );
            } else {
              if (ownerCodeArr.indexOf(cellData + rowIndex) !== -1) {
                return (
                  <div className='ctLocText' onClick={() => { this.onOwnerCodeChange(cellData, rowIndex); }}>
                    {rowData.owner_ct_dist + rowData.owner_ct_town}
                  </div>
                );
              }
              return (
                <div className='ctLocText' onClick={() => { this.onOwnerCodeChange(cellData, rowIndex); }}>
                  {cellData}
                </div>
              );
            }
          };


          return (
            <Balloon align="l"
              shouldUpdatePosition
              autoFocus={false}
              // triggerType={'click'}
              trigger={ele()}
              closable={false}
            >
              <div>
                <SingleLocMap code={cellData} />
              </div>
            </Balloon>
          );
        }
        return cellData;

      case 'memo':
        if (isCellTowerCode(cellData)) {
          const { showCtLoc, peerCodeArr } = this.state;
          const ele = () => {
            if (showCtLoc) {
              if (peerCodeArr.indexOf(cellData + rowIndex) !== -1) {
                return (
                  <div className='ctLocText' onClick={() => { this.onPeerCodeChange(cellData, rowIndex); }}>
                    {cellData}
                  </div>
                );
              }
              return (
                <div className='ctLocText' onClick={() => { this.onPeerCodeChange(cellData, rowIndex); }}>
                  {rowData.peer_ct_dist + rowData.peer_ct_town}
                </div>
              );
            } else {
              if (peerCodeArr.indexOf(cellData + rowIndex) !== -1) {
                return (
                  <div className='ctLocText' onClick={() => { this.onPeerCodeChange(cellData, rowIndex); }}>
                    {rowData.peer_ct_dist + rowData.peer_ct_town}
                  </div>
                );
              }
              return (
                <div className='ctLocText' onClick={() => { this.onPeerCodeChange(cellData, rowIndex); }}>
                  {cellData}
                </div>
              );
            }
          };
          return (
            <Balloon align="l"
              shouldUpdatePosition
              autoFocus={false}
              trigger={ele()}
              closable={false}
            >
              <div>
                <SingleLocMap code={cellData} />
              </div>
            </Balloon>
          );
        }
        return <span className="ctLocText" title={cellData}>{cellData}</span>;

      default:
        return cellData;
    }
  }

  fetchData = (params) => {
    const { caseId, actions } = this.props;
    let { initPageCount } = this.state;
    this.setState({
      isLoading: true,
    });
    initPageCount = 0;
    actions.getComboBills({ case_id: caseId, ...params }).then(res => {
      if (res.body.meta.success) {
        initPageCount += res.body.data.length;
        if (res.body.data.length > 0 && initPageCount < pageCount) {
          this.getComboBills(initPageCount);
        }
        this.setState({
          initPageCount,
          isLoading: false,
        });
      }
    });
  }

  getComboBills = async (initPageCount) => {
    const { actions, caseId, search } = this.props;
    const params = { ...search.params, last_combo_day: search.last_combo_day };
    const res = await actions.getPagingComboBills({ case_id: caseId, ...params });
    initPageCount += res.body.data.length;
    this.setState({
      initPageCount,
    });
    if (res.body.data.length > 0 && initPageCount < pageCount) {
      this.getComboBills(initPageCount);
    }
  }

  trans_comm_direction = (value) => {
    const comm_direction = value;
    if (comm_direction == 0) {
      return '未知';
    } else if (comm_direction == 11) {
      return '主叫';
    } else if (comm_direction == 12) {
      return '<---';
    } else if (comm_direction == 13) {
      return '呼转';
    } else if (comm_direction == 21) {
      return '主短';
    } else if (comm_direction == 22) {
      return '被短';
    } else if (comm_direction == 31) {
      return '主彩';
    } else if (comm_direction == 32) {
      return '被彩';
    }
    return '';
  }

  componentDidMount() {
    this.props.getWindowScroller(this.windowScroller);
    window.onscroll = () => {
      const t = document.documentElement.scrollTop || document.body.scrollTop;
      if (Array.isArray(this.props.comboBillsItems) && this.props.comboBillsItems.length == 0) return;
      const topDom = document.getElementById('top');
      if (t > 500) {
        topDom.classList.add('show');
      } else {
        topDom.classList.remove('show');
      }
    };
    window.addEventListener('resize', this.updateWindowScroller);
  }

  updateWindowScroller = () => {
    this.windowScroller && this.windowScroller.updatePosition();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search) {
      if (nextProps.search.params && JSON.stringify(nextProps.search.params) !== JSON.stringify(this.state.params)) {
        this.fetchData(nextProps.search.params);
        this.setState({
          params: {...nextProps.search.params}
        })
      } else if (nextProps.search.params === null && nextProps.search.isSearch === false) {
        this.setState({
          params: null
        })
      }

    }
  }


  componentWillUnmount() {
    this.props.actions.clearAnalyzes();
    this.props.actions.clearSearchComboBills();
    window.onscroll = null;
    window.removeEventListener('resize', this.updateWindowScroller);
  }

  onScroll = ({ scrollTop }) => {
    const bodyScrollHeight = document.body.scrollHeight;
    if (scrollTop > 0 && this.props.comboBillsItems.length > 0) {
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
    if ((scrollTop > bodyScrollHeight / 2 || document.documentElement.scrollTop > bodyScrollHeight / 2) && this.state.isRequest && this.state.params) {
      const { actions, caseId, search } = this.props;
      let params = { ...search.params, last_combo_day: search.last_combo_day };
      if (this.props.pagingType) {
        params = this.props.pagingType(this.props.comboBillsItems);
      } else if (this.state.initPageCount < pageCount) {
        return;
      }
      actions.getPagingComboBills({ case_id: caseId, ...params }).then(res => {
        if (res.body.meta.success) {
          if (res.body.data.length > 0) {
            this.setState({
              isRequest: true,
            });
          } else {
            this.setState({
              isRequest: false,
            });
          }
        }
      });
      this.setState({
        isRequest: false,
      });
      console.log('继续请求数据');
    }
  }

  rowRenderer(data) {
    const rowData = data.rowData;
    if (rowData.type === 'bbill') {
      data.style = { ...data.style, background: '#f5efaf', borderBottom: '1px solid #cecaca' };
    }
    return defaultTableRowRenderer(data);
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

  render() {
    const { comboBillsItems } = this.props;
    return (
      <Fragment>
        <div id="top" onClick={this.onTop}>
          {topIcon}
        </div>
        <WindowScroller ref={this._setRef} onScroll={this.onScroll}>
          {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => {
            return (
              <div id="comboBillsWindowScroller">
                {
                  this.state.isScrollTitle ? <ScrollTitle /> : null
                }
                <div className={this.state.isScrollTitle ? 'p-fixed' : 'p-absolute'} style={{right: '70px'}}>
                  <Checkbox onChange={this.onCheckboxChange}>显示地址</Checkbox>
                </div>
                <AutoSizer disableHeight>
                  {
                    ({ width }) => {
                      return (
                        <div ref={registerChild} onContextMenu={this.handleEvent}>
                          <Loading visible={this.state.isLoading} style={{ height: 400 }} tip="加载中...">
                            <Table
                              ref={(e) => { this.table = e; }}
                              autoHeight
                              width={width}
                              height={height}
                              headerHeight={70}
                              rowHeight={50}
                              rowCount={comboBillsItems.length}
                              rowGetter={({ index }) => comboBillsItems[index]}
                              isScrolling={isScrolling}
                              // onScroll={onChildScroll}
                              scrollTop={scrollTop}
                              rowClassName={this.rowClassName}
                              onRowMouseOver={this.onRowMouseOver}
                              // onRowRightClick={this.onRowRightClick}
                              // onColumnClick={this.onColumnClick}
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
                        </div>
                      );
                    }
                  }
                </AutoSizer>
              </div>
            );
          }}
        </WindowScroller>
      </Fragment>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.comboBills,
    route: state.route,
    comboBillsItems: state.comboBills.items,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...bbAnalyzeActions, ...bbSearchActions, ...comboBillsActions }, dispatch),
  }),
)(ComboBillsList);
