import React, {Component, Fragment} from 'react';
import IceContainer from '@icedesign/container';
import {Icon} from '@alifd/next';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Responsive, WidthProvider} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'
import {actions as searchStoreActions} from '../../../bbStores/bbSearchStore';
import appConfig from '../../../appConfig'
import * as Scroll from 'react-scroll';



import GroupByPeeracct from './components/GroupByPeeracct'
import GroupByTrxclass from './components/GroupByTrxclass'
import GroupByTrxAmtClass from './components/GroupByTrxAmtClass'
import GroupByDigest from './components/GroupByDigest'
import GroupByTrxChannel from './components/GroupByTrxChannel'
import GroupByPeeracctandtrxamtclass from './components/GroupByPeeracctandtrxamtclass'
import GroupByPeeracctandtrxtimel1class from './components/GroupByPeeracctandtrxtimel1class'
import GroupByOwneracct from './components/GroupByOwneracct'
import GroupByOwneracctandtrxamtclass from './components/GroupByOwneracctandtrxamtclass'
import GroupByOwneracctandtrxtimel1class from './components/GroupByOwneracctandtrxtimel1class'
import GroupByBranchnum from './components/GroupByBranchnum'
import GroupByTeller from './components/GroupByTeller'
import GroupByBranchNumAndTimeL1 from './components/GroupByBranchNumAndTimeL1'
import GroupByBranchNumAndHour from './components/GroupByBranchNumAndHour'
import GroupByTellerAndTimeL1 from './components/GroupByTellerAndTimeL1'
import GroupByTellerAndHour from './components/GroupByTellerAndHour'
import GroupByTrxTimeL1Class from './components/GroupByTrxTimeL1Class'
import GroupByTrxHourClass from './components/GroupByTrxHourClass'
import Trxamtclassandtrxtimel1class from './components/Trxamtclassandtrxtimel1class'
import GroupByTrxDay from './components/GroupByTrxDay'
import GroupByTrxDayAndTimeL1 from './components/GroupByTrxDayAndTimeL1'
import GroupByWeekday from './components/GroupByWeekday'
import GroupByPeeracctandtrxtimel1classandhour from './components/GroupByPeeracctandtrxtimel1classandhour';


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
);;


const chartComponent = [
  {
    name: '对方账户',
    component: GroupByPeeracct,
    index: 'A1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '对方账户vs金额种类',
    component: GroupByPeeracctandtrxamtclass,
    index: 'A2',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '对方账户vs交易时段',
    component: GroupByPeeracctandtrxtimel1class,
    index: 'A3',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {//出自小胡之手 A4报表
    name: '对方账户vs交易时段(小时)',
    component :GroupByPeeracctandtrxtimel1classandhour,
    index: 'A4',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h :30,
    },
    height: '500px',
  },
  {
    name: '机构号',
    component: GroupByBranchnum,
    index: 'B1',
    height: '500px',
  },
  {
    name: '柜员号',
    component: GroupByTeller,
    index: 'B2',
    height: '500px',
  },
  {
    name: '机构号vs交易时段',
    component: GroupByBranchNumAndTimeL1,
    index: 'B3',
    height: '500px',
  },
  {
    name: '机构号vs交易时段(小时)',
    component: GroupByBranchNumAndHour,
    index: 'B4',
    height: '500px',
  },
  {
    name: '柜员号vs交易时段',
    component: GroupByTellerAndTimeL1,
    index: 'B5',
    height: '500px',
  },
  {
    name: '柜员号vs交易时段(小时)',
    component: GroupByTellerAndHour,
    index: 'B6',
    height: '500px',
  },
  {
    name: '本方账户',
    component: GroupByOwneracct,
    index: 'C1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '本方账户vs金额种类',
    component: GroupByOwneracctandtrxamtclass,
    index: 'C2',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '本方账户vs交易时段',
    component: GroupByOwneracctandtrxtimel1class,
    index: 'C3',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '本方账户vs交易时段(小时)',
    component: GroupByOwneracctandtrxtimel1class,
    index: 'C4',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '交易类型',
    component: GroupByTrxclass,
    index: 'F1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '金额种类',
    component: GroupByTrxAmtClass,
    index: 'F2',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '交易摘要',
    component: GroupByDigest,
    index: 'F3',
    height: '500px',
  },
  {
    name: '交易渠道',
    component: GroupByTrxChannel,
    index: 'F4',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '一周分布',
    component: GroupByWeekday,
    index: 'H1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '日期vs交易时段',
    component: GroupByTrxDayAndTimeL1,
    index: 'H3',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '交易时段',
    component: GroupByTrxTimeL1Class,
    index: 'G1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '交易时段(小时)',
    component: GroupByTrxHourClass,
    index: 'G2',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '交易时段vs金额种类',
    component: Trxamtclassandtrxtimel1class,
    index: 'G3',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30,
    },
    height: '500px',
  },
  {
    name: '交易日期',
    component: GroupByTrxDay,
    index: 'H2',
    height: '1200px',
  },
];

function random(start, end) {
  return Math.floor(Math.random() * (end - start) + start);
}

function generateLayout() {
  const data = [...Array(25).keys()];

  return data.map((item, i) => {
    const y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
    };
  });
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class BBStatOverview extends Component {
  static displayName = 'BBStatOverview';
  static propTypes = {};
  static defaultProps = {
    className: 'layout',
    rowHeight: 30,
    onLayoutChange() {
      if (document.createEvent) {
        let event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, true);
        window.dispatchEvent(event);
      } else if (document.createEventObject) {
        window.fireEvent('onresize');
      }
    },
    cols: { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 },
    initialLayout: generateLayout(),
  };

  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: 'lg',
      compactType: 'vertical',
      mounted: true,
      layouts: { lg: this.props.initialLayout },
      chartView: [],
      showSimplePbillRecordList: false,
    };
    this.page = null;
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.fixGridOptions = this.fixGridOptions.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
  }

  componentDidMount() {
    // const evt = document.createEvent('HTMLEvents');
    // evt.initEvent('resize', false, false);
    // window.dispatchEvent(evt);
    // this.fetchCaseBreakpointData()

    console.log(this.props);


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

  onCheckboxChange(value) {
    this.props.actions.setChartViewBbSearch(value);
  }

  componentWillReceiveProps(nextProps) {//BBStatOverview在这里展示出对应的界面
    // console.log(this.props)
     console.log(nextProps)
    if (nextProps.chartView && nextProps.chartView !== this.state.chartView) {
      console.log(nextProps.chartView);
      this.setState({
        chartView: nextProps.chartView,
      });
    }
  }

  componentWillUnmount() {
    this.props.actions.setChartViewBbSearch([]);
    this.props.actions.clearParamsBbSearch();
    window.onscroll = null;
    // this.props.actions.toggleSimplePbillRecordList(false, null);
    this.page = null;
  }

  fixGridOptions(data, chartView) {
    let newChartView = [...chartView];
    let w = 0;
    let rowSum = 0;
    chartComponent.forEach(item => {
      if (chartView.indexOf(item.name) > -1) {
        newChartView[chartView.indexOf(item.name)] = { gridOptions: item.gridOptions };
      }
    });
    newChartView = newChartView.filter((item, index) => {
      return item.gridOptions;
    });setChartViewSearch
    for (let i = 0; i < newChartView.length; i++) {
      if (i > 0) {
        w = newChartView[i - 1].gridOptions.w + w;
      }
      if (12 - w < newChartView[i].gridOptions.w) {
        data.x = 0;
        w = 0;
        rowSum += 1;
      }
      if (data.name === chartView[i]) {
        data.gridOptions.x = w;
        data.gridOptions.y = 15 * rowSum;
        break;
      }
    }
    return data.gridOptions;
  }

  removeListItem(name) {
    const { chartView } = this.state;
    if (chartView.indexOf(name) != -1) {
      chartView.splice(chartView.indexOf(name), 1);
    }
    this.props.actions.setChartViewSearch(chartView);
  }

  onResize(layout, oldLayoutItem, layoutItem, placeholder) {
    // layoutItem.w = oldLayoutItem.w;
  }

  fetchCaseBreakpointData = (caseId = this.props.caseId) => {
    const { actions } = this.props;
    console.log(actions);
    actions.fetchCaseBreakpoints({ caseId }, {
      query: {
        page: 1,
        pagesize: appConfig.largePageSize,
      },
    });
    this.setState({
      caseId,
    });
  }

  onTop = () => {
    scroll.scrollTo(0, {
      duration: scrollTime,
    });
  }


  render() {
    const { bbSearchs } = this.props;
    return (
      <Fragment>
        <div id="top" onClick={this.onTop}>
          {topIcon}
        </div>
        {
          bbSearchs.chartView.length > 0 ? (
            <IceContainer>
              {
                chartComponent.map((item, index) => {
                  if (this.state.chartView.indexOf(`${item.index  }-${  item.name}`) !== -1) {
        
                    return (
                      <div className="chart-box"
                        key={item.name}
                        style={{
                             // display: bbSearchs.criteria && Object.keys(bbSearchs.criteria).length > 0 ? 'flex' : 'none',
                             backgroundColor: '#f5f5f5',
                             marginTop: '10px',
                           }}
                      >
                        {
                          <item.component title={`${item.index  }-${  item.name}`} />
                        }
                      </div>
                    );
                  }
                  return <Fragment key={item.name + index} />;
                })
              }
            </IceContainer>
          ) : null
        }
      </Fragment>

    );
  }
}

export default connect(
  state => ({
    caseId: state.cases.case.id,
    search: state.search,
    bbSearchs: state.bbSearchs,
    chartView: state.bbSearchs.chartView,
  }),
  dispatch => ({
    actions: bindActionCreators({ ...searchStoreActions }, dispatch),
  }),
)(BBStatOverview);

