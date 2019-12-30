import React, { Component } from 'react'
//connect方法执行之后是一个高阶组件
import {connect} from 'react-redux'

//导入actionCreators
import {increment,decrement} from '../../actions/cart'
class CartList extends Component {
    // constructor(){
    //     super()
    //     this.state ={
    //         cartlist:[]
    //     }
    // }


 
    render() {
        console.log(this.props.store)
        console.log(this.props)
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>商品名称</th>
                            <th>价格</th>
                            <th>数量</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.cartlist.map(item=>{
                                return (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.title}</td>
                                        <td>{item.price}</td>
                                        <td>
                                            {/* <button 
                                                  onClick={ 
                                                  this.props.decrement.bind(this,item.id)
                                                 }
                                            >-</button> */}
                                               <button 
                                                  onClick={ 
                                                    ()=>{ this.props.reduce(item.id)}
                                                 }
                                            >-</button>
                            <span>{item.amount}</span>
                                            {/* <button
                                              onClick={ 
                                                this.props.increment.bind(this,item.id)
                                        }>+</button> */}
                                           <button 
                                                  onClick={ 
                                                    ()=>{ this.props.dispatch(increment(item.id))}
                                                 }
                                            >+</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>                   

            </div>
        )
    }
}
//这里的state实际上就是store.getState()的值
const mapStateToProps = (state) =>{
    //console.log(state)这里的state是getState返回的值
    //这里return了什么,在组建立就可以通过this.props来获取
    return {
        cartlist: state.cart
    }
}
//mapDispatchToProps
// const mapState = dispatch =>{
//     return {
//         add: (id) => dispatch(increment(id)),
//         reduce: (id) => dispatch(decrement(id))
//     }
// }
//connect有四个参数,常用的就是前面2个,
//第一个参数是mapStateToProps,作用就是从store里把state注入到当前的组建的props上
//第二个参数可以使mapDispatchToProps,这个的而主要作用是吧action生成的方法注入到当前组建的props上面

 export default connect(mapStateToProps,{decrement,increment})(CartList)

//直接第二个参数传递一个对象,这里面的对象就是actionCreators,只要传入了actionCreators,在组件内就可以通过this.props.actinCreators来调用,这样的话
//在调用之后,actionCreator就会自动帮你把它内部
//export default connect(mapStateToProps)(CartList)