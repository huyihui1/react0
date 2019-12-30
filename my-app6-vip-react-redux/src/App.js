import React, { Component } from 'react'
import {CartList} from './components'
export default class App extends Component {
    constructor(){
        super()
        this.state ={

        }
    }
    render() {
        return (
            <div>
                <CartList />
            </div>
        )
    }
}
