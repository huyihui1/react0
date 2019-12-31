import React, {useState, useEffect} from 'react'
import { Message } from '@alifd/next';
import logo from '../images/logo.svg'


export default function ADBox () {
  return (
    <div className={'ADBox'}>
      <div className="logo" style={{marginTop: '20px', padding: 0}}>
        <img src={logo} alt=""/>
        <span style={{marginLeft: '10px'}}>数岚情报分析系统</span>
      </div>
      <div>
        让你快速成为情报分析高手，主导案件调查
      </div>
      <a href="http://47.103.61.224:8080/" target="_blank">马上试用</a>
    </div>
  )
}
