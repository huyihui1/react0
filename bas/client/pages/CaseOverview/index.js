import React, { Component } from 'react';
import { Button, Progress } from '@alifd/next';
import DocumentTitle from 'react-document-title';

import InfoWindow from './components/InfoWindow';
import WorkingIndex from './components/WorkingIndex';
import LabelPNOverview from './components/LabelPNOverview';
import Labelct from './components/Labelct';
import Transaction from './components/Transaction';
import Function from './components/Function';
import Warning from './components/Warning';
import WorkingCalendar from './components/WorkingCalendar';
import CaseEvent from './components/CaseEvent';
import PageTitle from '../common/PageTitle/index';
import ajax from '../../utils/ajax';

import BtnList from '../common/BtnList'


export default class CaseOverview extends Component {
  static displayName = 'CaseOverview';

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
          <PageTitle title={this.meta.title} buttons={<BtnList/>} tour={{page: "caseOverview" }} />
          <div style={styles.container}>
            <InfoWindow />
            <WorkingIndex />
            <div style={{width: '40%'}}>
              <CaseEvent />
              <Warning />
            </div>
            <div style={{width: '60%'}}>
              <LabelPNOverview />
            </div>
            {/*<Labelct />*/}
            {/* <WorkingCalendar /> */}
            {/* <Transaction /> */}
            {/*<Function />*/}
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

