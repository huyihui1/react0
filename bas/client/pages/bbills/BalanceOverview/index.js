import React, { useState, useEffect } from 'react';
import DocumentTitle from 'react-document-title';

import SearchBar from '../BBBalance/components/SearchBox';
import BalanceOverview from './BalanceOverview'

export default function BBCaseOverviewComponent() {
  const meta = {
    title: '资产概况 '
  }
  return (
    <DocumentTitle title={meta.title}>
      <div className="bb-analyze">
        <div style={{marginTop: '20px'}}>
          <SearchBar title={meta.title} isShow={true} tour={{page: "blsOverview"}} />
        </div>
        <div style={styles.container}>
          <div>
            <BalanceOverview />
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
