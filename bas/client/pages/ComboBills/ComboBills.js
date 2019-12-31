import React, { useState, useEffect } from 'react';
import DocumentTitle from 'react-document-title';

import SearchBar from './components/ComboBillsSearchBox';
import PageTitle from '../common/PageTitle/index';
import ComboBillsList from './components/ComboBillsList'

export default function ComboBills() {
  const meta = {
    title: '联合浏览'
  }

  const [windowScroller, setWindowScroller] = useState(null)

  const getWindowScroller = (windowScroller) => {
    setWindowScroller(windowScroller)
  }


  return (
    <DocumentTitle title={meta.title}>
      <div className="comboBills">
        <PageTitle title={meta.title} />
        <SearchBar isShow={true} windowScroller={windowScroller} tour={{page: "comboBills"}} />
        <div>
          <ComboBillsList getWindowScroller={getWindowScroller}  />
        </div>
      </div>
    </DocumentTitle>
  )
}
