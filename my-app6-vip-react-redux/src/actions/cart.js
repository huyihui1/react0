import actionType from "./actionType";

//action 有2种写法

//第一种写成一个对象,这是标准的action,但是问题是不方便传递动态参数
//export const increment = {
 //   type: actionType.CART_AMOUNT_INCREAMENT
//}


//在工作中,常用的一种方式 是使用actionCteator,他是一个方法,返回一个对象,这个对象才是真正的action
export const increment =(id) => {
    console.log(id)
    return {
        type: actionType.CART_AMOUNT_INCREAMENT,
        payload:{
            id
        }
    }
}

export const decrement = (id) => {
    console.log(id)
    return {
        type: actionType.CART_AMOUNT_DECREAMENT,
        payload:{
            id
        }
    }   
}