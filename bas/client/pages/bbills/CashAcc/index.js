import React, { useState, useEffect } from 'react';
import DocumentTitle from 'react-document-title';

import SearchBar from '../BBBalance/components/SearchBox';
import CashAcc from './CashAcc'

export default function CashAccComponent() {
  const meta = {
    title: '累计收支'
  }
  return (
    <DocumentTitle title={meta.title}>
      <div className="bb-analyze">
        <div style={{marginTop: '20px'}}>
          <SearchBar title={meta.title} isShow={true} tour={{page: "cashAcc"}} />
        </div>
        <div style={styles.container}>
          <div>
            <CashAcc />
          </div>
        </div>
      </div>
    </DocumentTitle>
  )
}

const styles = {
  container: {
    padding: '20px',
    letterSpacing: '2px',
    backgroundColor: '#fff',
    minHeight: '463px',
  },
}
