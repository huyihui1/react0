import React, {Component, Fragment} from 'react';
import {
  WindowScroller,
  AutoSizer,
  Column,
  Table,
  defaultTableRowRenderer,
  CellMeasurer,
  CellMeasurerCache
} from 'react-virtualized';
import {MenuProvider, contextMenu} from 'react-contexify';
import {Balloon, Loading} from "@alifd/next";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actions as FindNewsActions} from '../../../stores/FindNews/index';
import {actions as SearchActions} from '../../../stores/SearchStore/index';
import ScrollTitle from "../../PBAnalyze/components/InfiniteScrollGrid/PBAnalyzeList";
import 'react-virtualized/styles.css';
import echarts from "echarts";
import IceLabel from '@icedesign/label';

import * as Scroll from 'react-scroll';


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

const tableTitle = [
  {
    key: 'peer_num',
    label: '号码',
    width: 140,
  },
  // {
  //   key: 'peer_cname',
  //   label: '号码标注',
  //   width: 137,
  // },
  // {
  //   key: 'owner_num_status',
  //   label: '查看',
  //   width: 137,
  // },
  {
    key: 'peer_num_attr',
    label: '归属地',
    width: 137,
  },
  {
    key: 'correlation',
    label: '与选择话单的联系数',
    width: 137,
  },
  {
    key: 'correlation_total',
    label: '中心度',
    width: 100,
  },
  {
    key: 'owner_num',
    label: '关联人员',
    width: 220,
  },
  {
    key: 'long_time_calls',
    label: '符号条件的长时间通话',
    width: 150,
  },
  {
    key: 'long_time_call_total',
    label: '所有长时间通话',
    width: 137,
  },
  {
    key: 'first_start',
    label: '最早出现时间',
    width: 137,
  },
  {
    key: 'last_start',
    label: '最晚出现时间',
    width: 137,
  }
];

// correlation
//   :
//   "1"
// correlation_total
//   :
//   "3"
// first_start
//   :
//   "2011-07-13"
// last_start
//   :
//   "2011-07-13"
// owner_num
//   :
//   "13906648148"
// peer_num
//   :
//   "000"
// peer_num_attr
//   :

class FindNewsList extends Component {
  constructor(props) {
    super(props);
    const cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50
    });
    this.cache = cache;
    this.state = {
      isShow: false,
      findNewsData: [],
      rowIndex: -2,
      criteria: {},
      labelPNs: [],
    };
    this.setRef = this.setRef.bind(this);
    this.rowClassName = this.rowClassName.bind(this);
    this.onRowRightClick = this.onRowRightClick.bind(this);
    this.onColumnClick = this.onColumnClick.bind(this);
    this.onRowMouseOver = this.onRowMouseOver.bind(this);
    // this.onScroll = this.onScroll.bind(this);
    this.formatLabelPNsDataKey = this.formatLabelPNsDataKey.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
  }

  setRef(ref) {
    this.windowScroller = ref;
  }

  rowClassName({index}) {
    const {rowIndex, activeIndex} = this.state;
    if (index === rowIndex) {
      return 'oddRow';
    }
    // if (index === activeIndex) {
    //   return 'greenRow';
    // }
  }


  //鼠标右击列表事件
  onRowRightClick({event, index, rowData}) {
    // console.log(rowData);
    this.rowData = rowData;
    event.target.click();
  }

  onColumnClick({columnData, dataKey, event}) {
    // console.log(dataKey);
  }

  onRowMouseOver({event, index, rowData}) {
    this.setState({
      rowIndex: index,
    });
  }


  formatLabelPNsDataKey(arr, key, value) {
    let ownerCname = null;
    let peerCname = null;
    arr.forEach(item => {
      if (item[key] === value.owner_num) {
        ownerCname = {item, key: 'owner_cname'};
      } else if (item[key] === value.peer_num) {
        peerCname = {item, key: 'peer_cname'};
      }
    });
    if (ownerCname && peerCname) {
      return {ownerCname, peerCname};
    } else if (ownerCname) {
      return {ownerCname};
    } else if (peerCname) {
      return {peerCname};
    }
    return null;
  }


  cellRenderer({cellData, dataKey, rowData, rowIndex}) {
    // console.log(this.state.labelPNs);
    if (dataKey === 'owner_num') {

      if (cellData) {
        const {criteria} = this.state;
        let arr = [];
        this.state.labelPNs.forEach(item => {
          if (cellData.indexOf(item.num) !== -1) {
            cellData[cellData.indexOf(item.num)] = item
          }
        });

        let newArr = cellData.map(item => {
          if (typeof item === 'string') {
            return (
              <div style={{
                backgroundColor: criteria.owner_num && criteria.owner_num[1].indexOf(item) !== -1 ? 'yellow' : null,
                fontWeight: 'bold'
              }}>{item}</div>
            )
          } else {
            return (
              <div>
                <span style={{
                  backgroundColor: criteria.owner_num && criteria.owner_num[1].indexOf(item.num) !== -1 ? 'yellow' : null,
                  fontWeight: 'bold'
                }}>{item.num}</span>
                <IceLabel inverse={false} style={{
                  fontSize: '12px',
                  backgroundColor: item.label_bg_color,
                  color: item.label_txt_color,
                  padding: '2px'
                }}>{item.label}</IceLabel>
              </div>
            )
          }
        });
        return newArr

      } else {
        return ''
      }
    }


    if (dataKey === 'peer_num') {
      let arr = null;
      this.state.labelPNs.forEach(item => {
        if (item.num === rowData.peer_num) {
          arr = item;
        }
      });

      if (arr) {
        return (
          <div>
            <span>{cellData}</span>
            <IceLabel inverse={false} style={{
              fontSize: '12px',
              backgroundColor: arr.label_bg_color,
              color: arr.label_txt_color,
              padding: '2px'
            }}>{arr.label}</IceLabel>
          </div>
        )
      } else {
        return cellData
      }

    }

    return cellData
  }


  renderRow = ({index, parent, key, style, rowData}) => {
    console.log(rowData);
    console.log(style);
    return (
      <CellMeasurer
        key={key}
        cache={this.cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div>
          <div>132</div>
          <div>456</div>
          <div>789</div>
          {/*<div>{this.props.data[index].name}</div>*/}
          {/*<div>{this.props.data[index].email}</div>*/}
          {/*<div style={{height: `${this.props.data[index].randomHeight}px`}} />*/}
        </div>
      </CellMeasurer>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.windowScroller.updatePosition();

    if (nextProps.labelPNs) {
      this.setState({labelPNs: nextProps.labelPNs || []})
    }

    if (nextProps.criteria && JSON.stringify(nextProps.criteria) !== JSON.stringify(this.state.criteria)) {
      console.log(nextProps.criteria);
      let criteria = JSON.parse(JSON.stringify(nextProps.criteria));
      let adhoc = JSON.parse(JSON.stringify(nextProps.criteria));
      delete criteria.correlation;
      delete criteria.min_started_day;
      delete adhoc.owner_num;
      delete adhoc.peer_num_attr;
      this.props.actions.getFindNews({
        case_id: this.props.caseId,
        criteria: criteria,
        adhoc: adhoc
      });
      this.setState({
        criteria: nextProps.criteria,
      })
    }

  }

  componentWillUnmount() {
    window.onscroll = null;
    this.props.actions.clearFindNewsDataFindNews()
  }

  componentDidMount() {
    window.onscroll = () => {
      const t = document.documentElement.scrollTop || document.body.scrollTop;
      // if (Array.isArray(this.props.PBAnalyze) && this.props.PBAnalyze.length == 0) return;
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
  }

  onTop = () => {
    scroll.scrollTo(0, {
      duration: scrollTime
    });
  }

  render() {
    const {findNewsDataList} = this.props;


    return (
      <div>
        <div id="top" onClick={this.onTop}>
          {topIcon}
        </div>
        <WindowScroller ref={this.setRef} onScroll={this.onScroll}>
          {
            ({height, isScrolling, registerChild, onChildScroll, scrollTop}) => {
              return (
                <div id="windowScroller">
                  {/*{*/}
                  {/*this.state.isScrollTitle ? <ScrollTitle /> : null*/}
                  {/*}*/}
                  <AutoSizer disableHeight>
                    {
                      ({width}) => {
                        return (
                          <div ref={registerChild} onContextMenu={this.handleEvent}>
                            <MenuProvider id="menu_id">
                              <Loading visible={this.props.isLoading} style={{height: 270}} tip="加载中...">
                                <Table
                                  ref="Table"
                                  autoHeight
                                  width={width}
                                  height={height}
                                  headerHeight={70}
                                  // deferredMeasurementCache={this.cache}
                                  rowHeight={200}
                                  rowCount={findNewsDataList.length}
                                  rowGetter={({index}) => findNewsDataList[index]}
                                  isScrolling={isScrolling}
                                  // onScroll={onChildScroll}
                                  scrollTop={scrollTop}
                                  rowClassName={this.rowClassName}
                                  onRowMouseOver={this.onRowMouseOver}
                                  onRowRightClick={this.onRowRightClick}
                                  onColumnClick={this.onColumnClick}
                                  onRowDoubleClick={this.onRowDoubleClick}
                                  // rowRenderer={this.renderRow}
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
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    findNewsDataList: state.findNews.findNewsData || [],
    criteria: state.search.criteria,
    isLoading: state.findNews.showLoading,
    correlation: state.findNews.correlation || '',
    min_started_day: state.findNews.min_started_day,
    loc_type: state.findNews.loc_type,
    labelPNs: state.labelPNs.items
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...FindNewsActions, ...SearchActions}, dispatch),
  }),
)(FindNewsList);
