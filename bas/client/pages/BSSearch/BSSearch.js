import React, { Component } from 'react';

import PageTitle from '../common/PageTitle';
import BaseStationMap from './components/BSMap';
import DocumentTitle from 'react-document-title';


import './BaseStationSearch.css';

class BSSearch extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "基站定位"};
    this.state = {

    };
  }
  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <div style={{marginBottom: '30px'}}>
            <PageTitle title={this.meta.title} tour={{page: "bsSearch"}}/>
          </div>
          <BaseStationMap />
        </div>
      </DocumentTitle>
    );
  }
}

export default BSSearch;
