import React, {Component} from 'react';
import echarts from 'echarts';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../../stores/mutual';
import EmptyEchart from '../../../components/NoData/EmptyEchart'


class CalcOnSetsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      dataSource: []
    };
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('calcOnSetsChart'), 'light');
    this.initMap(myChart);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.calcOnSets.items && JSON.stringify(nextProps.calcOnSets.items) !== JSON.stringify(this.state.dataSource)) {
      const {myChart} = this.state;
      const calcOnSetsItems = nextProps.calcOnSets.items;
      const arr = Array(nextProps.setCount).fill();
      let t = [];
      arr.forEach((item, index) => {
        let k = `s${index + 1}`;
        let data = [];
        let name = []
        t.push(k)
        calcOnSetsItems.forEach(item => {
          if (nextProps.meter === 'pbrs') {
            name.push(item.peer_num)
            data.push({
              key: k,
              name: item.peer_num,
              value: item[`${k}_count`] || 0
            })
          } else {
            name.push(item.owner_ct_code)
            data.push({
              key: k,
              name: item.owner_ct_code,
              value: item[`${k}_count`] || 0
            })
          }

        })
        myChart.setOption({
          xAxis: {
            data: name
          },
          legend: {
            data: t
          },
          series: [{
            name: k,
            type: 'line',
            data,
          }],
        });
      });
      this.setState({
        dataSource: JSON.parse(JSON.stringify(nextProps.calcOnSets.items))
      })
    }
  }


  initMap(myChart) {
    this.setState({
      myChart,
    });
    const option = {
      title: {
        text: '图形化显示'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data:[]
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      dataZoom: [
        {
          type: 'inside',
          minValueSpan: 20,
        }, {
          start: 0,
          end: 100,
          minValueSpan: 10,
          bottom: 0,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
        }
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:'s1',
          type:'line',
          symbolSize: 8,
          data:[]
        },
        {
          name:'s2',
          type:'line',
          symbolSize: 8,
          data:[]
        },
        {
          name:'s3',
          type:'line',
          symbolSize: 8,
          data:[]
        },
        {
          name:'s4',
          type:'line',
          symbolSize: 8,
          data:[]
        },
      ]
    };

    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
  }

  render() {
    const {calcOnSets} = this.props;
    return (
      <div style={{height: document.documentElement.offsetHeight || document.body.offsetHeight}}>
        <div style={{height: '100%', display: calcOnSets.items.length === 0 ? 'block' : 'none'}}>
          <EmptyEchart/>
        </div>
        <div id="calcOnSetsChart"
             style={{height: '100%', opacity: calcOnSets.items.length > 0 ? 1 : 0}}/>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    calcOnSets: state.calcOnSets,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(CalcOnSetsChart);

