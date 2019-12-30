import React from 'react'
import { render } from 'react-dom'
import {Provider} from 'react-redux'
//Provider是react-redux提供的组件
import App from './App'
import store from './store'
window.store = store
console.log(store)
render(
    //一般就直接把这个组件放在应用程序的最顶层,这个组件必须接收一个store属性,这个store属性的值就是
    //咱们创建的那个store,只要在最外层包裹这个Provider,那么所有的后代组件都可以使用 redux.connect做连接

    <Provider store ={store}>
        <App/>
    </Provider>
    ,
    document.querySelector('#root')
)