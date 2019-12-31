import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import echarts from 'echarts';

import {actions} from '../../../stores/pbStat';
import {downloadIamge} from '../../../utils/utils';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../utils/hotColsDef'


const mockData = [{
  0: 335,
  11: 310,
  12: 123,
  13: 234,
  21: 78,
  22: 65,
  31: 121,
  32: 78,
}];

const chartData = (data) => {
  const arr = [];
  for (const key in data) {
    let k = null;
    if (key == 0) {
      k = '未知';
    } else if (key == 11) {
      k = '主叫';
    } else if (key == 12) {
      k = '<---';
    } else if (key == 13) {
      k = '呼转';
    } else if (key == 21) {
      k = '主短';
    } else if (key == 22) {
      k = '被短';
    } else if (key == 31) {
      k = '主彩';
    } else if (key == 32) {
      k = '被彩';
    }
    arr.push(data[key]);
  }
  return arr;
};


class PeercommlocChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      peercommlocItems: [],
      colHeaders: ['地点', '通话次数', '在该地出现的对方号码数'],
      criteria: [],
      hotSetting: {
        columns: columns.PeercommlocChart,
      },
      drilldownOptions: {
        '通话次数': ['peer_comm_loc'],
      },
    };
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {

  }


  initC3(myChart) {
    this.setState({
      myChart,
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
        data: ['次数'],
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
        data: [],
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
        minValueSpan: 22,
        bottom: 30,
        start: 0,
        end: 20,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#ccc',

        },
        textStyle: {
          color: '#fff',
        },
        borderColor: '#444a4f',
      },
        {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35,
        }],
      series: [{
        name: '次数',
        type: 'bar',
        barMaxWidth: 35,
        barGap: '10%',
        itemStyle: {
          normal: {
            color: '#3398DB',
            label: {
              show: true,
              textStyle: {
                color: '#444a4f',
              },
              position: 'top',
              // formatter(p) {
              //   return p.value > 0 ? (p.value) : '';
              // },
            },
          },
        },
        data: [],
      },
      ],
    };
    window.addEventListener('resize', () => {
      if (this.state.isChart) {
        myChart.resize();
      }
    });
    myChart.setOption(option);
  }

  handleChart(bool) {
    this.setState({
      isChart: bool,
    });
  }

  getImgURL() {
    downloadIamge(this.state.myChart, 'F5-对方通话地统计');
  }

  getExcel() {

  }

  fetchData(params) {
    if (params) {
      const {fetchPeercommlocChart} = this.props.actions;
      fetchPeercommlocChart({case_id: this.props.caseId, ...{criteria: params, view: {}}});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && this.state.criteria !== nextProps.search.criteria) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
      });
    }
    if (nextProps.peercommlocItems && nextProps.peercommlocItems.length > 0 && this.state.peercommlocItems !== nextProps.peercommlocItems) {
      const head = [];
      const body = [];
      const myChart = echarts.init(document.getElementById('peercommlocChart'), 'light');

      nextProps.peercommlocItems.forEach(item => {
        head.push(item.pcl);
        let obj = {
          name: item.pcl,
          value: item.count
        };
        body.push(obj)
      });

      this.initC3(myChart);
      this.setState({
        peercommlocItems: nextProps.peercommlocItems,
      }, () => {
        this.state.myChart.setOption({
          xAxis: {
            data: head,
          },
          series: [{
            name: '次数',
            data: body,
          }],
        });
      });
    }
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title="F5-对方通话地统计" align="center" handleChart={this.handleChart} getImgURL={this.getImgURL}
                    getExcel={this.getExcel}/>
        <ExcelView id="peercommlocExcel" colHeaders={this.state.colHeaders} data={this.props.peercommlocList}
                   hotSetting={this.state.hotSetting || null}
                   drilldown={this.state.drilldownOptions}/>
        <div id="peercommlocChart" className="noDraggable" className={'pbStatChart'}/>
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    peercommlocList: state.pbStat.peercommlocList,
    peercommlocItems: state.pbStat.peercommlocItems,
    search: state.search,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(PeercommlocChart);
