import React, { Component } from 'react';
import Container from '@icedesign/container';
import PageTitle from '../common/PageTitle/index';
import PubServiceNumsList from './components/PubServiceNumsList'
import DocumentTitle from 'react-document-title';


export default class PubServiceNums extends Component {
  constructor(props) {
    super(props);
    this.meta = {title:'特殊号码'};
    this.state = {};
  }


  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title} tour={{page: "pubserviceNums"}}/>
          <Container style={styles.container}>
            <PubServiceNumsList />
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
  },
  container: {
    margin: '20px',
  },
};
