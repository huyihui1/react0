import React, { useState, useEffect } from 'react';
import { Balloon } from '@alifd/next';


export default function Login() {

  useEffect(() => {

  }, []);

  const onVisibleChange = (visible) => {
    console.log(visible);
    if (visible) {

    }
  }

  return (
    <Balloon trigger={<div className="user"></div>} align="bl" triggerType={'hover'} shouldUpdatePosition style={{width: 300}} onVisibleChange={onVisibleChange}>
      <div className="user-info">
        <div className="qrcode">
          <div style={{width: '100px', height: '100px', backgroundColor: '#eee'}}>

          </div>
        </div>
        <div className="text">
          今天还有 53 次免费查询可用
        </div>
      </div>
    </Balloon>
  );
}
