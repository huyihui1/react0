import React, { Component } from 'react';
import Container from '@icedesign/container';
import SearchBar from './components/EasySearch/index';
import VENNumbersList from './components/VENNumbersList/index';
import PageTitle from '../common/PageTitle/index';
import DocumentTitle from 'react-document-title';


export default class Vennumbers extends Component {
  constructor(props) {
    super(props);
    this.meta = {title:'虚拟网'};
    this.afterSwitchFun = this.afterSwitchFun.bind(this);
  }


  static displayName = 'Vennumbers';
  afterSwitchFun(caseId) {
    this.props.history.push(`/cases/${caseId}/vennumbers`);
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title} afterSwitchFun={this.afterSwitchFun} tour={{page: "venNumbers"}}/>
          <SearchBar />
          <Container style={styles.container}>
            <VENNumbersList />
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
