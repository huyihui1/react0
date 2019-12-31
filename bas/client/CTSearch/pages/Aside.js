import React, {useState, useEffect, Fragment} from 'react'
import { Tab, Button } from '@alifd/next';
import ClassicalInput from './components/ClassicalInput'
import CityCelltowerloc from './components/CityCelltowerloc'
import BatchCelltowerloc from './components/BatchCelltowerloc'
import HistoryList from './components/HistoryList'

import logo from './images/logo.svg'

export default function Aside(props) {
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    console.log(showHistory);
  })

  return (
    <Fragment>
      <div className="aside">
        <div className="logo">
          <img src={logo} alt=""/>
          <span style={{marginLeft: '10px'}}>数岚基站查询</span>
        </div>
        <Tab shape={'capsule'}>
          <Tab.Item title='经典输入'>
            <ClassicalInput/>
          </Tab.Item>
          <Tab.Item title='城市基站'>
            <CityCelltowerloc/>
          </Tab.Item>
          <Tab.Item title='批量查询'>
            <BatchCelltowerloc/>
          </Tab.Item>
        </Tab>
        <div className='history-button'>
          <Button text onClick={() => {setShowHistory(showHistory => !showHistory)}}>显示历史记录</Button>
        </div>
      </div>
      {
        showHistory ? <HistoryList  /> : null
      }
    </Fragment>
  )
}
