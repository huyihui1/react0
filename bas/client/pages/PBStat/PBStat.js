import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import SearchBar from '../common/SearchBox';
import PBStatOverview from './components/PBStatOverview';

import '../../utils/hotRenders'



import './PBStat.css';

export default class PBStat extends Component {

  constructor(props) {
    super(props);
    this.meta = {title:'话单统计'};
    this.state = {};
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <SearchBar title={this.meta.title} isShow tour={{page: "pbstat"}}/>
          <PBStatOverview />
        </div>
      </DocumentTitle>
    );
  }
}

