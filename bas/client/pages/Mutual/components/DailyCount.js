import React, {Component} from 'react';
import echarts from 'echarts';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../../stores/mutual';
import EmptyEchart from '../../../components/NoData/EmptyEchart'


class DailyCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: null,
      myChart: null,
      criteria: null,
      dailyCounList: []
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('dailyBar'), 'light');
    this.initMap(myChart);

    this.setState({dailyCounList: []})
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
    const {actions, caseId} = this.props;
    actions.fetchDailyCountMutual({case_id: caseId, criteria}).then(res => {
      console.log(res);
      if (res.body.meta && res.body.meta.success) {
        this.setState({dailyCounList: res.body.data});
        const t = [];
        res.body.data.forEach(item => {
          t.push([item.started_day, item.daily_count]);
        });

        console.log(t);
        this.state.myChart.setOption({
          series: {
            data: t,
          },
        });
        this.state.myChart.resize()

      }
    });
  }

  initMap(myChart) {
    this.setState({
      myChart,
    });
    const option = {
      title: {
        text: '每日联系情况',
        left: 'center',
        top: 10,
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: [],
        type: 'bar',
        barMaxWidth:'10'
      }],
    };
    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
  }

  render() {
    return (
      <div style={{height: '100%',}}>
        <div id="dailyBar"
             style={{height: '100%', display: this.state.dailyCounList.length > 0 ? 'block' : 'none'}}/>
        <div style={{height: '100%', display: this.state.dailyCounList.length === 0 ? 'block' : 'none'}}>
          <EmptyEchart/>
        </div>
      </div>
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
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(DailyCount);

