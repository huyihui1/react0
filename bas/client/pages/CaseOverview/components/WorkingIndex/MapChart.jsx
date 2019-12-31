import React, {Component} from 'react';
import echarts from 'echarts';
import china from 'echarts/map/json/china-cities';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as caseOverviewActions} from '../../../../stores/caseOverview';

echarts.registerMap('china', china);

class MapChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('mapChart'), 'light');
    setTimeout(() => {
      this.initMap(myChart);
    }, 200)
  }

  initMap(myChart) {
    const option = {
      title: {
        y: '',
        text: '',
        textStyle: {
          fontWeight: 700,
        },
        x: 'center',
        show: false,
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
        // right: '20%',
        // right: '20%',
        // top: 0,
        // bottom: 10,
        // position:'right',
        // width: '50%',
        // right:'50%',
        layoutSize: 338,
        layoutCenter: ['40%', '50%'],
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
        zoom: 1.1
      },
        {
          name: 'barSer',
          type: 'bar',
          roam: false,
          visualMap: false,
          zlevel: 2,
          barMaxWidth: 5,
          // left:100,
          itemStyle: {
            normal: {
              color: '#40a9ed'
            },
            emphasis: {
              color: "#3596c0"
            }
          },
          label: {
            normal: {
              show: false,
              position: 'right',
              offset: [0, 10]
            },
            emphasis: {
              show: false,
              position: 'right',
              offset: [10, 0]
            }
          },
          data: []
        }
      ],
      grid: {
        right: '5%',
        top: 60,
        bottom: 40,
        // left: 450,
        width: '10%'
      },
      tooltip: {
        // axisPointer: {
        //   type: 'shadow',
        // },
        // trigger: 'item',
        // extraCssText: 'border-radius: 0px;',
        // textStyle: {
        //   fontSize: 12,
        // },
        show: true,
        formatter: function (params) {
          if (params.data) {
            return params.name + '：' + params.data.value
          } else {
            return params.name + '：'
          }
        },
      },
      visualMap: [{
        min: 0,
        max: 1,
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
        right: 'right',
        bottom: 20,
      }],
      xAxis: {
        type: 'log',
        scale: true,
        position: 'top',
        splitNumber: 5,
        boundaryGap: false,
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        // axisLabel: {
        //   margin: 2,
        //   textStyle: {
        //     color: '#aaa'
        //   }
        // }
        axisLabel: {
          show: false
        }
      },

      yAxis: {
        type: 'category',
        nameGap: 16,
        splitNumber: 5,
        inverse: true,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#ddd'
          }
        },
        axisTick: {
          show: false,
          lineStyle: {
            color: '#ddd'
          }
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: '#999'
          }
        },
        data: []
      },
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
    myChart.showLoading();
    this.fetchData(myChart);
  }

  fetchData(myChart) {
    const {getGeoDistCaseOverview} = this.props.actions;
    const {caseId} = this.props;
    getGeoDistCaseOverview({case_id: caseId}).then(res => {
      const newData = [];
      const yData = [];

      res.body.data.forEach(item => {
        for (let key in item) {
          let obj = {
            name: key,
            value: item[key]
          };
          yData.push(key)
          newData.push(obj)
        }
      });

      if (yData.length === 0){
        myChart.setOption({
          series:[{
            name:'城市',
            layoutCenter:['50%','50%']
          }]
        })
      }

      myChart.hideLoading();
      myChart.setOption({
        series: [{
          // 根据名字对应到相应的系列
          name: '城市',
          data: newData,
        },
          {
            name: 'barSer',
            data: newData.slice(0, 15)
          }
        ],
        yAxis: {
          data: yData.slice(0, 15)
        },
        visualMap: [{
          max: parseInt(newData[0].value),
          min: parseInt(newData[newData.length - 1].value)
        }]
      });
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <div style={styles.container}>
        <div id="mapChart" style={{height: '300px'}}/>
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
    actions: bindActionCreators({...caseOverviewActions}, dispatch),
  }),
)(MapChart);
