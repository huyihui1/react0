import React, { Component } from 'react';
import Container from '@icedesign/container';
import CaseBreakpontList from './components/CaseBreakpointList';
import PageTitle from '../common/PageTitle';
import DocumentTitle from 'react-document-title';


export default class CaseBreakpoint extends Component {
  constructor(props) {
    super(props);
    this.meta = {title:'时间分割点'};
    this.state = {};
    this.afterSwitchFun = this.afterSwitchFun.bind(this);
  }
  afterSwitchFun(caseId) {
    this.props.history.push(`/cases/${caseId}/caseEvent`);
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div className="dashboard-page">
          <PageTitle title={this.meta.title} afterSwitchFun={this.afterSwitchFun} tour={{page: "caseBreakpoint"}}/>
          <Container style={styles.container}>
            <CaseBreakpontList />
          </Container>
        </div>
      </DocumentTitle>
    );
  }
}

const styles = {
  container: {
    margin: '20px',
  },
};
