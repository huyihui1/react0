import React, {Component} from 'react';
import Container from '@icedesign/container';
import SearchBar from './components/SearchBar';
import LabelPNList from './components/LabelPNList';
import PageTitle from '../common/PageTitle/index';
import DocumentTitle from 'react-document-title'

export default class LabelPN extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: '号码标注'};
    this.state = {};
    this.afterSwitchFun = this.afterSwitchFun.bind(this);
  }

  static displayName = 'LabelPN';

  afterSwitchFun(caseId) {
    this.props.history.push(`/cases/${caseId}/labelpn`);
  }


  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title} afterSwitchFun={this.afterSwitchFun} tour={{page: "labelPn"}}/>
          <SearchBar/>
          <Container style={styles.container}>
            <LabelPNList/>
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
