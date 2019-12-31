import React, { Component } from 'react';
import { Message } from '@alifd/next';
import goalIcon from './images/goal.svg';
import linkIcon from './images/link.svg';
import recoveryIcon from './images/recovery.svg';
import refuseIcon from './images/refuse.svg';
import checkIcon from './images/check.svg';
import sendIcon from './images/send.svg';
import checkinIcon from './images/checkin.svg';
import sendMailIcon from './images/send-mail.svg';
import './index.module.scss';

const mockData = [
  {
    img: goalIcon,
    title: '终本案件',
    count: 0,
    backgroundColor: '#ee706d',
  },
  {
    img: linkIcon,
    title: '登记立案待立案',
    count: 1,
    backgroundColor: '#5e83fb',
  },
  {
    img: recoveryIcon,
    title: '待恢复立案',
    count: 3,
    backgroundColor: '#f7da47',
  },
  {
    img: refuseIcon,
    title: '本案立案庭拒签',
    count: 0,
    backgroundColor: '#58ca9a',
  },
  {
    img: checkIcon,
    title: '已收案待立案',
    count: 1,
    backgroundColor: '#5e83fb',
  },
  {
    img: sendIcon,
    title: '已收案待发送',
    count: 2,
    backgroundColor: '#f7da47',
  },
  {
    img: checkinIcon,
    title: '已申请保全待立案',
    count: 0,
    backgroundColor: '#58ca9a',
  },
  {
    img: sendMailIcon,
    title: '执保已立案待发送',
    count: 1,
    backgroundColor: '#ee706d',
  },
];

export default class Transaction extends Component {
  handleClick = () => {
    Message.success('功能未开发');
  };

  render() {
    return (
      <div className="transaction container">
        <div className="card">
          <h4 className="title">任务区</h4>
          <div className="content">
            {mockData.map((item, index) => {
              return (
                <div
                  className="item"
                  key={index}
                  onClick={this.handleClick}
                >
                  <div
                    className="image"
                    style={{
                      background: `${item.backgroundColor}`,
                    }}
                  >
                    <img src={item.img} className="iconImage" alt="" />
                  </div>
                  <p className="itemTitle">
                    {item.title}{' '}
                    <span className="count">{item.count}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
