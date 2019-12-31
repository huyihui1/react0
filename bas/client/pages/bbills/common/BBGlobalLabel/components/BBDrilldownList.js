import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import solarLunar from 'solarlunar';
import moment from 'moment';
import IceLabel from '@icedesign/label';
import * as Scroll from 'react-scroll';
import { WindowScroller, AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import { Loading, Balloon, Icon, Checkbox } from '@alifd/next';
import { actions as bbAnalyzeActions } from '../../../../../bbStores/bbAnalyze';
import { actions as bbSearchActions } from '../../../../../bbStores/bbSearchStore';
import {formatWeekDay, formattrxChannel, formatTrxClass} from '../../../../../utils/bbillsUtils';
import BankCardSimple from '../../../common/BankCardSimple'
import BankCardFull from '../../../common/BankCardFull'



const pageCount = 100;

const tableTitle = [
  {
    key: 'owner_card_num', // owner_card_num / owner_bank_acct 卡号优先显示
    label: '本方账户',
    width: 150,
  },
  {
    key: 'owner_name',
    label: '本方户名',
    width: 125,
  },
  {
    key: 'trx_direction',
    label: '状态',
    width: 40,
  },
  {
    key: 'trx_class',
    label: '类型',
    width: 50,
  },
  {
    key: 'digest',
    label: '摘要',
    width: 60,
  },
  {
    key: 'trx_amt',
    label: '交易额',
    width: 100,
  },
  {
    key: 'currency',
    label: '币种',
    width: 50,
  },
  {
    key: 'bls',
    label: '余额',
    width: 100,
  },
  {
    key: 'peer_card_num', // peer_card_num / peer_bank_acct
    label: '对方账户',
    width: 150,
  },
  {
    key: 'peer_name',
    label: '对方户名',
    width: 125,
  },
  {
    key: 'trx_day',
    label: '日期',
    width: 120,
  },
  {
    key: 'trx_time',
    label: '时间',
    width: 60,
  },
  {
    key: 'weekday',
    label: '周几',
    width: 30,
  },
  {
    key: 'trx_branch_num',
    label: '机构号',
    width: 80,
  },
  {
    key: 'trx_branch',
    label: '机构名称',
    width: 100,
  },
  {
    key: 'teller_code',
    label: '柜员号',
    width: 80,
  },
  {
    key: 'trx_channel',
    label: '渠道',
    width: 80,
  },
  {
    key: 'memo',
    label: '备注',
    width: 120,
  },
];

// 回到顶部动画设置, 值越小越快
const scrollTime = 300;
const scroll = Scroll.animateScroll;

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


class BBDrilldownList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rowIndex: -2,
      params: null,
      isScrollTitle: false,
      isLoading: false,
      isRequest: true,
      componentPropsOpt: null,
      scrollToIndex:-1
    };
    this.startedDay = null;
    this.page = 1
  }

  onTop = () => {
    scroll.scrollTo(0, {
      duration: scrollTime
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

  cellRenderer = ({ cellData, dataKey, rowData, rowIndex }) => {
    if (dataKey === 'owner_name' || dataKey === 'peer_name') {
      return <div style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis',overflow: 'hidden'}} title={cellData}>{cellData}</div>
    }
    switch (dataKey) {
      case 'owner_card_num':
        let ownerVal = cellData || rowData.owner_bank_acct;
        return (
          <Balloon align="t"
                   closable={false}
                   // triggerType="click"
                   trigger={
                     <div>
                       <BankCardSimple card={ownerVal} num={rowData.owner_card_num} acct={rowData.owner_bank_acct} card_type={rowData.owner_card_type} bankCode={rowData.owner_bank_code} />
                     </div>
                   }
          >
            <BankCardFull
              card={ownerVal}
              card_type={rowData.owner_card_type}
              bankCode={rowData.owner_bank_code}
              bankName={rowData.owner_bank_name}
              userName={rowData.owner_name}
            />
          </Balloon>
        )
      case 'peer_card_num':
        let val = cellData || rowData.peer_bank_acct;
        if (!val) return
        return (
          <Balloon align="t"
                   closable={false}
            // triggerType="click"
                   trigger={
                     <div>
                       <BankCardSimple card={val} num={rowData.peer_card_num} acct={rowData.peer_bank_acct} card_type={rowData.peer_card_type} bankCode={rowData.peer_bank_code} />
                     </div>
                   }
          >
            <BankCardFull
              card={val}
              card_type={rowData.peer_card_type}
              bankCode={rowData.peer_bank_code}
              bankName={rowData.peer_bank_name}
              userName={rowData.peer_name}
            />
          </Balloon>
        )
      case 'trx_direction':
        if (cellData === 1) {
          return (
            <span className='red'>存</span>
          )
        } else if (cellData === -1) {
          return (
            <span className='green'>取</span>
          )
        } else {
          return ''
        }
      case 'trx_class':
        return (
          <span>{formatTrxClass(cellData)}</span>
        )
      case 'currency':
        if (cellData === 'cny' || cellData === 'CNY') {
          return
        } else {
          return (
            <span className='blue'>{cellData}</span>
          )
        }
      case 'trx_amt':
        if (rowData.trx_amt_class === 5) {
          return (
            <span className='blue' >{cellData}</span>
          )
        } else if (rowData.trx_amt_class === 6) {
          return (
            <span className='yellow' >{cellData}</span>
          )
        } else if (rowData.trx_amt_class > 6) {
          return (
            <span className='red' >{cellData}</span>
          )
        }
        return cellData
      case 'trx_day':
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
        if (rowIndex === 0) {
          this.startedDay = cellData;
          const res = []
          if (res.length > 0) {
            return (
              <Balloon align="l"
                       closable={false}
                       trigger={
                         <div style={{ color: 'blue', fontWeight: 'bold' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>
                           <div style={{ display: 'inline-block', position: 'relative' }} labeldata={`${JSON.stringify({ time: `${rowData.trx_day} ${rowData.trx_time}` })}`}>
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
          return <div style={{ color: 'blue', fontWeight: 'bold' }} labeldata={`${JSON.stringify({ time: `${rowData.trx_day} ${rowData.trx_time}` })}`} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData}</div>;
        }
        const date = new Date(cellData);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const solar2lunarData = solarLunar.solar2lunar(year, month, day);
        if (this.startedDay !== cellData) {
          this.startedDay = cellData;
          const res = []
          if (res.length > 0) {
            return (
              <Balloon align="l"
                       closable={false}
                       trigger={
                         <div style={{ color: 'blue', fontWeight: 'bold' }} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>
                           <div style={{ display: 'inline-block' }} labeldata={`${JSON.stringify({ time: `${rowData.trx_day} ${rowData.trx_time}` })}`}>
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
          return <div style={{ color: 'blue', fontWeight: 'bold' }} labeldata={`${JSON.stringify({ time: `${rowData.trx_day} ${rowData.trx_time}` })}`} title={`${solar2lunarData.monthCn}${solar2lunarData.dayCn}`}>{cellData}</div>;
        } else if (this.startedDay === cellData) {
          return <div style={{ color: '#bdb5b5' }} title={`${solar2lunarData.monthCn}${solar2lunarData.dayCn}`} labeldata={`${JSON.stringify({ time: `${rowData.trx_day} ${rowData.trx_time}` })}`} onClick={(e) => { this.clickHandler(e, rowData, cellData, dataKey); }}>{moment(cellData).format('YYMM.DD日')}</div>;
        }
      case 'weekday':
        let week = formatWeekDay(cellData)
        if (week === '六' || week === '日') {
          return (
            <span className="blue">{week}</span>
          )
        } else {
          return week
        }
      case 'trx_channel':
        const trxChannel = formattrxChannel(cellData)
        if (trxChannel === '现场') {
          return (
            <span className="blue">{trxChannel}</span>
          )
        } else {
          return trxChannel
        }
      case 'trx_branch_num':
        return <span className="ctLocText" title={cellData} labeldata={JSON.stringify({branch_num: cellData})}>{cellData}</span>
      case 'teller_code':
        return <span className="ctLocText" title={cellData} labeldata={JSON.stringify({branch_num: rowData.trx_branch_num, teller_code: cellData})}>{cellData}</span>
      case 'trx_branch':
        return <span className="ctLocText" title={cellData}>{cellData}</span>
      case 'memo':
        return <span className="ctLocText" title={cellData}>{cellData}</span>
      default:
        return cellData
    }
  }

  fetchData = (params) => {
    const {caseId, actions, search} = this.props;
    let {initPageCount} = this.state;
    this.setState({
      isLoading: true
    })
    initPageCount = 0;
    this.page = 1;
    let criteria = {
      ...search.params.criteria,
      ...params.criteria
    }
    actions.fetchDrillDownAnalyzes({case_id: caseId, ...params, criteria}).then(res => {
      if (res.body.meta.success) {
        initPageCount += res.body.data.length;
        this.page += 1
        if (res.body.data.length > 0 && initPageCount < pageCount) {
          this.getAnalyzes(initPageCount, criteria)
        }
        this.setState({
          initPageCount,
          isLoading: false
        })
      }
    })
  }

  getAnalyzes = async (initPageCount, criteria) => {
    const {actions, caseId, search} = this.props;
    let params = { ...search.params, drilldown: true };
    params.adhoc.page = this.page;
    const res = await actions.getDrillDownPagingAnalyzes({case_id: caseId, ...params, criteria});
    initPageCount += res.body.data.length;
    this.setState({
      initPageCount
    })
    if (res.body.data.length > 0 && initPageCount < pageCount) {
      this.page += 1;
      this.getAnalyzes(initPageCount, criteria)
    }
  }

  componentDidMount() {
    if (this.props.componentProps && this.props.componentProps.opt && JSON.stringify(this.props.componentProps.opt) !== JSON.stringify(this.state.componentPropsOpt)) {
      this.fetchData(this.props.componentProps.opt)
      this.flag = true;
      this.setState({
        componentPropsOpt: JSON.parse(JSON.stringify(this.props.componentProps.opt)),
        scrollToIndex:-1
      })
    }
    if (this.props.getChildrenThis){
      this.props.getChildrenThis(this)
    }

  }


  componentWillReceiveProps(nextProps) {
    if (!this.flag && nextProps.componentProps && nextProps.componentProps.opt && JSON.stringify(nextProps.componentProps.opt) !== JSON.stringify(this.state.componentPropsOpt)) {
      this.fetchData(nextProps.componentProps.opt)
      this.setState({
        componentPropsOpt: JSON.parse(JSON.stringify(nextProps.componentProps.opt)),
        scrollToIndex:-1
      })
    }
  }


  componentWillUnmount() {
    this.props.actions.clearDrilldownAnalyzes();
    window.onscroll = null;
  }

  onScroll = ({ scrollTop }) => {
    this.setState({scrollToIndex:-1});
    const bodyScrollHeight = document.body.scrollHeight;
    if (this.props.noPaging) {
      return;
    }
    if ((scrollTop > bodyScrollHeight / 2) && this.state.isRequest && this.state.componentPropsOpt) {
      const {actions, caseId, search} = this.props;
      let params = { ...this.state.componentPropsOpt };
      params.adhoc.page = this.page;
      if (this.props.pagingType) {
        params = this.props.pagingType(this.props.bbAnalyzes, this.props.componentProps);
      } else if (this.state.initPageCount < pageCount) {
        return
      }

      let criteria = {
        ...search.params.criteria,
        ...params.criteria
      }
      actions.getPagingAnalyzes({case_id: caseId, ...params, criteria}).then(res => {
        if (res.body.meta.success) {
          this.page += 1;
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
      })
      this.setState({
        isRequest: false,
      });
      console.log('继续请求数据');
    }
  }



  render() {
    const {bbAnalyzes} = this.props;
    return (
      <Fragment>
        <div className='bb-analyze' id='bbWindowScroller'>
          <AutoSizer disableHeight>
            {
              ({ width }) => {
                return (
                  <div>
                    <Loading visible={this.state.isLoading} style={{ height: 400 }} tip="加载中...">
                      <Table
                        ref={(e) => { this.table = e; }}
                        width={width}
                        height={this.props.height || 500}
                        headerHeight={100}
                        rowHeight={50}
                        rowCount={bbAnalyzes.drilldownList.length}
                        rowGetter={({ index }) => bbAnalyzes.drilldownList[index]}
                        onScroll={this.onScroll}
                        rowClassName={this.rowClassName}
                        onRowMouseOver={this.onRowMouseOver}
                        scrollToIndex={this.state.scrollToIndex}
                        scrollToAlignment='start'
                        // onRowRightClick={this.onRowRightClick}
                        // onColumnClick={this.onColumnClick}
                        // rowRenderer={this.rowRenderer}
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
      </Fragment>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.bbSearchs,
    route: state.route,
    bbAnalyzes: state.bbAnalyzes,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...bbAnalyzeActions, ...bbSearchActions}, dispatch),
  }),
)(BBDrilldownList);
