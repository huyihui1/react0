# 组件的使用

### 号码选择器组件使用
* NumberSelector
```
name 参数对应的字段 (必填)
labelGroup 分类标签数据源
dataSource 弹出框数据源 (必填)
values 与飞冰组件FormBinderWrapper传入的值一致 (必填)
onFormChange 改变values函数 (必填)
isLabel 号码标注的数据源 (必填)
```

### 话单浏览显示组件
* SimplePbillRecordList 
```js
// 示例
noPaging 可选 不分页  默认false
height 可选 组件高度 默认500
componentProps 必选 参数: url (必选) 需要请求的接口 opt (可选) 请求的参数 默认调用store里search 搜索参数

<SimplePbillRecordList noPaging height={height} componentProps={{url: `/cases/${this.props.caseId}/pbills/analyze/matrix/drilldown/pbr`, opt }} />
```




