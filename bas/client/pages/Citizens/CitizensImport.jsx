import React, { Component } from 'react';
import Container from '@icedesign/container';
import uuidv1 from 'uuid/v1';
import CitizensList from './components/CitizensList';
import SearchBar from './components/SearchBar';
import PageTitle from '../common/PageTitle';
import DocumentTitle from 'react-document-title';


import './CitizensImport.css';



// @withRouter
export default class CitizensImport extends Component {
  constructor(props) {
    super(props);
    this.meta={title:'人员库'};
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
  handleClick() {

  }
  render() {
    const buttons = [
      '添加',
      '导入',
    ];
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title} afterSwitchFun={this.afterSwitchFun} tour={{page: "citizensImport"}}/>
          <SearchBar />
          <Container style={styles.container}>
            <CitizensList afterUploadFun={this.afterUploadFun} uuid={this.state.uuid} />
          </Container>
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
  button: {
    margin: '20px 8px',
    letterSpacing: '2px',
  },
};
