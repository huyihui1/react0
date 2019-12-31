import React, { Component } from 'react';
import echarts from 'echarts';
import china from 'echarts/map/json/china-cities';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as caseOverviewActions } from '../../../stores/caseOverview';
import ajaxs from '../../../utils/ajax';
import appConfig from "../../../appConfig";

echarts.registerMap('china', china);

class DistributionOfCallsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      config: null,
    };
    this.fetchData = this.fetchData.bind(this);
    this.initMap = this.initMap.bind(this);
  }
  componentDidMount() {
    const myChart = echarts.init(document.getElementById('mapChart2'), 'light');
    this.initMap(myChart);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.config && JSON.stringify(nextProps.config) !== JSON.stringify(this.state.config)) {
      if (nextProps.config.caseId && nextProps.config.num) {
        this.fetchData(nextProps.config);
      }
    }
  }

  initMap(myChart) {

    const option = {
      title: {
        text: '通话地分布',
        left: 'center',
        top: 10,
        show: false
      },
      color: [
        '#1A75CF',
        '#FFA51B',
        '#EF635C',
        '#7FBAC4',
        '#48A47D',
        '#BCB52B',
        '#B46A88',
        '#B29688',
        '#9FACA4',
        '#6B6B6B',
      ],
      series: [{
        data: [],
        top: 60,
        showLegendSymbol: false,
        name: '城市',
        itemStyle: {
          emphasis: {
            areaColor: '#1B74CF',
          },
        },
        selectedMode: 'multiple',
        label: {
          emphasis: {
            show: false,
          },
          normal: {
            show: false,
          },
        },
        mapType: 'china',
        map: 'china',
        roam: 'move',
        type: 'map',
        // left: 0,
        zoom: 1.1,
      }],
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        trigger: 'item',
        extraCssText: 'border-radius: 0px;',
        textStyle: {
          fontSize: 12,
        },
      },
      visualMap: [{
        min: 0,
        max: 5000,
        // itemHeight: 12,
        show: true,
        text: ['多', '少'],
        dimension: 0,
        itemWidth: 12,
        seriesIndex: 0,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered'],
        },
        type: 'continuous',
        // top: 'top',
        // left: 'left',
        right: 10,
        bottom: 20,
      }],
      xAxis: [{
        nameLocation: 'middle',
        splitNumber: '10',
        minInterval: 1,
        name: '',
        show: false,
        data: null,
        axisLabel: {
          textStyle: {
            color: '#787878',
            fontSize: 10,
          },
          inside: false,
          rotate: 0,
          show: true,
        },
        boundaryGap: [
          '10%',
          '10%',
        ],
        nameTextStyle: {
          color: '#787878',
          fontSize: 10,
        },
        nameGap: 35,
        axisLine: {
          lineStyle: {
            color: '#A6A6A6',
          },
          show: true,
        },
        triggerEvent: true,
        z: 10,
        type: 'category',
        axisTick: {
          show: false,
        },
      }],
      ext_js_list: [],
      toolbox: {
        feature: {
          restore: {
            show: true,
          },
          saveAsImage: {
            show: true,
          },
          dataView: {
            readOnly: false,
            show: true,
          },
          mark: {
            show: true,
          },
          myDownloadData: {
            title: '\u4e0b\u8f7d\u6570\u636e',
            icon: 'image://http://echarts.baidu.com/images/favicon.png',
            onclick: self.downloadData,
            show: true,
          },
          myShowOption: {
            title: '\u7f16\u8f91',
            icon: 'image://http://echarts.baidu.com/images/favicon.png',
            onclick: self.showOption,
            show: true,
          },
          myGoBack: {
            title: '\u8fd4\u56de',
            icon: 'image://http://echarts.baidu.com/images/favicon.png',
            onclick: self.goBack,
            show: false,
          },
        },
        show: false,
      },
      legend: {
        textStyle: {
          padding: 0,
          lineHeight: 10,
          fontSize: 10,
        },
        show: false,
        itemHeight: 12,
        itemGap: 5,
        padding: 0,
        itemWidth: 12,
        pageTextStyle: {},
        data: [
          'Province',
        ],
        left: 'left',
      },
    };
    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
    this.setState({
      myChart
    }, () => {
      this.fetchData(this.props.config)
    })
  }

  fetchData(params) {
    const { caseId } = this.props;
    const { myChart } = this.state;
    myChart.showLoading({text: appConfig.LOADING_TEXT});
    ajaxs.get(`/cases/${caseId}/pbills/${params.num}/geo-dist`).then(res => {
      const newData = [];
      res.data.forEach(item => {
        newData.push({
          name: item.peer_comm_loc,
          value: item.count,
        });
      })
      setTimeout(() => {
        myChart.hideLoading();
        myChart.setOption({
          series: [{
            // 根据名字对应到相应的系列
            name: '城市',
            data: newData,
          }],
        });
      }, 800)
      this.setState({
        config: params,
      });
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <div style={styles.container}>
        <div id="mapChart2" style={{ height: '400px' }} />
      </div>
    );
  }
}

const styles = {
  container: {
    height: '100%',
    position: 'relative',
  },
  average: {
    position: 'absolute',
    top: '-10px',
    textAlign: 'center',
    width: '100%',
    fontSize: '12px',
    textIndent: '20px',
    color: '#999',
  },
  number: {
    color: '#5e83fb',
  },
};

export default connect(
  state => ({
    caseOverviews: state.caseOverviews,
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...caseOverviewActions }, dispatch),
  }),
)(DistributionOfCallsChart);
