import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table} from '@alifd/next';
import DocumentTitle from 'react-document-title';
import SearchBar from './components/SearchBar';
import BackupNumsList from '../PBAnalyze/components/InfiniteScrollGrid/PBAnalyzeList';
import ajaxs from '../../utils/ajax';
import './BackupNums.scss';
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



class BackupNums extends Component {
  static displayName = 'BackupNums';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.meta = {title: '伴随号码'};
    this.state = {
      windowScroller: null,
      isShow: false,
      conditions: [],
      ext: [],
      isLoading: false,
      labelPNs: {}
    };
    this.onArrowClick = this.onArrowClick.bind(this);
    this.getConditionsData = this.getConditionsData.bind(this);
    this.getWindowScroller = this.getWindowScroller.bind(this);
    this.updatePaging = this.updatePaging.bind(this);
    this.backNumRender = this.backNumRender.bind(this);
  }

  getWindowScroller(windowScroller) {
    this.setState({
      windowScroller,
    });
  }

  onArrowClick() {
    this.setState({
      isShow: !this.state.isShow,
    }, () => {
      setTimeout(() => {
        this.state.windowScroller.updatePosition();
      }, 200);
    });
  }

  getConditionsData(conditions) {
    this.setState({
      conditions,
    });
  }

  updatePaging(item) {
    const params = {...this.props.criteria};
    const data = (item[item.length - 1] || {}).started_day;
    params.adhoc.last_alyz_day = data;
    return params;
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.criteria && Object.keys(nextProps.criteria).length !== 0 && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.criteria)) {
      this.setState({
        isLoading: true,
      });
      ajaxs.post(`/cases/${this.props.caseId}/pbills/analyze/summary/backup-numbers`, nextProps.criteria).then(res => {
        if (res.meta && res.meta.success) {
          this.setState({
            ext: res.data,
            isLoading: false,
          }, () => {
            this.state.windowScroller && this.state.windowScroller.updatePosition();
          });
        }
      });
      if (nextProps.labelPNs && nextProps.labelPNs.items) {
        this.setState({labelPNs: nextProps.labelPNs.items})
      }
      this.setState({
        criteria: nextProps.criteria,
      });
    }
    if (nextProps.criteria && JSON.stringify(nextProps.criteria) === '{}'){
      this.setState({ext:[]})
    }

  }

  backNumRender(value, rowIndex, record, context){
    if (this.state.labelPNs) {
      this.state.labelPNs.forEach(item => {
        if (item.num === record.back_num) {
          record.Tagging = item
        }
      });
    }
    return (
      <div>
        {/*<Link to={`/cases/${caseId}/pb_analyze?owner_num=${num}`}>{value}</Link>*/}
        <span>{value}</span>
        {record.Tagging ? (<IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: record.Tagging.label_bg_color,
          color: record.Tagging.label_txt_color,
          marginLeft: '5px'
        }}>{record.Tagging.label}</IceLabel>) : <span style={{marginLeft: '5px'}}>{record.cname}</span>}
      </div>
    )

  }

  onTop = () => {
    scroll.scrollTo(0, {
      duration: scrollTime
    });
  }
  componentWillUnmount() {
    window.onscroll = null
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div className="pb-analyze">
          <div id="top" onClick={this.onTop}>
            {topIcon}
          </div>
          <div style={{marginTop: '20px'}}>
            <SearchBar title={this.meta.title} windowScroller={this.state.windowScroller}/>
          </div>
          <div className="ice-table">
            <Table dataSource={this.state.ext} loading={this.state.isLoading} fixedHeader maxBodyHeight={200}>
              <Table.Column title="伴随号码" dataIndex="back_num" cell={this.backNumRender} align='center'/>
              <Table.Column title="伴随次数" dataIndex="count" align='center'/>
              <Table.Column title="伴随天数" dataIndex="day_count" align='center'/>
              <Table.Column title="工作时间伴随次数" dataIndex="work_time_count" align='center' />
              <Table.Column title="私人时间伴随次数" dataIndex="private_time_count" align='center'/>
            </Table>
          </div>
          <BackupNumsList getWindowScroller={this.getWindowScroller} pagingType={this.updatePaging} isHighlight
                          componentProps={{url: `/cases/${this.props.caseId}/pbills/analyze/backup-numbers`}} pageTitle={this.meta.title}/>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(
  state => ({
    criteria: state.search.criteria,
    caseId: state.cases.case.id,
    meets: state.meets,
    ext: (state.PBAnalyze || {}).ext,
    isLoading: (state.PBAnalyze || {}).isLoading,
    labelPNs: state.labelPNs,
  }),
  // mapDispatchToProps
  dispatch => ({}),
)(BackupNums);
