import React, { Component } from 'react';
import PageTitle from '../common/PageTitle';
import AduitLogsList from './components/AduitLogsList'
import DocumentTitle from 'react-document-title';


class AduitLogs extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "日志审核"};
    this.state = {

    };
  }
  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title} />
          <AduitLogsList />
        </div>
      </DocumentTitle>
    );
  }
}

export default AduitLogs;
