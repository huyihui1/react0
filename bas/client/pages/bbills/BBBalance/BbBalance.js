import React, { useState, useEffect } from 'react';
import DocumentTitle from 'react-document-title';

import SearchBar from './components/SearchBox';
import TimelyNet from './components/TimelyNet'
import TimelyOchl from './components/TimelyOchl'
import TimelyAccSum from './components/TimelyAccSum'

export default function BBAnalyze() {
  const meta = {
    title: '收支分析'
  }
  return (
    <DocumentTitle title={meta.title}>
      <div className="bb-analyze">
        <div style={{marginTop: '20px'}}>
          <SearchBar title={meta.title} isShow={true}  />
        </div>
        <div style={styles.container}>
          <div>
            <TimelyNet />
          </div>
          <div style={{marginTop: '10px'}}>
            <TimelyAccSum/>
          </div>
          <div style={{marginTop: '10px'}}>
            <TimelyOchl/>
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
