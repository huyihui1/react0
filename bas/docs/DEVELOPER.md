# 报表组件的工作流程

* 搜索参数怎么传递
  * 选择本方号码,选择报表类型,点击查询时,将搜索条件存入store.
* 怎么发送HTTP请求
  * 组件通过钩子函数componentWillReceiveProps监听store,如果store发生变化则发送相应的请求请求
* 怎么出来HTTP相应
  * 将请求到的数据转化为二维数组
* 页面渲染的过程
  * 将处理好的数据从store拿出来,放到对应的组件进行渲染
  
# dependencies 和 devDependencies 的区别
* dependencies    
  npm安装时  npm instart "name" -save       
  生产环境
    
* devDependencies          
  npm安装时  npm instart "name" -save-dev      
  开发环境
  
  
  || https://www.chenqaq.com/2017/12/29/dependencies-devDependencies/
# RESTFUL(CURD)组件开发


* Redux-rest的使用
 *
 *
* 了解RESTful 和 PostMan
* 学习资料
  * `号码标注`模块
  * https://mgcrea.gitbook.io/redux-rest-resource/usage/quickstart
  * https://mgcrea.gitbook.io/redux-rest-resource/
  
  
  
 * 对象不能直接作比对,因为对象是引用类型,如果要比对,可先转化为字符串在作比对 
 
 * Object.keys() 传入一个对象,返回对象属性名组成的新数组  传入字符串,返回索引, 传入数组,返回索引
