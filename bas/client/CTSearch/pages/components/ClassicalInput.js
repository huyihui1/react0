import React, {useState} from 'react'
// import {useDispatch} from 'react-redux'
import { Radio, Form, Input, Button } from '@alifd/next';

import {ADD_HISTORY} from '../../stores/historyStores/types';

const FormItem = Form.Item;

export default function ClassicalInput(props) {
  // const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    mncDec: 0,
    mncHex: 0,
    lacDec: '',
    lacHex: '',
    ciDec: '',
    ciHex: '',
  })
  const [radioVal, setRadioVal] = useState('移动')


  const onRadioChange = (value) => {
    setRadioVal(value)
    if (value === '移动') {
      formData['mncDec'] = 0;
      formData['mncHex'] = 0;
      setFormData({...formData})
    } else if (value === '联通') {
      formData['mncDec'] = 1;
      formData['mncHex'] = 1;
      setFormData({...formData})
    } else if (value === '电信') {
      formData['mncDec'] = 11;
      formData['mncHex'] = parseInt(11, 0).toString(16).toUpperCase();
      setFormData({...formData})
    } else {
      formData['mncDec'] = '';
      formData['mncHex'] = '';
      setFormData({...formData})
    }
  }

  const onSidDECChange = (val, decKey, hexKey) => {
    if (val) {
      formData[decKey] = val;
      formData[hexKey] = parseInt(val, 0).toString(16).toUpperCase();
      setFormData({...formData})
    } else {
      formData[decKey] = '';
      formData[hexKey] = '';
      setFormData({...formData})
    }
  }

  const onSidHEXChange = (val, hexKey, decKey) => {
    if (val) {
      formData[hexKey] = val;
      formData[decKey] = parseInt(val, 16);
      setFormData({...formData})
    } else {
      formData[hexKey] = '';
      formData[decKey] = '';
      setFormData({...formData})
    }
  }

  const handleSubmit = (e, v) => {
    let params = {
      ct_codes: [],
      coord: 2,
      fmt: 16
    }
    const {lacHex, ciHex, mncHex} = e;
    const code = `${lacHex}:${ciHex}:${mncHex}`
    params.ct_codes.push(code)
    console.log(params);
    // dispatch({
    //   type: ADD_HISTORY,
    //   payload: {
    //     code,
    //     params,
    //     addr: '浙江省温州市鹿城区南门街道蒲鞋巿169号楼;飞霞南路与蒲鞋市路路口东北10米',
    //     date: new Date().getTime()
    //   }
    // })
  }

  const clearMap = () => {

  }


  return (
    <div className={'classicaIInput'}>
      <Radio.Group
        defaultValue={radioVal}
        onChange={onRadioChange}
      >
        <Radio value="移动">移动</Radio>
        <Radio value="联通">联通</Radio>
        <Radio value="电信">电信</Radio>
      </Radio.Group>
      <Form
        value={formData}
        labelAlign="top"
        labelTextAlign='left'
        style={{textAlign: 'initial', marginTop: '10px'}}
      >
        <div>
          <FormItem
            label={ <span style={{whiteSpace: 'nowrap'}}>
                      <span style={{color: 'red', marginRight: '5px'}}>LAC/TAC</span>
                     </span>}
            requiredMessage={" "}
            required
            hasFeedback
            asterisk={false}
          >
            <Input
              name="lacDec"
              trim
              addonTextAfter="10进制"
              onChange={(val) => onSidDECChange(val, 'lacDec', 'lacHex')}
            />
            <Input
              name="lacHex"
              style={{marginTop: '10px'}}
              trim
              addonTextAfter="16进制"
              onChange={(val) => onSidHEXChange(val, 'lacHex', 'lacDec')}
            />
          </FormItem>
        </div>
        <div>
          <FormItem label={ <span style={{whiteSpace: 'nowrap'}}>
          <span style={{color: 'red', marginRight: '5px'}}>CI</span>
         </span>}
                    requiredMessage={" "}
                    required
                    hasFeedback
                    asterisk={false}
          >
            <Input
              name="ciDec"
              trim
              addonTextAfter="10进制"
              onChange={(val) => onSidDECChange(val, 'ciDec', 'ciHex')}
            />
            <Input
              name="ciHex"
              style={{marginTop: '10px'}}
              trim
              addonTextAfter="16进制"
              onChange={(val) => onSidHEXChange(val, 'ciHex', 'ciDec')}
            />
          </FormItem>
          <div className='buttonBox'>
            <Form.Submit type="primary" validate htmlType="submit" onClick={(e, v) => handleSubmit(e, v)}>查询</Form.Submit>
            <Button type="secondary" onClick={clearMap}>清空</Button>
          </div>
        </div>
      </Form>

    </div>
  )
}
