import React, { useState, useEffect } from 'react';
import DocumentTitle from 'react-document-title';
import { Button, Icon } from '@alifd/next';
import SearchBar from '../common/SearchBox';
import BBAnalyzeList from './components/BBAnalyzeList'
import BBFullList from './components/BBFullAnalyzeList/BBFullIceTable';

export default function BBAnalyze() {
  const meta = {
    title: '账单浏览'
  }
  const [windowScroller, setWindowScroller] = useState(null)
  const [isFullList, setIsFullList] = useState(false);
  const [isScrollTitle, setIsScrollTitle] = useState(false);
  let analyzeListRef = null

  const getWindowScroller = (windowScroller) => {
    setWindowScroller(windowScroller)
  }

  const BBAnalyzeListRef = (e) => {
    analyzeListRef = e
  }

  useEffect(() => {
    console.log(isFullList);
    if (isFullList) {
      setWindowScroller(null)
    }
  }, [isFullList])

  useEffect(() => {
    return () => {
      analyzeListRef && analyzeListRef.props.actions.clearAnalyzes();
    }
  }, [])

  return (
    <DocumentTitle title={meta.title}>
      <div className="bb-analyze">
        <div style={{marginTop: '20px'}}>
          <SearchBar title={meta.title} isShow={true} tour={{page: "bbAnalyze"}} isHide={false} windowScroller={windowScroller}/>
        </div>
        <div style={{position: 'relative'}}>
          <div className={`arrowBox ${isScrollTitle && !isFullList ? 'fixedArrowBox' : ''}`} style={{textAlign: 'right'}}  onClick={() => {
            setIsFullList(!isFullList)
          }}>
            <Icon type="arrow-left" size={"small"}/>
            {isFullList ? '简洁版' : '详细版'}
          </div>
          {
            isFullList ? (
              <BBFullList />
            ) : (
              <BBAnalyzeList onRef={BBAnalyzeListRef} getWindowScroller={getWindowScroller} isScrollTitle={setIsScrollTitle} />
            )
          }
        </div>
      </div>
    </DocumentTitle>
  )
}
