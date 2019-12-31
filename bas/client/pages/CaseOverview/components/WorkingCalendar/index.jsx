import React, { Component } from 'react';
import { Calendar } from '@alifd/next';
import './index.module.scss';

export default class WorkingCalendar extends Component {
  static displayName = 'WorkingCalendar';

  render() {
    return (
      <div className="workingCalendar container">
        <div className="card">
          <h4 className="title">案件日历</h4>
          <Calendar shape="card" className="calendar" />
        </div>
      </div>
    );
  }
}
