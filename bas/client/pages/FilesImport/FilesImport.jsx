import React, { Component } from 'react';
import Container from '@icedesign/container';
import { Tab } from '@alifd/next';
import uuidv1 from 'uuid/v1';
import FilesImportComponent from './components/FilesImport';
import FilesTable from './components/FilesTable';
import PageTitle from '../common/PageTitle';
import DocumentTitle from 'react-document-title';
import './FileImport.css';

const TabPane = Tab.TabPane;

const panes = [
  {
    tab: '文件导入',
    key: 0,
  },
  {
    tab: '案件导入',
    key: 1,
  },

];

const detachedContentStyle = {
  borderLeft: 0,
  borderRight: 0,
  borderBottom: 0,
};
// @withRouter
export default class FilesImport extends Component {
  constructor(props) {
    super(props);
    this.meta = {title:'转换导入'};
    this.state = {
      uuid: uuidv1(),
    };
    this.afterSwitchFun = this.afterSwitchFun.bind(this);
    this.afterUploadFun = this.afterUploadFun.bind(this);
  }

  afterSwitchFun(caseId) {
    this.props.history.push(`/cases/${caseId}/pb_filesimport`);
  }
  afterUploadFun() {
    this.setState({
      uuid: uuidv1(),
    });
  }
  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div className="fileImport">
          <PageTitle title={this.meta.title} afterSwitchFun={this.afterSwitchFun} tour={{page: "filesImport"}}/>
          <Container style={styles.container}>
            <FilesImportComponent uuid={this.state.uuid} />
          </Container>
          <div style={styles.container}>
            <FilesTable afterUploadFun={this.afterUploadFun} uuid={this.state.uuid} />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

const styles = {
  nav: {
    background: 'white',
    height: '72px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  breadcrumb: {
    borderLeft: '5px solid #447eff',
    paddingLeft: '16px',
    margin: '0 0 0 20px',
    cursor: 'pointer',
  },
  container: {
    margin: '20px',
  },
};
