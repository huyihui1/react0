import React, { useState, useEffect } from 'react';
import { Select } from '@alifd/next';


const SingleSelect = (props) => {
  const [value, setValue] = useState([]);
  const handleChange = value => {
    const { name, onFormChange, values } = props;
    let val = value.slice(-1)
    values[name] = val
    onFormChange(values)
    setValue(val);
  };
  return (
    <Select {...props.componentProps} style={{ width: '100%', position: 'relative' }} value={props.values[props.name] || value} onChange={handleChange} dataSource={props.dataSource} />
  );
};

export default SingleSelect;
