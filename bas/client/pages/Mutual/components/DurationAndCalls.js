import React, { Component } from 'react';
import echarts from 'echarts';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../../stores/mutual';

function renderItem(params, api) {
  var values = [api.value(0), api.value(1)];
  var coord = api.coord(values);
  var size = api.size([1, 1], values);
  return {
    type: 'sector',
    shape: {
      cx: params.coordSys.cx,
      cy: params.coordSys.cy,
      r0: coord[2] - size[0] / 2,
      r: coord[2] + size[0] / 2,
      startAngle: -(coord[3] + size[1] / 2),
      endAngle: -(coord[3] - size[1] / 2)
    },
    style: api.style({
      fill: api.visual('color')
    })
  };
}

class DurationAndCalls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: null,
      myChart: null,
      criteria: null,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('durationAndCalls'), 'light');
    this.initMap(myChart);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.search.criteria)) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      });
    }
  }

  fetchData(criteria) {
    const { actions, caseId } = this.props;
    actions.fetchDurationMutual({ case_id: caseId, criteria }).then(res => {
      if (res.body.meta && res.body.meta.success) {
        const t = [];
        res.body.data.forEach((item, index) => {
          t[index] = {};
          t[index].name = Object.keys(item)[0];
          t[index].value = Object.values(item)[0];
        });
        if (this.state.myChart) {
          this.state.myChart.setOption({
            series: [
              {
                id: 1,
                data: t,
              }
            ],
          });
        }
      }
    });
    actions.fetchCallsMutual({ case_id: caseId, criteria }).then(res => {
      if (res.body.meta && res.body.meta.success) {
        const t = [];
        res.body.data.forEach((item, index) => {
          t[index] = {};
          t[index].name = Object.keys(item)[0];
          t[index].value = Object.values(item)[0];
        });
        console.log(t);
        if (this.state.myChart) {
          this.state.myChart.setOption({
            series: [
              {
                id: 2,
                data: t,
              },
            ]
          });
        }
      }
    });
  }

  initMap(myChart) {
    this.setState({
      myChart,
    });
    const date = () => {
      const t = [];
      for (let i = 0; i < 24; i++) {
        t.push(`${i}时`);
      }
      return t;
    };
    const option = {
      title: [
        {
          text: '联系时长分布',
          left: '16%',
          top: '10'
        },{
          text: '主被叫对比',
          left: '66%',
          top: '10'
        }
      ],
      // legend: [
      //   {
      //     id: 1,
      //     orient: 'vertical',
      //     top: '20%',
      //     left: '50%',
      //
      //     data: ['1~15秒', '16~90秒', '1.5~3分', '3~5分', '5~10分', '>10分', '其他']
      //   },
      // ],
      grid: [
        {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
          height: '45%',
        },
        {
          height: '50%'
        },
      ],
      // xAxis: {
      //   type: 'category',
      //   data: date(),
      // },
      tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
      },
      // yAxis: {
      //   type: 'value',
      // },
      series: [
        {
          id: 1,
          data: [{
            name: '请选择搜索条件',
            value: 0,
          }],
          type: 'pie',
          roseType : 'radius',
          radius: ['20%', '48%'],
          center: ['25%', '50%'],
          avoidLabelOverlap: true,
        },
        {
          id: 2,
          type: 'pie',
          itemStyle: {
            normal: {
              color: function(params) {
                return ['#3feed4', '#3bafff'][params.dataIndex]
              }
            }
          },
          radius: ['20%', '48%'],
          center: ['75%', '50%'],
          avoidLabelOverlap: true,
          data: [{
            name: '请选择搜索条件',
            value: 0,
          }],
        },
      ],
    };
    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
  }

  render() {
    return (
      <div id="durationAndCalls" style={{ height: '100%' }} />
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    search: state.search,
    route: state.route,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(DurationAndCalls);

