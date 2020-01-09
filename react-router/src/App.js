import React, { Component } from 'react'
import Article from './views/Article/Article'
import Home from './views/Home/Home'
import  Users from './views/Users/Users'
import ArticleDetail from './views/Article/ArticleDetail'
import Homebb from './views/Home/Homebb'
import {Route,NavLink as Link,Redirect,Switch} from 'react-router-dom'
export default class App extends Component {
    render() {
        return (
            <div>
                <ul>
                    {/* Redirect本质是自动执行的Link */}
                    {/* 为什么to="/"还是能匹配到home */}
                    <li><Link to="/">首页</Link></li>
                    <li><Link to="/article">详情</Link></li>
                    <li><Link to="/users">用户</Link></li>
                </ul>
                <Switch>
                <Route component={Home} path="/home" exact></Route>   
                <Route component={Article} path="/article" exact></Route>   
                <Route component={Users} path="/users"></Route> 
                <Route 
                //component={Homebb} 
                render = {
                    (props) =>{
                        return <Homebb {...props} ></Homebb>
                    }
                }
                path="/home/1"></Route> 
                <Route component ={ArticleDetail} path ="/article/:id"/>      
                < Redirect to="/home"  from="/"></Redirect>            
                </Switch>           
            </div>
        )
    }
}
