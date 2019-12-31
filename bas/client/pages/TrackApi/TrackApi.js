import React, { Component } from 'react';
import PageTitle from '../common/PageTitle';
import DocumentTitle from 'react-document-title';
import TrackApiList from './TrackApiList'


class TrackApi extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "软件统计"};
    this.state = {

    };
  }
  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title} />
          <TrackApiList />
        </div>
      </DocumentTitle>
    );
  }
}

export default TrackApi;
