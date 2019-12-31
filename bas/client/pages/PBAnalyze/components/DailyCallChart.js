import React, {Component} from 'react';
import echarts from 'echarts';
import solarLunar from 'solarlunar';
import moment from 'moment';
import ajaxs from '../../../utils/ajax';
import appConfig from '../../../appConfig';
import EmptyEchart from '../../../components/NoData/EmptyEchart'

class DailyCallChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: null,
      myChart: null,
      dailyCallArr: null
    };
  }

  // getDayAll(begin, end) {
  //   const dateAllArr = new Array();
  //   const ab = begin.split('-');
  //   const ae = end.split('-');
  //   const db = new Date();
  //   db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  //   const de = new Date();
  //   de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  //   const unixDb = db.getTime();
  //   const unixDe = de.getTime();
  //   for (let k = unixDb; k <= unixDe;) {
  //     dateAllArr.push([moment(k).format("YYYY-MM-DD"), 0])
  //     // dateAllArr.push((new Date(parseInt(k))).format().toString());
  //     k += 24 * 60 * 60 * 1000;
  //   }
  //   return dateAllArr;
  // }


  componentDidMount() {
    const myChart = echarts.init(document.getElementById('dailyBar'), 'light');
    this.initMap(myChart);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.config && JSON.stringify(nextProps.config) !== JSON.stringify(this.state.config)) {
      if (nextProps.config.caseId && nextProps.config.num) {
        this.fetchData(nextProps.config);
      }
    }
  }

  fetchData(params) {
    ajaxs.get(`/cases/${params.caseId}/pbills/${params.num}/daily-cnt`).then(res => {
      if (res.meta && res.meta.success) {
        const t = [];
        const {summaryDate} = this.props;
        console.log(summaryDate);
        if (res.data.length === 0) {
          this.state.myChart.setOption({
            series: {
              data: t,
            },
          });
          this.state.myChart.hideLoading()
          this.setState({
            dailyCallArr: res.data
          })
          return
        }
        // if (res.data[0].started_day != summaryDate.startDate) {
        //   t.push([summaryDate.startDate, 0]);
        // }
        res.data.forEach(item => {
          t.push([item.started_day, item.count]);
        });
        // if (res.data[res.data.length - 1].started_day != summaryDate.endDate) {
        //   t.push([summaryDate.endDate, 0]);
        // }
        this.state.myChart.setOption({
          series: {
            data: t,
          },
        });
        this.setState({
          config: params
        })
        this.state.myChart.hideLoading()
      } else {
        this.state.myChart.hideLoading()
      }
    });
  }

  initMap(myChart) {
    this.setState({
      myChart,
    });
    const option = {
      title: {
        text: '每日通话情况',
        left: 'center',
        top: 10,
        show: false
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
        formatter: (params) => {
          const date = new Date(params[0].value[0]);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const solar2lunarData = solarLunar.solar2lunar(year, month, day);
          return `${params[0].value[0]}<br />${solar2lunarData.monthCn}${solar2lunarData.dayCn}<br />${solar2lunarData.ncWeek}<br />${params[0].value[1]}次`;
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: [],
        type: 'bar',
      }],
    };
    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
    myChart.showLoading({text: appConfig.LOADING_TEXT});
    this.fetchData(this.props.config)
  }

  render() {
    return (
      <div style={{height: '300px'}}>
        {
          this.state.dailyCallArr && this.state.dailyCallArr.length === 0 ? (
            <EmptyEchart />
          ) : (
            <div id="dailyBar" style={{height: '100%'}} />
          )
        }
      </div>
    );
  }
}

export default DailyCallChart;
