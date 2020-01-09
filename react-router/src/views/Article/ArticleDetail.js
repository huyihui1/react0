import React, { Component } from 'react'
import BackHome from './components/BackHome.js'
 export default class ArticleDetail extends Component {
    render() {
        console.log(this.props)
        return (
            <div>
                文章详情
                <BackHome/>
            </div>
        )
    }
}
