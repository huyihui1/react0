import React, { Component, Fragment } from 'react';
import echarts from 'echarts';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../../stores/mutual';
import EmptyEchart from '../../../components/NoData/EmptyEchart'

function renderItem(params, api) {
  const values = [api.value(0), api.value(1)];
  const coord = api.coord(values);
  const size = api.size([1, 1], values);
  return {
    type: 'sector',
    shape: {
      cx: params.coordSys.cx,
      cy: params.coordSys.cy,
      r0: coord[2] - size[0] / 2,
      r: coord[2] + size[0] / 2,
      startAngle: -(coord[3] + size[1] / 2),
      endAngle: -(coord[3] - size[1] / 2),
    },
    style: api.style({
      fill: api.visual('color'),
    }),
  };
}

class HourDistAndWeekDist extends Component {
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
    actions.fetchCountByWeekhourMutual({ case_id: caseId, criteria }).then(res => {
      if (res.body.meta && res.body.meta.success) {
        const data = [];
        res.body.data.forEach(item => {
          const t = [];
          t[0] = item.weekday - 1;
          t[1] = item.started_hour_class * 1 + 4 >= 24 ? (item.started_hour_class * 1 + 4) - 24 : item.started_hour_class * 1 + 4;
          t[2] = item.count;
          data.push(t);
        });
        const myChart = echarts.init(document.getElementById('hourDist'), 'light');
        this.initMap2(myChart, data);
      }
    });
  }

  initMap2(myChart, data) {
    const hours = ['0时', '1时', '2时', '3时', '4时', '5时', '6时',
      '7时', '8时', '9时', '10时', '11时',
      '12时', '13时', '14时', '15时', '16时', '17时',
      '18时', '19时', '20时', '21时', '22时', '23时'];
    const days = ['周一', '周二', '周三',
      '周四', '周五', '周六', '周日'];
    let maxValue = 0
    if (data.length > 0) {
      maxValue = echarts.util.reduce(data, (max, item) => {
        return Math.max(max, item[2]);
      }, -Infinity);
    }
    const option = {
      title: [
        {
          text: '时间段分布',
          left: 'center',
          top: 10,
        },
      ],
      legend: {
        show: false,
        data: ['时间分布'],
      },
      polar: {
        radius: '70%',
      },
      tooltip: {
        formatter: (params) => {
          return `${params.marker} ${params.name} ${params.data[1]}时 ${params.data[2]}`
        }
      },
      visualMap: {
        type: 'continuous',
        min: 0,
        max: maxValue,
        left: 'center',
        dimension: 2,
        calculable: true,
        color: ['#3686e7', '#bcfdd6'],
        orient: 'horizontal',
      },
      angleAxis: {
        type: 'category',
        data: hours,
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ddd',
            type: 'dashed',
          },
        },
        axisLine: {
          show: false,
        },
      },
      radiusAxis: {
        type: 'category',
        data: days,
        z: 100,
      },
      series: [{
        name: '时间段分布',
        type: 'custom',
        coordinateSystem: 'polar',
        itemStyle: {
          normal: {
            color: '#d14a61',
          },
        },
        renderItem,
        data,
      }],
    };

    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
  }


  render() {
    return (
      <Fragment>
        <div id="hourDist" style={{ height: '100%', display: this.state.criteria ? 'block' : 'none' }} />
        <div style={{height: '100%', display: this.state.criteria ? 'none' : 'block'}}>
          <EmptyEchart/>
        </div>
      </Fragment>
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
)(HourDistAndWeekDist);

