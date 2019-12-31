import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Timeline, Icon, Loading } from '@alifd/next';
import IceLabel from '@icedesign/label';
import moment from 'moment';
import { actions as caseEventActions } from '../../../../stores/caseEvent';
import appConfig from '../../../../appConfig'

import './index.scss';

const { Item: TimelineItem } = Timeline;

class CaseEventTimeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caseEvents: []
    };
  }
  componentDidMount() {
    this.fetchData()
  }
  fetchData(caseId = this.props.caseId) {
    const { actions } = this.props;
    actions.fetchCaseEvents({ caseId }, {
      query: {
        page: 1,
        pagesize: appConfig.pageSize,
      },
    }).then(res => {
      if (res.body && res.body.meta && res.body.meta.success) {
        this.setState({
          caseEvents: res.body.data
        })
      }
    })
    this.setState({
      caseId,
    });
  }
  renderTimeline = () => {
    return (
      <Timeline>
        {
          this.state.caseEvents.map((item, index) => {
            return (
              <TimelineItem
                key={item.name + index}
                title={
                  <IceLabel inverse={false} style={{ fontSize: '12px', background: item.color, color: '#fff' }}>{item.ended_at ? moment(item.started_at).format('YYYY-MM-DD') + '~' + moment(item.ended_at).format('YYYY-MM-DD') : moment(item.started_at).format('YYYY-MM-DD')}</IceLabel>
                }
                content={item.name}
                // state="process"
              />
            )
          })
        }
      </Timeline>
    );
  };
  render() {
    return (
      <div className="CaseEvent container" data-tut="reactour__case__event" style={{width: '100%'}}>
        <Loading tip="加载中..." visible={this.props.caseEvents.isLoading} style={{width: '100%'}}>
          <div className="CaseEvent card">
            <h4 className="title">
              事件标注
              <span>
                <Link to={`/cases/${this.props.caseId}/caseEvent`}>
                  <Icon type="ellipsis" style={{transform: "rotate(90deg)"}} size="small" />
                  更多
                </Link>
              </span>
            </h4>
            <div className="content">
              {
                this.state.caseEvents.length > 0 ? this.renderTimeline() : (
                  <div className="no-event">
                    尚无事件标注
                  </div>
                )
              }
            </div>
          </div>
        </Loading>
      </div>
    );
  }
}

export default connect(
  state => ({
    caseEvents: state.caseEvents,
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...caseEventActions }, dispatch),
  }),
)(CaseEventTimeLine);
