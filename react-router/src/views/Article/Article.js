import React, { Component } from 'react'
import {NavLink as Link} from 'react-router-dom'
export default class Home extends Component {
    render() {
        return (
            <div>
                <Link to="/article/1">文章1</Link>
                <Link to="/article/2">文章2</Link>
            </div>
        )
    }
}
