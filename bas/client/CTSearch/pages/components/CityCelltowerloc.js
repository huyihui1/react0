import React, {useState, useEffect} from 'react'
import { Radio, Form, Input, Button, Select } from '@alifd/next';
import ajaxs from '../../utils/ajaxs';

const FormItem = Form.Item;

export default function CityCelltowerloc(props) {
  const [formData, setFormData] = useState({
    mncDec: 0,
    mncHex: 0,
    ciDec: '',
    ciHex: '',
  })
  const [radioVal, setRadioVal] = useState('移动')
  const [provinceList, setProvinceList] = useState([])
  const [cityList, setCityList] = useState([])
  const [city, setCity] = useState('')

  useEffect(() => {
    getStateList();
  }, [])

  const getStateList = () => {
    ajaxs.get('/utils/provinces').then(res => {
      if (res.meta.success) {
        let arr = res.data[0];
        let stateData = [];
        let obj = {};
        for (let key in arr) {
          obj = {
            label: key,
            value: arr[key],
            code: arr[key]
          }
          stateData.push(obj)
        }
        setProvinceList(stateData)
      }
    })
  };
  const getCityList = (code) => {
    let city = null;
    provinceList.forEach(item => {
      if (item.code == code) {
        if (item.label.indexOf('市') !== -1) {
          city = item.label
        }
      }
    });

    ajaxs.get('/utils/provinces/' + code + '/cities').then(res => {
      if (res.meta.success) {
        let arr = res.data[0]
        let cityData = [];
        let obj = {};
        for (let key in arr) {
          obj = {
            label: key,
            value: city ? city : key,
          };
          cityData.push(obj)
        }
        setCityList(cityData)
        setCity(cityData[0].value)
      }
    })
  };

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
    const { ciHex, mncHex} = e;
    let params = {
      city,
      ci: ciHex,
      mnc: mncHex
    }
    console.log(params);
  }

  const clearMap = () => {

  }

  const handleProvinceChange = (value) => {
    getCityList(value)
  }

  const handleCityChange = (value) => {
    console.log(value);
    setCity(value)
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
          <FormItem label={ <span style={{whiteSpace: 'nowrap'}}>
          <span style={{color: 'red', marginRight: '5px'}}>城市</span>
         </span>}
                    requiredMessage={" "}
                    required
                    asterisk={false}
          >
            <Select
              placeholder="省"
              dataSource={provinceList}
              onChange={handleProvinceChange}
              style={{width: '48%'}}
              name='province'
            />
            <Select
              placeholder="市"
              dataSource={cityList}
              value={city}
              onChange={handleCityChange}
              style={{width: '48%', marginLeft: '2%'}}
              name='city'
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
