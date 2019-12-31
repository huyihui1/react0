import React, { Component } from 'react';
import echarts from 'echarts';

class HeatMapChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
    };
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('heatMapChart'), 'light');
    this.initMap(myChart);
    this.setState({
      myChart,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dailyCntData) {
      const { dailyCntData } = nextProps;
      let year = new Date().getFullYear();
      let t;
      if (dailyCntData.length > 0) {
        year = new Date(dailyCntData[0][0]).getFullYear();
        t = [...dailyCntData];
        t.pop();
      }
      this.state.myChart.setOption({
        series: {
          data: t,
        },
        calendar: [{
          range: year,
        }],
      });
    }
  }

  initMap(myChart) {
    const option = {
      title: {
        text: '号码使用统计',
        left: 'center',
        top: 10,
      },
      tooltip: {
        position: 'top',
        formatter(p) {
          const format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
          return `${format}: ${p.data[1]}`;
        },
      },
      visualMap: {
        min: 1,
        max: 1000,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '20%',
        show: true,
        color: ['#3686e7', '#bcfdd6'],
      },

      calendar: [
        {
          left: 'center',
          cellSize: [8, 12],
          top: 100,
          // orient: 'vertical',
          range: '2019',
          // dayLabel: {
          //   margin: 5
          // },
          yearLabel: { show: false },
          dayLabel: {
            nameMap: 'cn',
          },
          monthLabel: {
            nameMap: 'cn',
          },
        }],

      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: [],
      }],
    };
    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
  }

  render() {
    return (
      <div>
        <div id="heatMapChart" style={{ height: '300px' }} />
      </div>
    );
  }
}

export default HeatMapChart;
