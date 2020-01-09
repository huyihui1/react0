import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
class BackHome extends Component {
    goHome = () =>{
        console.log(this.props.match.params.id)
        this.props.history.push({
            pathname: '/home',
            state: {
                id: this.props.match.params.id
            }
        })
     //   this.props.history.push('/home/1')
    }
    render() {
        console.log(this.props)
        return (
            <div>
                <button onClick ={this.goHome}>返回首页</button>
            </div>
        )
    }
}
export default withRouter(BackHome)