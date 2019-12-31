import React, {Component} from 'react';
import DocumentTitle from 'react-document-title';
import * as Scroll from 'react-scroll';
import {Select, Checkbox, Input, Radio, Button, Message} from '@alifd/next';
import { Form, Field } from '@ice/form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PageTitle from '../common/PageTitle';
import SearchBar from './components/SearchBox';
import CalcOnSetsList from './components/CalcOnSetsList'
import CalcOnSetsChart from './components/CalcOnSetsChart'

import { formatFormData } from '../../utils/utils';
import { actions } from '../../stores/calcOnSets';

import './calcOnSets.css';


const RadioGroup = Radio.Group;
const Option = Select.Option;

// 回到顶部动画设置, 值越小越快
const scrollTime = 300;
const scroll = Scroll.animateScroll;

const topIcon = (
  <svg t="1569296853164" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
       p-id="3812" width="32" height="32">
    <path
      d="M796.422846 524.478323 537.312727 265.185862c-6.368176-6.39914-14.688778-9.471415-22.976697-9.407768-1.119849-0.096331-2.07972-0.639914-3.19957-0.639914-4.67206 0-9.024163 1.087166-13.023626 2.879613-4.032146 1.536138-7.87163 3.872168-11.136568 7.135385L227.647682 524.27706c-12.512727 12.480043-12.54369 32.735385-0.032684 45.248112 6.239161 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.624056-9.34412L479.1356 363.426421l0 563.712619c0 17.695686 14.336138 31.99914 32.00086 31.99914s32.00086-14.303454 32.00086-31.99914L543.13732 361.8576l207.91012 207.73982c6.240882 6.271845 14.496116 9.440452 22.687703 9.440452s16.319527-3.103239 22.560409-9.311437C808.870206 557.277355 808.902889 536.989329 796.422846 524.478323z"
      p-id="3813" fill="#8a8a8a"></path>
    <path
      d="M864.00258 192 160.00258 192c-17.664722 0-32.00086-14.336138-32.00086-32.00086S142.337858 128 160.00258 128l704 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.698266 192 864.00258 192z"
      p-id="3814" fill="#8a8a8a"></path>
  </svg>
);

const list = [
  {
    value: 2,
    label: '2个集合'
  }, {
    value: 3,
    label: '3个集合'
  }, {
    value: 4,
    label: '4个集合'
  }
];

class CalcOnSets extends Component{
  constructor(props) {
    super(props)
    this.state = {
      radioValue: 2,
      meter: 'pbrs',
      checkbox: []
    }
    this.meta = {title:'集合运算'};
  }

  onTop = () => {
    scroll.scrollTo(0, {
      duration: scrollTime
    });
  }

  onRadioChange = (value) => {
    this.setState({
      radioValue: value
    });
  }

  onSubmit = (values) => {
    const radioValue = Array(this.state.radioValue).fill();
    let sets = {}
    radioValue.forEach((item, index) => {
      sets[`s${index + 1}`] = {criteria: formatFormData(this[`s${index + 1}`].validateFields(), true)}
    })
    if (values.checkbox) {
      delete values.checkbox
    }
    this.props.actions.fetchCalcOnSets({case_id: this.props.caseId, sets, ...values})
  }

  onRefs = (e, name) => {
    this[name] = e;
  }

  onChange = (value) => {
    if (value.meter) {
      this.setState({
        meter: value.meter
      })
    }
    if (value.checkbox) {
      this.setState({
        checkbox: value.checkbox
      })
    }
  }

  render() {
    const data = Array(this.state.radioValue).fill()
    return (
      <DocumentTitle title={this.meta.title}>
        <div className="pb-analyze">
          <div id="top" onClick={this.onTop}>
            {topIcon}
          </div>
          <div style={{marginBottom: '30px'}}>
            <PageTitle title={this.meta.title} />
          </div>
          <div style={{ marginTop: '20px' }}>
            <div>
              <span style={{marginRight: '10px'}}>
                运算集合个数:
              </span>
              <RadioGroup dataSource={list} value={this.state.radioValue} onChange={this.onRadioChange} />
            </div>
            {
              data.map((item, index) => {
                return (
                  <div key={index} style={{marginTop: '20px'}}>
                    <SearchBar onRefs={this.onRefs} title={`s${index + 1}`}  />
                  </div>
                )
              })
            }
            <div style={{marginTop: '20px'}}>
             <Form
               layout={{
               labelTextAlign: 'left',
                 labelCol: 2
               }}
               onSubmit={this.onSubmit}
               onChange={this.onChange}
             >
               <div style={{display: 'flex'}}>
                 <Field style={{flexBasis: '61%'}} layout={{
                   labelTextAlign: 'left',
                   labelCol: 2,
                   wrapperCol: 8
                 }} label="运算目标：" name="meter" component={Select} value="pbrs" tips="(集合里的内容是对方号码还是本方基站)">
                   <Option value="pbrs">对方号码</Option>
                   <Option value="celltowers">基站</Option>
                 </Field>
               </div>
               <Field style={{width: '61%'}} label="逻辑运算：" layout={{
                 labelTextAlign: 'left',
                 labelCol: 2,
                 wrapperCol: 10
               }} name="exp" component={Input} placeholder="" tips='说明：集合名称为 s1 s2 s3 s4 , 操作符号为 并 + ,交 & , 差集 -' />
               <div style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
                 <Field name="checkbox"
                        dataSource={[{
                           value: true,
                           label: '显示对比图'
                         }]}
                        layout={{
                          wrapperCol: 12
                        }}
                        component={Checkbox.Group}>
                 </Field>
                 <Button type="primary" htmlType="submit">开始运算</Button>
               </div>
             </Form>
            </div>
          </div>
          <div style={{marginTop: '20px'}}>
            <CalcOnSetsList setCount={this.state.radioValue} meter={this.state.meter} />
          </div>
          <div style={{marginTop: '20px', width: '100%'}}>
            {
              this.state.checkbox[0] ? <CalcOnSetsChart setCount={this.state.radioValue} meter={this.state.meter}  /> : null
            }
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.search,
    calcOnSets: state.calcOnSets,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CalcOnSets);
