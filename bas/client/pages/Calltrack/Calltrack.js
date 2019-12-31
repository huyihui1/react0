import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

import SearchBar from './components/SearchBox';
import PageTitle from '../common/PageTitle';
import CalltrackMap from './components/CalltrackMap';


import './Calltrack.css'

class Calltrack extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "通话轨迹"};
    this.state = {

    };
  }
  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          {/*<PageTitle title="每日通话轨迹" />*/}
          <div>
            <SearchBar isShow={true} title={this.meta.title} />
          </div>
          <CalltrackMap></CalltrackMap>
        </div>
      </DocumentTitle>
    );
  }
}

export default Calltrack;
