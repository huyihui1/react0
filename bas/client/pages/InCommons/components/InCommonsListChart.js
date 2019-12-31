import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import echarts from 'echarts';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlusSquare} from '@fortawesome/free-solid-svg-icons';

import {Range} from '@alifd/next';
import { actions } from '../../../stores/inCommonsList/index';
import { actions as labelPNActions } from '../../../stores/labelPN/index';
import { downloadIamge, formatFormData } from '../../../utils/utils';
import appConfig from '../../../appConfig';
import ajaxs from '../../../utils/ajax'


class InCommonsListChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      myChart: null,
      colHeaders: ['类型', '次数'],
      criteria: [],
      zoom: 1,
      labelPNs: [],
      showChartButton: false,
      numberOfCalls: [0, 100],
      numberOfCallsMask: [0, 100],
      linksChart: []
    };
    this.handleChart = this.handleChart.bind(this);
    this.getImgURL = this.getImgURL.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.formatChartData = this.formatChartData.bind(this);
  }
  componentDidMount() {
    const chart = document.querySelector('#inCommonsListChart');
    const header = document.querySelector('.ice-layout-header.ice-layout-header-normal.ice-design-layout-header');
    chart.style.height = `${document.documentElement.offsetHeight}px`;
    const myChart = echarts.init(document.getElementById('inCommonsListChart'), 'light');
    this.initC3(myChart);
    window.addEventListener('scroll', this.monitorScrolling)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.monitorScrolling)
  }
  monitorScrolling = () => {
    const {stickyHeader, handleStickyHeader} = this.props
    let top = document.documentElement.scrollTop || document.body.scrollTop;
    if (top >= document.getElementById('chartControls').offsetTop - 30) {
      handleStickyHeader(false)
    } else if (stickyHeader === false) {
      handleStickyHeader(true)
    }
  }
  //  时间+组成+总数
  initC3(myChart) {
    this.setState({
      myChart,
    });
    const categories = [];
    const option = {
      title: {
        text: '号码碰撞关系图',
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
      const { fetchInCommonsLists, fetchLargeLabelPN } = this.props.actions;
      fetchLargeLabelPN({ caseId: this.props.caseId }, {
        query: {
          page: 1,
          pagesize: appConfig.largePageSize,
        },
      }).then(res => {
        if (res.body.meta && res.body.meta.success) {
          this.setState({
            labelPNs: res.body.data,
          }, async () => {
            //  发送请求前调用加载loading函数
            this.state.myChart.showLoading({
              text: appConfig.LOADING_TEXT,
            });
            const res = await ajaxs.post(`/cases/${this.props.caseId}/pbills/analyze/in-commons-connections`, { ...{ criteria: params.criteria, adhoc: params.adhoc, view: {} } });
            if (res.data) {
              this.formatChartData(res.data);
              this.setState({
                linksChart: res.data
              })
            } else {
              this.state.myChart.hideLoading();
            }
          });
        } else {
          console.error(res.meta.message);
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.search && nextProps.searchs.ownerNums && this.state.criteria !== nextProps.search) {
      this.fetchData(nextProps.search);
      this.setState({
        criteria: nextProps.search,
        showChartButton: false
      });
      if (this.state.myChart){
        this.state.myChart.setOption({
          series: [
            {
              data:[]
            }
          ],
        });
      }
    }
  }
  formatChartData(arr, min, max) {
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
      if (min && max) {
        if (item.count >= min && item.count <= max) {
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
        }
      } else {
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
      <div id='chartControls' style={{ position: 'relative' }}>
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
        <div id="inCommonsListChart" />
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
)(InCommonsListChart);
