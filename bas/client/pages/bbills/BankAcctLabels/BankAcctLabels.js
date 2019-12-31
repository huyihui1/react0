import React, { useState, useEffect } from 'react';
import DocumentTitle from 'react-document-title';
import Container from '@icedesign/container';

import PageTitle from '../common/PageTitle/index';
import BankAcctList from './components/BankAcctList'

export default function BankAcctLabels() {
  const meta = {title: '账户标注'}
  return (
    <DocumentTitle title={meta.title}>
      <div>
        <PageTitle title={meta.title} />
        <Container style={styles.container}>
          <BankAcctList/>
        </Container>
      </div>
    </DocumentTitle>
  )
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
