import React, { Component } from 'react';
import Container from '@icedesign/container';
import CaseEventList from './components/CaseEventList';
import PageTitle from '../common/PageTitle';
import DocumentTitle from 'react-document-title';


export default class CaseEvent extends Component {
  constructor(props) {
    super(props);
    this.meta = {title:'事件标注'};
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
          <PageTitle title={this.meta.title} afterSwitchFun={this.afterSwitchFun} tour={{page: "caseEvent"}}/>
          <Container style={styles.container}>
            <CaseEventList />
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
