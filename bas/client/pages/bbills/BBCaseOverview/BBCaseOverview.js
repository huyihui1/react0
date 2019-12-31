import React, { Component } from 'react';
import { Button, Progress } from '@alifd/next';
import DocumentTitle from 'react-document-title';

import InfoWindow from './components/InfoWindow';
import BBTimeline from './components/HorizontalTimeline';
import CaseEvent from './components/CaseEvent';

import PageTitle from '../common/PageTitle/index';
import BtnList from '../common/BtnList';



export default class BBCaseOverview extends Component {
  static displayName = 'BBCaseOverview';

  constructor(props) {
    super(props);
    this.meta = {title: "案件概览"};
    this.state = {

    };
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div style={{overflow: 'hidden'}}>
          <PageTitle title={this.meta.title} tour={{page: "BBCaseOverview" }} buttons={<BtnList/>} />
          <div style={styles.container}>
            <InfoWindow />
            <BBTimeline/>
            <CaseEvent/>
            <div style={{width: '40%'}}>

            </div>
            <div style={{width: '60%'}}>

            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    letterSpacing: '1px',
    padding: '10px',
  },
};

