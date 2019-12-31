import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Loading, Icon, Grid, Balloon } from '@alifd/next';
import { Link } from 'react-router-dom';
import IceLabel from '@icedesign/label';
import { connect } from 'react-redux';
import moment from 'moment';

import { actions as caseBreakpointActions } from '../../../../stores/caseBreakpoint';
import { actions as caseOverviewActions } from '../../../../stores/caseOverview';
import ajaxs from '../../../../utils/ajax';
import './index.scss';


const { Row, Col } = Grid;

class InfoWindow extends Component {
  static displayName = 'InfoWindow';

  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      timeLineData: [],
      caseBreakpointInfo: [],
      activeIndex: 0,
      caseOverviews: {}
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData(caseId = this.props.caseId) {
    let { activeIndex } = this.state
    const { actions, caseOverviews } = this.props;
    actions.fetchCaseBreakpoints({ caseId }).then(res => {
      if (res.body && res.body.meta && res.body.meta.success) {
        const t = []
        const caseInfo = res.body.data;
        res.body.data.forEach(item => {
          t.push({
            name: item.name,
            started_at: item.started_at,
          });
        });
        t.sort((a, b) => {
          return a.started_at > b.started_at ? 1 : -1;
        });
        const time = t.map(item => {
          return item.started_at;
        });
        this.setState({
          timeLineData: time,
          caseBreakpointInfo: t,
        });
      }
    });
    ajaxs.get(`/cases/${caseId}/summary`).then(res => {
      if (res.meta && res.meta.success) {
        this.setState({
          caseOverviews: res.data
        })
      }
    })
  }
  tableColumnRender(value, index, record) {
    return (
      <IceLabel inverse={false} style={{ fontSize: '14px', background: record.color, color: '#fff' }}>{value}</IceLabel>
    );
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }


  render() {
    const { caseBreakpoints, caseId } = this.props;
    const { timeLineData, caseBreakpointInfo, activeIndex, caseOverviews } = this.state;
    return (
      <div className="bb container" data-tut="reactour__info__window" >
        <Loading tip="加载中..." visible={this.props.caseOverviews.isLoading} style={{width: '100%', height: '100%'}}>
          <div className="card">
            <div style={styles.items}>
              <Row wrap style={{ width: '100%' }}>
                <Col l={8} style={styles.item}>
                  {/* <div style={styles.itemIcon}> */}
                  {/* <FontAwesomeIcon icon={faPhoneSquare} fixedWidth /> */}
                  {/* </div> */}
                  <div style={styles.body}>
                    <div style={styles.title}>
                      账单数目
                    </div>
                    <Link to={`/cases/${caseId}/bbills`} title="查看详细账单">
                      <div style={styles.count}>{caseOverviews.bb_bill_count}</div>
                    </Link>
                  </div>
                </Col>
                <Col l={16} style={styles.item}>
                  <div style={styles.body}>
                    <div style={styles.title}>
                      交易记录
                    </div>
                    <div style={styles.count}>{caseOverviews.bb_rec_count}</div>
                    <div style={styles.data}>
                    </div>
                  </div>
                </Col>
                <Col l={24} style={{ ...styles.item, justifyContent: 'left' }}>
                  <div style={{ marginLeft: '32px', ...styles.body }}>
                    <div style={{ ...styles.title, marginBottom: '15px' }}>
                      账单日期
                    </div>
                    <div style={{ ...styles.count, fontSize: '21px' }}>
                      {caseOverviews && `${caseOverviews.bb_started_at ? `${moment(caseOverviews.bb_started_at).format('YY年MM月DD日')}-` : ''}
                      ${caseOverviews.bb_ended_at ? moment(caseOverviews.bb_ended_at).format('YY年MM月DD日') : ''}`}
                    </div>
                    <div style={styles.data}>
                      {/* <span>累计 {item.total}</span> */}
                      {/* <span style={styles.period}>周同比 {item.period}</span> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Loading>
      </div>
    );
  }
}

const styles = {
  items: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  item: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0',
  },
  itemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '-5px',
    color: '#86cdf0',
    fontSize: '34px',
  },
  title: {
    fontSize: '12px',
    marginBottom: '5px',
    color: '#9b9b9b',
  },
  count: {
    fontSize: '40px',
    fontWeight: 'bold',
    // margin: '10px 0',
    color: '#4A90E2',
  },
  data: {
    fontSize: '12px',
    color: '#9b9b9b',
  },
  period: {
    marginLeft: '10px',
  },
  down: {
    width: '6px',
    height: '9px',
  },
  up: {
    width: '6px',
    height: '9px',
  },
  extraIcon: {
    marginLeft: '5px',
    position: 'relative',
    top: '1px',
  },
};

export default connect(
  state => ({
    caseOverviews: state.caseOverviews,
    caseBreakpoints: state.caseBreakpoints,
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...caseBreakpointActions, ...caseOverviewActions }, dispatch),
  }),
)(InfoWindow);
