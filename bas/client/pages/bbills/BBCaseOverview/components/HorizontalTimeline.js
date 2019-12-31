import React, { Component } from 'react';
import HorizontalTimeline from 'react-horizontal-timeline';
import { Loading, Grid } from '@alifd/next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ajaxs from '../../../../utils/ajax';
import { actions as caseBreakpointActions } from '../../../../stores/caseBreakpoint';
import { actions as caseOverviewActions } from '../../../../stores/caseOverview';


const { Row, Col } = Grid;

class BBTimeline extends Component {
  static displayName = 'HorizontalTimeline';

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
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }


  render() {
    const { caseBreakpoints, caseId } = this.props;
    const { timeLineData, caseBreakpointInfo, activeIndex } = this.state;
    return (
      <div className='bb container' style={{width: '60%'}} >
        <Loading tip="加载中..." visible={this.props.caseOverviews.isLoading} style={{width: '100%', height: '100%'}}>
          <div className="card">
            <div style={styles.items}>
              <Row wrap style={{ width: '100%' }}>
                <Col l={24} style={{ display: 'flex', height: '70px', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                  {caseBreakpointInfo[activeIndex] && caseBreakpointInfo[activeIndex].name || '没有时间分割点'}
                </Col>
                <Col l={24} style={{ height: '60px', fontSize: '14px' }}>
                  <HorizontalTimeline
                    values={timeLineData}
                    indexClick={(index) => {
                      this.setState({
                        activeIndex: index
                      })
                    }}
                    index={activeIndex}
                    getLabel={(date) => {
                      return <span>{date}</span>;
                    }}
                  />
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
}

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
)(BBTimeline);
