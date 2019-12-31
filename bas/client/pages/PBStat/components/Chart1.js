import React, { Component } from 'react';
import echarts from 'echarts';

import ChartTitle from './ChartTitle';
import ExcelView from './ExcelView';

import { downloadIamge } from '../../../utils/utils';


const mockData = [
  {
    dialing: 709,
    called: 327,
    total: 1036,
  },
  {
    dialing: 709,
    called: 327,
    total: 1036,
  },
  {
    dialing: 709,
    called: 327,
    total: 1036,
  },
  {
    dialing: 709,
    called: 327,
    total: 1036,
  },
  {
    dialing: 709,
    called: 327,
    total: 1036,
  },
  {
    dialing: 709,
    called: 327,
    total: 1036,
  },
  {
    dialing: 709,
    called: 327,
    total: 1036,
  },
  {
    dialing: 709,
    called: 327,
    total: 1036,
  },
];

class Chart1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: true,
      myChart: null,
    };
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
  }
  componentDidMount() {
    const c3 = echarts.init(document.getElementById('c3'));
    this.initC3(c3);
  }
  //  时间+组成+总数
  initC3(c3) {
    const xData = (function () {
      const data = [];
      for (let i = 1; i < 13; i++) {
        data.push(`${i}月份`);
      }
      return data;
    }());

    this.setState({
      myChart: c3,
    });
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          textStyle: {
            color: '#fff',
          },

        },
      },
      grid: {
        borderWidth: 0,
        top: 110,
        bottom: 95,
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        x: '4%',
        top: '8px',
        textStyle: {
          color: '#90979c',
        },
        data: ['主叫', '被叫', '总数'],
      },


      calculable: true,
      xAxis: [{
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#90979c',
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        axisLabel: {
          interval: 0,

        },
        data: xData,
      }],
      yAxis: [{
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#90979c',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,

        },
        splitArea: {
          show: false,
        },

      }],
      dataZoom: [{
        show: true,
        height: 30,
        xAxisIndex: [
          0,
        ],
        bottom: 30,
        start: 10,
        end: 80,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#ccc',

        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#444a4f',


      }, {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35,
      }],
      series: [{
        name: '主叫',
        type: 'bar',
        stack: '总量',
        barMaxWidth: 35,
        barGap: '10%',
        itemStyle: {
          normal: {
            color: 'rgba(255,144,128,1)',
            label: {
              show: true,
              textStyle: {
                color: '#fff',
              },
              position: 'insideTop',
              formatter(p) {
                return p.value > 0 ? (p.value) : '';
              },
            },
          },
        },
        data: [
          709,
          1917,
          2455,
          2610,
          1719,
          1433,
          1544,
          3285,
          5208,
          3372,
          2484,
          4078,
        ],
      },

      {
        name: '被叫',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          normal: {
            color: 'rgba(0,191,183,1)',
            barBorderRadius: 0,
            label: {
              show: true,
              position: 'top',
              formatter(p) {
                return p.value > 0 ? (p.value) : '';
              },
            },
          },
        },
        data: [
          327,
          1776,
          507,
          1200,
          800,
          482,
          204,
          1390,
          1001,
          951,
          381,
          220,
        ],
      }, {
        name: '总数',
        type: 'line',
        stack: '总量',
        symbolSize: 10,
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: 'rgba(252,230,48,1)',
            barBorderRadius: 0,
            label: {
              show: true,
              position: 'top',
              formatter(p) {
                return p.value > 0 ? (p.value) : '';
              },
            },
          },
        },
        data: [
          1036,
          3693,
          2962,
          3810,
          2519,
          1915,
          1748,
          4675,
          6209,
          4323,
          2865,
          4298,
        ],
      },
      ],
    };
    window.addEventListener('resize', () => {
      if (this.state.isChart) {
        c3.resize();
      }
    });
    c3.setOption(option);
  }

  handleChart(bool) {
    this.setState({
      isChart: bool,
    });
  }

  getImgURL() {
    downloadIamge(this.state.myChart, '话单通话统计');
  }

  getExcel() {

  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="话单通话统计" styles={{marginBottom: '18px'}} handleChart={this.handleChart} getImgURL={this.getImgURL} getExcel={this.getExcel} />
        <div id="c3" style={{ height: 500, display: this.state.isChart ? 'block' : 'none' }} />
        {
          !this.state.isChart ? <ExcelView id="chart1" /> : null
        }
      </div>
    );
  }
}

export default Chart1;
