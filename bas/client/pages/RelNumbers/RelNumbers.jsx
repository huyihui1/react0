import React, { Component } from 'react';
import Container from '@icedesign/container';
import SearchBar from './components/EasySearch/index';
import RelNumbersList from './components/RelNumbersList/index';
import PageTitle from '../common/PageTitle/index';
import DocumentTitle from 'react-document-title';


export default class Dismantling extends Component {
  constructor(props) {
    super(props);
    this.meta = {title:'亲情网'};
    this.state = {};

    this.afterSwitchFun = this.afterSwitchFun.bind(this);
  }


  static displayName = 'Dismantling';

  afterSwitchFun(caseId) {
    this.props.history.push(`/cases/${caseId}/relnumbers`);
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title} afterSwitchFun={this.afterSwitchFun} tour={{page: "relNumbers"}}/>
          <SearchBar />
          <Container style={styles.container}>
            <RelNumbersList />
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
