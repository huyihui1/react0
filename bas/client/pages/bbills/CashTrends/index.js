import React, { useState, useEffect } from 'react';
import DocumentTitle from 'react-document-title';

import SearchBar from '../BBBalance/components/SearchBox';
import CashTrends from './CashTrends'

export default function CashTrendsComponent() {
  const meta = {
    title: '收支趋势'
  }
  return (
    <DocumentTitle title={meta.title}>
      <div className="bb-analyze">
        <div style={{marginTop: '20px'}}>
          <SearchBar title={meta.title} isShow={true} tour={{page: "cashTrends"}} />
        </div>
        <div style={styles.container}>
          <div>
            <CashTrends />
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
