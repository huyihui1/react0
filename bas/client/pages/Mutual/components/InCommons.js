import React, { Component } from 'react';
import echarts from 'echarts';
import {Range} from '@alifd/next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../../stores/mutual';
import { actions as labelPNActions } from '../../../stores/labelPN/index';

import axios from 'axios'
import appConfig from '../../../appConfig';

class InCommons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: null,
      myChart: null,
      criteria: null,
      labelPNs: [],
      showChartButton: false,
      numberOfCalls: [0, 100],
      numberOfCallsMask: [0, 100],
      linksChart: []
    };
    this.fetchData = this.fetchData.bind(this);
    this.formatChartData = this.formatChartData.bind(this);
  }

  componentDidMount() {
    const chart = document.querySelector('#inCommons');
    chart.style.height = `${document.documentElement.offsetHeight}px`;
    const myChart = echarts.init(chart, 'light');
    this.initMap(myChart);
    this.fetchLargeLabelPN();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.search.criteria)) {
      this.fetchData(nextProps.search.criteria);
      this.setState({
        criteria: nextProps.search.criteria,
        showChartButton: false
      });
    }
  }

  fetchLargeLabelPN = () => {
    const { fetchLargeLabelPN } = this.props.actions;
    if (this.props.caseId) {
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
      })
    }
  }

  fetchData(criteria) {
    criteria = JSON.parse(JSON.stringify(criteria))
    const { actions, caseId } = this.props;
    let params = {
      criteria: {},
      adhoc: {}
    };
    if (criteria.peer_num) {
      params.adhoc.numA = criteria.owner_num[1][0];
      params.adhoc.numB = criteria.peer_num[1][0];
      delete criteria.owner_num;
      delete criteria.peer_num;
      params.criteria = criteria
    }
    actions.fetchInCommonsMutual({ case_id: caseId, ...params }).then(res => {
      if (res.body && res.body.meta.success) {
        this.setState({
          linksChart: res.body.data
        })
        this.formatChartData(res.body.data);
      } else {
        if (this.state.myChart) {
          this.state.myChart.setOption({
            series: [
              {
                data: [],
                links: [],
                categories: [],
              },
            ],
          })
        }
      }
    })
  }

  formatChartData(arr, min, max) {
    const data = [];
    const linksData = [];
    const map = {};
    const categories = [];
    const notOwnerNums = [];
    const { myChart } = this.state;
    const { criteria: { owner_num, peer_num }, ownerNums } = this.props.search;
    if (arr.length === 0) {
      this.state.myChart.setOption({
        series: [
          {
            data: [],
            links: [],
            categories: [],
          },
        ],
      });
      return
    }
    const nums = [...owner_num[1], ...peer_num[1]]
    nums.forEach(item => {
      data.push({
        num: '',
        name: item,
        category: item,
        symbolSize: 20,
      });
      categories.push({ name: item });
      map[item] = item;
    });
    let inCommons = []
    for (let i = 0; i < arr.length; i++) {
      const arrElement = arr[i];
      inCommons.push(arrElement)
    }
    inCommons.forEach(item => {
      if (min && max) {
        if (item.count >= min && item.count <= max) {
          if (nums.indexOf(item.owner_num) != -1) {
            if (!map[item.peer_num]) {
              data.push({
                num: item.peer_cname,
                category: item.owner_num,
                name: item.peer_num,
              });
              map[item.peer_num] = item;
            } else {
              data.forEach((i) => {
                if (i.name === item.peer_num && nums.indexOf(i.name) === -1) {
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
                if (i.name === item.owner_num && nums.indexOf(i.name) === -1) {
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
                if (i.name === item.peer_num && nums.indexOf(i.name) === -1) {
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
        }
      } else {
        if (nums.indexOf(item.owner_num) != -1) {
          if (!map[item.peer_num]) {
            data.push({
              num: item.peer_cname,
              category: item.owner_num,
              name: item.peer_num,
            });
            map[item.peer_num] = item;
          } else {
            data.forEach((i) => {
              if (i.name === item.peer_num && nums.indexOf(i.name) === -1) {
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
              if (i.name === item.owner_num && nums.indexOf(i.name) === -1) {
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
              if (i.name === item.peer_num && nums.indexOf(i.name) === -1) {
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
          if (nums.indexOf(item.name) === -1) {
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
    const val = []
    a.forEach(item => {
      val.push(item.value)
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
    if (min && max) {
      this.setState({
        showChartButton: true,
      })
    } else {
      let min = Math.min(...val);
      let max = Math.max(...val);
      if (val.length === 0) {
        min = 0;
        max = 0
      }
      const rangeVal = [min, max];
      this.setState({
        showChartButton: true,
        numberOfCalls: rangeVal,
        numberOfCallsMask: rangeVal,
      })
    }
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


  async initMap(myChart) {
    this.setState({
      myChart,
    });
    const categories = [];

    const option = {
      title: {
        text: '共同联系人',
        subtext: '',
        top: 10,
        left: 'center',
        show: true,
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
          top: '15%',
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
      myChart.resize();
    });
    myChart.setOption(option);
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

  onRangeChange = (value) => {
    const {linksChart} = this.state;
    let min = value[0];
    let max = value[1];
    this.formatChartData(linksChart, min, max)
    this.setState({
      numberOfCalls: value
    })

  }

  render() {
    const {numberOfCalls, numberOfCallsMask} = this.state;
    return (
      <div style={{ position: 'relative', height: '100%' }}>
        {
          this.state.showChartButton ? (
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div className='numberFilter'>
                <Range slider={'double'} tooltipVisible onChange={this.onRangeChange} value={numberOfCalls} marks={numberOfCallsMask} min={numberOfCallsMask[0]} max={numberOfCallsMask[1]} />
              </div>
              <div className="chartControls noSelect">
                {/*<FontAwesomeIcon icon={faPlusSquare} />*/}
                <div onClick={this.addChartZoom}>+</div>
                <div onClick={this.reductionChartZoom}>-</div>
              </div>
            </div>
          ) : null
        }
        <div id="inCommons" style={{ height: '100%' }} />
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
    actions: bindActionCreators({ ...actions, ...labelPNActions }, dispatch),
  }),
)(InCommons);

