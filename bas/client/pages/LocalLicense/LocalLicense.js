import React, { Component } from 'react';
import PageTitle from '../common/PageTitle';
import LicensesList from './components/LocalLicenseList';
// import EasySearch from './components/EasySearch';
import DocumentTitle from 'react-document-title';


class LocalLicense extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "许可证"};
    this.state = {

    };
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title} />
          {/*<EasySearch />*/}
          <LicensesList />
        </div>
      </DocumentTitle>
    );
  }
}

export default LocalLicense;
