import React, { useState, useEffect } from 'react';
import DocumentTitle from 'react-document-title';

import SearchBar from '../common/SearchBox';
import BBStatOverview from '../BBStat/BBStatOverview'

export default function BBAnalyze() {
  const meta = {
    title: '账单统计'
  }
  return (
    <DocumentTitle title={meta.title}>
      <div className="bb-analyze">
        <div style={{marginTop: '20px'}}>
          <SearchBar title={meta.title} tour={{page: "bbstat"}} isShow={true} isHide={true} />
          {/* 这是用来展示查询条件的界面 */}
          <BBStatOverview/>
          {/* BBStatOverview是用来展示查询界面的 */}
        </div>
      </div>
    </DocumentTitle>
  )
}
