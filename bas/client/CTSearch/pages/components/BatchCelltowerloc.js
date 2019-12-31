import React, {useState} from 'react'
import { Radio, Form, Input, Button } from '@alifd/next';

const FormItem = Form.Item;

export default function BatchCelltowerloc(props) {
  const [formData, setFormData] = useState({})
  const [radioVal, setRadioVal] = useState(10)

  const onRadioChange = (value) => {
    setRadioVal(value)
  }

  const handleSubmit = (e, v) => {
    if (!v) {
      let params = {
        ct_codes: [],
        coord: 2,
        fmt: radioVal
      }
      let {codes} = e
      codes = codes.split(/[\r\n]/);
      for (let i = 0; i < codes.length; i++) {
        if (codes[i] === "") {
          codes.splice(i--, 1)
        } else {
          const code = codes[i].replace(/\s+/g, '');
          codes[i] = code;
        }
      }
      params.ct_codes = codes
      console.log(params);
    }
  }

  const clearMap = () => {

  }


  return (
    <div className={'classicaIInput'}>
      <div style={{textAlign: 'left', margin: '10px 0', paddingLeft: '15px'}}>
        <span>
          <h3 style={{color: 'red'}}>格式要求：</h3>
           <p>每行一条基站代码，基站代码的样式为 <span style={{color: 'red'}}>LAC:CI:MNC</span></p>
          <h4>MNC取值:</h4>
          <p>10进制: 0-移动 1-联通 11-电信</p>
          <p>10进制: 0-移动 1-联通 11-电信</p>
        </span>
      </div>
      <Radio.Group
        defaultValue={radioVal}
        onChange={onRadioChange}
      >
        <Radio value={10}>10进制</Radio>
        <Radio value={16}>16进制</Radio>
      </Radio.Group>
      <Form
        value={formData}
        labelAlign="top"
        labelTextAlign='left'
        style={{textAlign: 'initial', marginTop: '10px'}}
      >
        <div>
          <FormItem requiredMessage={" "}
                    required
                    asterisk={false}
          >
            <Input.TextArea
              name="codes"
              placeholder=""
              // maxLength={5000}
              rows={8}
              // hasLimitHint
            />
          </FormItem >
        </div>
        <div>
          <div className='buttonBox'>
            <Form.Submit type="primary" validate htmlType="submit" onClick={(e, v) => handleSubmit(e, v)}>查询</Form.Submit>
            <Button type="secondary">轨迹</Button>
            <Button type="secondary" onClick={clearMap}>清空</Button>
          </div>
        </div>
      </Form>

    </div>
  )
}
