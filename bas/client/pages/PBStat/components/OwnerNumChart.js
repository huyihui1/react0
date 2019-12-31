import React, { Component } from 'react';
import {Icon, Balloon} from '@alifd/next';

import Chart1 from './Chart1';
import Chart3 from './Chart3';


class OwnerNumChart extends Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <div className="chart-box">
          <Chart1 />
        </div>
        <div className="chart-box">
          <Chart3 />
        </div>
      </div>
    );
  }
}

export default OwnerNumChart;
