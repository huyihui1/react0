import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import echarts from 'echarts';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlusSquare} from '@fortawesome/free-solid-svg-icons';


import { actions } from '../../../stores/connections/index';
import { actions as labelPNActions } from '../../../stores/labelPN/index';
import { downloadIamge, formatFormData } from '../../../utils/utils';
import appConfig from '../../../appConfig';


class ConnectionsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: ['类型', '次数'],
      criteria: [],
      zoom: 1,
      labelPNs: [],
      showChartButton: false
    };
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.formatChartData = this.formatChartData.bind(this);
  }
  componentDidMount() {
    const chart = document.querySelector('#connectionsChart');
    const header = document.querySelector('.ice-layout-header.ice-layout-header-normal.ice-design-layout-header');
    chart.style.height = `${document.documentElement.offsetHeight}px`;
    const myChart = echarts.init(document.getElementById('connectionsChart'), 'light');
    this.initC3(myChart);

    this.props.actions.setMyChartConnection({myChart:myChart,renderMyChart:this.renderMyChart})

  }

  renderMyChart = () => {
    const myChart = echarts.init(document.getElementById('connectionsChart'), 'light');
    this.initC3(myChart);
  };

  //  时间+组成+总数
  initC3(myChart) {
    this.setState({
      myChart,
    });
    const categories = [];
    const option = {
      title: {
        text: 'Les Miserables',
        subtext: 'Default layout',
        top: 'bottom',
        left: 'right',
        show: false,
      },
      backgroundColor: '#fff',
      tooltip: {
        // formatter: (params) => {
        //   if (params.data.num) {
        //     return ` ${params.data.name} - ${params.data.num}`;
        //   } else {
        //     return params.data.name
        //   }
        // },
      },
      legend: [{
        // selectedMode: 'single',
        data: categories.map((a) => {
          return a.name;
        }),
      }],
      animation: false,
      // geo: {
      //   zoom: 0.01
      // },
      scaleLimit: {
        min: 1,
        max: 2,
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          // name: 'Les Miserables',
          type: 'graph',
          layout: 'force',
          data: [],
          links: [],
          categories,
          roam: true,
          focusNodeAdjacency: true,
          zoom: 1.4,
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: (params) => {
                if (params.data.num) {
                  if (params.data.name.length === 11) {
                    return ` ${params.data.name.substring(params.data.name.length - 4)} - ${params.data.num}`;
                  }
                  return `${params.data.name} - ${params.data.num}`;
                }
                if (params.data.name.length === 11) {
                  return `${params.data.name.substring(params.data.name.length - 4)}`;
                }
                return `${params.data.name}`;
              },
            },
          },
          edgeLabel: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 10,
              },
              formatter: '{c}',
            },
          },
          force: {
            repulsion: 150,
            edgeLength: 100,
          },
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
    downloadIamge(this.state.myChart, '计费类型');
  }

  getExcel() {}

  async fetchData(params) {
    if (params.criteria && params.criteria.owner_num) {
      const { fetchConnections, fetchLargeLabelPN } = this.props.actions;
      fetchLargeLabelPN({ caseId: this.props.caseId }, {
        query: {
          page: 1,
          pagesize: appConfig.largePageSize,
        },
      }).then(res => {
        if (res.body.meta && res.body.meta.success) {
          this.setState({
            labelPNs: res.body.data,
          });
        } else {
          console.error(res.body);
        }
      }).catch(err => {
        console.log(err);
      });
      //  发送请求前调用加载loading函数
      this.state.myChart.showLoading({
        text: appConfig.LOADING_TEXT,
      });
      const res = await fetchConnections({ case_id: this.props.caseId, ...{ criteria: params.criteria, adhoc: params.adhoc, view: {} } });
      if (res.body.data) {
        this.formatChartData(res.body.data);
      } else {
        this.state.myChart.hideLoading();
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.search && nextProps.searchs.ownerNums && this.state.criteria !== nextProps.search) {
      this.fetchData(nextProps.search);
      this.setState({
        criteria: nextProps.search,
        showChartButton: false
      });
    }
  }
  formatChartData(arr) {
    const data = [];
    const linksData = [];
    const map = {};
    const categories = [];
    const notOwnerNums = [];
    const { myChart } = this.state;
    const { criteria: { owner_num } } = this.props.search;
    const { ownerNums } = this.props.searchs;

    owner_num[1].forEach(item => {
      data.push({
        num: '',
        name: item,
        category: item,
        symbolSize: 20,
      });
      categories.push({ name: item });
      map[item] = item;
    });

    arr.forEach(item => {
      if (owner_num[1].indexOf(item.owner_num) != -1) {
        if (!map[item.peer_num]) {
          data.push({
            num: item.peer_cname,
            category: item.owner_num,
            name: item.peer_num,
          });
          map[item.peer_num] = item;
        } else {
          data.forEach((i) => {
            if (i.name === item.peer_num && owner_num[1].indexOf(i.name) === -1) {
              i.category = item.peer_num;
              categories.push({ name: item.peer_num,
                itemStyle: {
                  color: '#8f8f8f',
                } });
              notOwnerNums.push(item.peer_num);
            }
          });
        }
        linksData.push({
          source: item.owner_num,
          target: item.peer_num,
          value: item.count * 1,
        });
        map[item.peer_num] = item;
      } else if (!map[item.owner_num + item.peer_num]) {
        if (!map[item.owner_num]) {
          data.push({
            num: item.owner_cname,
            category: item.owner_num,
            name: item.owner_num,
          });
          map[item.owner_num] = item;
        } else {
          data.forEach((i) => {
            if (i.name === item.owner_num && owner_num[1].indexOf(i.name) === -1) {
              i.category = item.owner_num;
              categories.push({ name: item.owner_num,
                itemStyle: {
                  color: '#8f8f8f',
                } });
              notOwnerNums.push(item.owner_num);
            }
          });
        }
        if (!map[item.peer_num]) {
          data.push({
            num: item.peer_cname,
            category: item.peer_num,
            name: item.peer_num,
            symbolSize: 10,
            itemStyle: null,
          });
          map[item.peer_num] = item;
        } else {
          data.forEach((i) => {
            if (i.name === item.peer_num && owner_num[1].indexOf(i.name) === -1) {
              i.category = item.peer_num;
              categories.push({ name: item.peer_num,
                itemStyle: {
                  color: '#8f8f8f',
                } });
              notOwnerNums.push(item.peer_num);
            }
          });
        }
        linksData.push({
          source: item.owner_num,
          target: item.peer_num,
          value: item.count * 1,
        });
        map[item.owner_num + item.peer_num] = item.owner_num + item.peer_num;
      }
    });
    this.state.labelPNs.forEach(items => {
      data.forEach(item => {
        if (item.name == items.num) {
          item.num = items.label;
          item.itemStyle = {
            color: items.label_bg_color,
          };
        }
        // item.x = parseInt(Math.random() * 50);
        // item.y = parseInt(Math.random() * 50);
      });
      categories.forEach(item => {
        if (item.name == items.num) {
          if (owner_num[1].indexOf(item.name) === -1) {
            item.itemStyle = {
              color: '#8a8a8a',
            };
          } else if (items.label_bg_color) {
            item.itemStyle = {
              color: items.label_bg_color,
            };
          }
        }
      });
    });
    // ownerNums.forEach(items => {
    //   data.forEach(item => {
    //     if (!item.num && item.name == items.owner_num) {
    //       item.num = items.owner_name;
    //     }
    //   });
    // })
    console.log(data);
    // console.log(linksData);
    const t = {};
    const a = [];
    linksData.forEach(item => {
      if (!t[item.source + item.target]) {
        if (item.value > 50) {
          a.push({ ...item,
            lineStyle: {
              width: 3,
            } });
        } else {
          a.push(item);
        }
        t[item.source + item.target] = item;
      }
    });
    const count = {};
    a.forEach(item => {
      if (notOwnerNums.indexOf(item.source) !== -1) {
        const num = item.source;
        count[num] = (count[num] + 1) || 1;
      }
      if (notOwnerNums.indexOf(item.target) !== -1) {
        const num = item.target;
        count[num] = (count[num] + 1) || 1;
      }
    });
    categories.forEach(item => {
      if (count[item.name] && count[item.name] > 2) {
        item.itemStyle = {
          color: '#000',
        };
      }
    });

    console.log(a);
    console.log(categories);
    this.state.myChart.setOption({
      series: [
        {
          data,
          links: a,
          categories,
        },
      ],
    });
    this.state.myChart.hideLoading();
    this.setState({
      showChartButton: true
    })
    // initInvisibleGraphic();
    // function initInvisibleGraphic() {
    //   // Add shadow circles (which is not visible) to enable drag.
    //   myChart.setOption({
    //     graphic: echarts.util.map(data, (item, dataIndex) => {
    //       // 使用图形元素组件在节点上划出一个隐形的图形覆盖住节点
    //       const tmpPos = myChart.convertToPixel({ seriesIndex: 0 }, [item.x, item.y]);
    //       return {
    //         type: 'circle',
    //         id: dataIndex,
    //         position: tmpPos,
    //         shape: {
    //           cx: 0,
    //           cy: 0,
    //           r: 20,
    //         },
    //         // silent:true,
    //         invisible: true,
    //         draggable: true,
    //         ondrag: echarts.util.curry(onPointDragging, dataIndex),
    //         z: 100, // 使图层在最高层
    //       };
    //     }),
    //   });
    //   window.addEventListener('resize', updatePosition);
    //   myChart.on('dataZoom', updatePosition);
    // }
    // function updatePosition() { // 更新节点定位的函数
    //   myChart.setOption({
    //     graphic: echarts.util.map(data, (item, dataIndex) => {
    //       const tmpPos = myChart.convertToPixel({ seriesIndex: 0 }, [item.x, item.y]);
    //       return {
    //         position: tmpPos,
    //       };
    //     }),
    //   });
    // }
    // function onPointDragging(dataIndex) { // 节点上图层拖拽执行的函数
    //   const tmpPos = myChart.convertFromPixel({ seriesIndex: 0 }, this.position);
    //   data[dataIndex].x = tmpPos[0];
    //   data[dataIndex].y = tmpPos[1];
    //   myChart.setOption({
    //     series: [
    //       {
    //         data,
    //         links: a,
    //         categories,
    //       },
    //     ],
    //   });
    //   updatePosition();
    // }
  }
  addChartZoom = () => {
    const { myChart } = this.state;
    let zoom = myChart.getOption().series[0].zoom;
    if (zoom === 2) return;
    const z = zoom + 0.2 >= 2 ? 2 : zoom + 0.2;
    myChart.setOption({
      series: [{
        zoom: z,
      }]
    });
  }
  reductionChartZoom = () => {
    const { myChart } = this.state;
    let zoom = myChart.getOption().series[0].zoom;
    if (zoom === 1) return;
    const z = zoom - 0.2 <= 1 ? 1 : zoom - 0.2;
    myChart.setOption({
      series: [{
        zoom: z,
      }]
    });
  }
  render() {
    return (
      <div style={{ position: 'relative' }}>
        {
             this.state.showChartButton ? (
               <div className="chartControls noSelect">
                 {/*<FontAwesomeIcon icon={faPlusSquare} />*/}
                 <div style={{ marginBottom: '10px' }} onClick={this.addChartZoom}>+</div>
                 <div onClick={this.reductionChartZoom}>-</div>
               </div>
             ) : null
         }
        <div id="connectionsChart" />
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    chargingList: state.pbStat.chargingList,
    chargingItems: state.pbStat.chargingItems,
    search: state.search.criteria,
    searchs: state.search,
    // labelPNs: state.labelPNs,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...labelPNActions }, dispatch),
  }),
)(ConnectionsChart);
