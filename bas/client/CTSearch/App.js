import React, { useState, useEffect } from 'react';
import {createStore, combineReducers} from 'redux'
import {Provider} from  'react-redux'

import reducers from './reducers'
import Aside from './pages/Aside'
import Login from './pages/components/Login'
import ADBox from './pages/components/ADBox'
import { installBaiduMaps } from './utils/utils';

import './index.scss'

const store = createStore(
  combineReducers(reducers),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default function App() {
  useEffect(() => {
    installBaiduMaps(document.body, renderMap);
  }, []);

  const renderMap = () => {
    const {BMap} = window
// 百度地图API功能
    const map = new BMap.Map('map');    // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件
    map.addControl(new BMap.MapTypeControl({
      mapTypes: [
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP,
      ],
    }));
    map.setCurrentCity('北京');          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
  };

  return (
    <Provider store={store}>
      <div className='main'>
        <Aside />
        <Login />
        <ADBox />
        <div id='map' />
      </div>
    </Provider>

  );
}
