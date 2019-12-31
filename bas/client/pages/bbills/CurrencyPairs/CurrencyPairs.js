import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import PageTitle from '../common/PageTitle';
import CurrencyPairsList from "./components/CurrencyPairsList/CurrencyPairsList";

export default class CurrencyPairs extends Component {
  constructor(props) {
    super(props);
    this.meta = {title:'外币汇率'};
    this.state = {};
  }
  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div style={{height: '100%'}}>
          <PageTitle title={this.meta.title} />
          <CurrencyPairsList/>
        </div>
      </DocumentTitle>
    );
  }
}
