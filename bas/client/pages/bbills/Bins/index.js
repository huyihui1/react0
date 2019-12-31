import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import PageTitle from '../common/PageTitle';
import BinsList from "./components/BinsList";
export default class index extends Component {
  constructor(props) {
    super(props);
    this.meta = {title:'银行卡标识'};
    this.state = {};
  }
  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div style={{height: '100%'}}>
          <PageTitle title={this.meta.title} tour={{page: "bins" }}/>
          <BinsList/>
        </div>
      </DocumentTitle>
    );
  }
}
