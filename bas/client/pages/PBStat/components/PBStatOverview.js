import React, {Component, Fragment} from 'react';
import IceContainer from '@icedesign/container';
import {Icon} from '@alifd/next';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Responsive, WidthProvider} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'

import {actions as searchStoreActions} from '../../../stores/SearchStore';
import {actions as pbStatActions} from '../../../stores/pbStat';
import {actions as caseBreakpointActions} from '../../../stores/caseBreakpoint';
import JiFeiLeiXingChart from './JifeileixingChart';
import LianXiLeiXingChart from './LianXiLeiXingChart';
import TonghuaChart from './TonghuaChart';
import Ownercommloc from './Ownercommloc';
import PeercommlocChart from './PeercommlocChart';
import DurationclassChart from './DurationclassChart';
import Startedtimel1classChart from './Startedtimel1classChart';
import Startedtimel2classChart from './Startedtimel2classChart';
import StartedhourclassChart from './StartedhourclassChart';
import DurationclassAndstartedtimel1class from './DurationclassAndstartedtimel1class';
import DurationclassAndstartedtimel2class from './DurationclassAndstartedtimel2class';
import WeekdayChart from './WeekdayChart';
import Startedday from './Startedday';
import StarteddayAndstartedtimel1class from './StarteddayAndstartedtimel1class';
import StarteddayAndstartedtimel2class from './StarteddayAndstartedtimel2class';
import StarteddayAndandpeernum from './StarteddayAndandpeernum';
import StarteddayAndctcode from './StarteddayAndctcode'
import Ownernum from './Ownernum';
import OwnernumAndstartedtimel1class from './OwnernumAndstartedtimel1class';
import OwnernumAnddurationclass from './OwnernumAnddurationclass';
import OwnernumAndstartedtimel2class from './OwnernumAndstartedtimel2class';
import OwnernumAndstartedhourclass from './OwnernumAndstartedhourclass';
import OwnernumAndctandstartedhourclass from './OwnernumAndctandstartedhourclass';
import PeernumAnddurationclass from './Peernum';
import PeernumAnddurationclass2 from './PeernumAnddurationclass2';
import PeernumAndstartedtimel1class from './PeernumAndstartedtimel1class';
import PeernumAndstartedtimel2class from './PeernumAndstartedtimel2class';
import PeernumAndstartedhourclass from './PeernumAndstartedhourclass';
import Ownerctcode from './Ownerctcode';
import CodeAndstartedtimel1class from './CodeAndstartedtimel1class';
import CodeAndstartedtimel2class from './CodeAndstartedtimel2class'
import CodeAndstartedhourclass from './CodeAndstartedhourclass';
import OwnerLac from './OwnerLac';
import CodeAndstarteddurationclass from './CodeAndstarteddurationclass';
import SimplePbillRecordList from '../../PBAnalyze/components/InfiniteScrollGrid/SimplePbillRecordList';
import {toggleSimplePbillRecordList} from '../../../stores/PBAnalyze/actions';

import appConfig from '../../../appConfig'

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



const chartComponent = [
  {
    name: '计费类型',
    component: JiFeiLeiXingChart,
    index: 'F1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '500px'
  },
  {
    name: '联系类型',
    component: LianXiLeiXingChart,
    index: 'F2',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '500px'
  },
  {
    name: '通话类型',
    component: TonghuaChart,
    index: 'F3',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '500px'
  },
  {
    name: '本方通话地',
    component: Ownercommloc,
    index: 'F4',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '对方通话地(图)',
    component: PeercommlocChart,
    index: 'F5',
    gridOptions: {
      x: 3,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '时长段',
    component: DurationclassChart,
    index: 'G1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '通话时段',
    component: Startedtimel1classChart,
    index: 'G2',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '通话时段(详细)',
    component: Startedtimel2classChart,
    index: 'G3',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '通话时段(小时)',
    component: StartedhourclassChart,
    index: 'G4',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '通话时长VS通话时段',
    component: DurationclassAndstartedtimel1class,
    index: 'G5',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '通话时段(详细)vs通话时长',
    component: DurationclassAndstartedtimel2class,
    index: 'G6',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '一周分布',
    component: WeekdayChart,
    index: 'H1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '通话日期(图)',
    component: Startedday,
    index: 'H2',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '日期vs通话时段',
    component: StarteddayAndstartedtimel1class,
    index: 'H3',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '日期vs通话时段(详细)',
    component: StarteddayAndstartedtimel2class,
    index: 'H4',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '日期vs对方号码',
    component: StarteddayAndandpeernum,
    index: 'H5',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '日期vs基站',
    component: StarteddayAndctcode,
    index: 'H6',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '本方号码',
    component: Ownernum,
    index: 'C1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '本方号码vs通话时段',
    component: OwnernumAndstartedtimel1class,
    index: 'C3',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '本方号码vs通话时段(详细)',
    component: OwnernumAndstartedtimel2class,
    index: 'C4',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '本方号码vs时长类型',
    component: OwnernumAnddurationclass,
    index: 'C2',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '本方号码vs通话时段(小时)',
    component: OwnernumAndstartedhourclass,
    index: 'C5',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '基站vs本方号码(图)',
    component: OwnernumAndctandstartedhourclass,
    index: 'B7',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '对方号码',
    component: PeernumAnddurationclass,
    index: 'A1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '对方号码vs时长类型',
    component: PeernumAnddurationclass2,
    index: 'A2',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '对方号码vs通话时段',
    component: PeernumAndstartedtimel1class,
    index: 'A3',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '对方号码vs通话时段(详细)',
    component: PeernumAndstartedtimel2class,
    index: 'A4',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '对方号码vs通话时段(小时)',
    component: PeernumAndstartedhourclass,
    index: 'A5',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '基站CI(图)',
    component: Ownerctcode,
    index: 'B1',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '基站vs通话时段(图)',
    component: CodeAndstartedtimel1class,
    index: 'B2',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '基站vs通话时段(详细)(图)',
    component: CodeAndstartedtimel2class,
    index: 'B3',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '基站vs通话时段(小时)(图)',
    component: CodeAndstartedhourclass,
    index: 'B4',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '基站LAC',
    component: OwnerLac,
    index: 'B5',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
  },
  {
    name: '基站vs通话时长',
    component: CodeAndstarteddurationclass,
    index: 'B6',
    gridOptions: {
      x: 0,
      y: 0,
      w: 12,
      h: 30
    },
    height: '1200px'
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

class PBStatOverview extends Component {
  static displayName = 'PBStatOverview';

  static propTypes = {};

  static defaultProps = {
    className: 'layout',
    rowHeight: 30,
    onLayoutChange() {
      if (document.createEvent) {
        var event = document.createEvent("HTMLEvents");
        event.initEvent("resize", true, true);
        window.dispatchEvent(event);
      } else if (document.createEventObject) {
        window.fireEvent("onresize");
      }
    },
    cols: {lg: 12, md: 12, sm: 6, xs: 4, xxs: 2},
    initialLayout: generateLayout(),
  };

  constructor(props) {
    super(props);
    this.state = {
      chartList: ['计费类型', '联系类型', '通话类型', '本方通话地', '对方通话地', '时长段', '通话时段', '通话时段(详细)', '通话时段(小时)', '通话时长VS通话时段', '通话时段(详细)vs通话时长', '一周分布', '通话日期'],
      currentBreakpoint: 'lg',
      compactType: 'vertical',
      mounted: true,
      layouts: {lg: this.props.initialLayout},
      chartView: [],
      showSimplePbillRecordList: false
    };
    this.page = null;
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.fixGridOptions = this.fixGridOptions.bind(this);
    this.removeListItem = this.removeListItem.bind(this);
  }

  componentDidMount() {
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('resize', false, false);
    window.dispatchEvent(evt);
    this.fetchCaseBreakpointData()

    //
    // let arr = [[{id: 1}, {id: 2}, {id: 3}, {id: 4}]];
    //
    // for (let i=0; i< arr.length; i++){
    //   let a1 = {};
    //   for (let j=0; j < arr[i].length; j++){
    //     let a2 = arr[i][j];
    //     a1 = {...a1, ...a2}
    //     console.log(a1['id']);
    //
    //   }
    // }

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
    this.props.actions.setChartViewSearch(value);
  }

  componentWillReceiveProps(nextProps) {
    const { search } = nextProps
    if (search.chartView && search.chartView !== this.state.chartView) {
      this.setState({
        chartView: search.chartView
      })
    }
  }

  componentWillUnmount() {
    this.props.actions.setChartViewSearch([]);
    this.props.actions.clearPBStatStoreChart();
    window.onscroll = null;
    this.props.actions.toggleSimplePbillRecordList(false, null);
    this.page = null;
  }

  generateDOM() {
    return this.state.layouts.lg.map((l, i) => {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  onBreakpointChange = (breakpoint, cols) => {
    console.log(breakpoint, cols);
    this.setState({
      currentBreakpoint: breakpoint,
    });
  };

  fixGridOptions(data, chartView) {
    let newChartView = [...chartView];
    let w = 0;
    let rowSum = 0;
    chartComponent.forEach(item => {
      if (chartView.indexOf(item.name) > -1) {
        newChartView[chartView.indexOf(item.name)] = {gridOptions: item.gridOptions};
      }
    });
    newChartView = newChartView.filter((item, index) => {
      return item.gridOptions;
    });
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

  fixGridOptions2(chartView) {
    let newChartView = [];
    let w = 0;
    let rowSum = 0;
    chartComponent.forEach(item => {
      if (chartView.indexOf(item.name) > -1) {
        newChartView[chartView.indexOf(item.name)] = {...item.gridOptions};
      }
    });
    newChartView = newChartView.filter((item, index) => {
      return item;
    });
    for (let i = 0; i < newChartView.length; i++) {
      if (i > 0) {
        w = newChartView[i - 1].w + w;
        newChartView[i].x = w;
      }
      if (12 - w < newChartView[i].w) {
        newChartView[i].x = 0;
        w = 0;
        rowSum += 1;
      }
      newChartView[i].y = 15 * rowSum;
    }
    console.log(newChartView);
    return newChartView;
  }

  removeListItem(name) {
    let {chartView} = this.state;
    if (chartView.indexOf(name) != -1) {
      chartView.splice(chartView.indexOf(name), 1);
    }
    this.props.actions.setChartViewSearch(chartView);
  }

  onResize(layout, oldLayoutItem, layoutItem, placeholder) {
    // layoutItem.w = oldLayoutItem.w;
  }

  fetchCaseBreakpointData = (caseId = this.props.caseId) => {
    const {actions} = this.props;
    console.log(actions);
    actions.fetchCaseBreakpoints({caseId}, {
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
      duration: scrollTime
    });
  }


  render() {
    const {search} = this.props;
    const height = document.querySelector('.pbListBox') && document.querySelector('.pbListBox').offsetHeight;
    let opt = (this.props.PBAnalyze || {}).simplePbillRecordListParams ? {criteria: (this.props.PBAnalyze || {}).simplePbillRecordListParams, view: {'order-by': "started_at"}, adhoc: {limit: 500, page: 1 }} : null;
    return (
      <Fragment>
        <div id="top" onClick={this.onTop}>
          {topIcon}
        </div>
        {
          search.chartView.length > 0 ? (
            <IceContainer>
              {/*<ResponsiveReactGridLayout*/}
                {/*{...this.props}*/}
                {/*className="layout"*/}
                {/*isDraggable={false}*/}
                {/*// layouts={this.state.layouts}*/}
                {/*onBreakpointChange={this.onBreakpointChange}*/}
                {/*onLayoutChange={this.props.onLayoutChange}*/}
                {/*isResizable*/}
                {/*draggableCancel={".noDraggable"}*/}
                {/*onResize={this.onResize}*/}
                {/*// WidthProvider option*/}
                {/*measureBeforeMount={false}*/}
                {/*// I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)*/}
                {/*// and set `measureBeforeMount={true}`.*/}
                {/*useCSSTransforms={this.state.mounted}*/}
                {/*compactType={this.state.compactType}*/}
                {/*preventCollision={!this.state.compactType}*/}
              {/*>*/}
                {
                  chartComponent.map((item, index) => {
                    if (this.state.chartView.indexOf(item.index + '-' + item.name) !== -1) {
                      return (
                        <div className="chart-box"
                             key={item.name}
                             // data-grid={this.fixGridOptions(item, search.chartView)}
                             style={{display: search.criteria && Object.keys(search.criteria).length > 0 ? 'flex' : 'none', backgroundColor: '#f5f5f5', marginTop: '10px'}}
                        >
                          {/*<div className="chart-del" onClick={() => {*/}
                            {/*this.removeListItem(item.index + '-' + item.name);*/}
                          {/*}}>*/}
                            {/*<Icon type="delete-filling" size="small"/>*/}
                          {/*</div>*/}
                          {
                            <item.component/>
                          }
                        </div>
                      );
                    }
                    return <Fragment key={item.name + index}/>;
                  })
                }
              {/*</ResponsiveReactGridLayout>*/}
            </IceContainer>
          ) : null
        }
      </Fragment>

    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.search,
    PBAnalyze: state.PBAnalyze
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...searchStoreActions, ...pbStatActions, ...caseBreakpointActions, toggleSimplePbillRecordList}, dispatch),
  }),
)(PBStatOverview);

