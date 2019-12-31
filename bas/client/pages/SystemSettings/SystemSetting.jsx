import React, { Component } from 'react';
import Container from '@icedesign/container';
import PageTitle from '../common/PageTitle';
import GlobalSettingList from './components/GlobalSettingList';
// import AccountSettingList from './components/AccountSettingList';
import EasySearch from './components/EasySearch';
import DocumentTitle from 'react-document-title';
import uuidv1 from "uuid/v1";


class SystemSetting extends Component {
  constructor(props) {
    super(props);
    this.meta={title:'系统设置'};
    this.state = {
    };
  }
  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title} isHide />
          <EasySearch />
          <Container style={styles.container}>
            <GlobalSettingList />
          </Container>
          {/*<Container style={styles.container}>*/}
          {/*{'用户设置'}*/}
          {/*<AccountSettingList />*/}
          {/*</Container>*/}
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

export default SystemSetting;
