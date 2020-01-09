import React  from 'react'
import {render} from 'react-dom'
import {HashRouter as Router,Route} from 'react-router-dom'
import App from './App'
render (
    <Router>
        <Route component={App}  />
    </Router>,
    document.querySelector('#root')
)