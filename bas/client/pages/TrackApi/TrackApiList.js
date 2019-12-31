import React, {Component} from 'react';
import {DatePicker, Button, Table, Pagination, Select} from '@alifd/next';

const {RangePicker} = DatePicker;
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {FormBinderWrapper, FormBinder} from "@icedesign/form-binder";
import moment from 'moment'
import ajaxs from '../../utils/ajax';
import appConfig from '../../appConfig';
import echarts from "echarts";


class TrackApiList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackApiListData: [],
      current: 1,
      pageTotal: 1,
      myChart: null,
    };
    this.fetch = this.fetch.bind(this);
    this.getActiveList = this.getActiveList.bind(this);
    this.getInActiveList = this.getInActiveList.bind(this);
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('track'), 'light');
    this.initMap(myChart);


    this.fetch(this.state.current);
    this.getActiveList(myChart);
    this.getInActiveList(myChart)
  }

  initMap(myChart) {
    this.setState({
      myChart,
    });
    const option = {
      title: [
        {
          text: moment().subtract('month', 1).format('MMDD') + '-' + moment().format('MMDD') + '最活跃客户',
          textAlign: 'center',
          gridIndex: 0,
          left: "25%",
        },
        {
          text: moment().subtract('month', 1).format('MMDD') + '-' + moment().format('MMDD') + '最不活跃客户',
          textAlign: 'center',
          gridIndex: 1,
          left: '75%'
        },
      ],
      tooltip:{
        show:true,
        formatter: function (params) {
          if (params.data) {
            return 'count' + '：' + params.data
          } else {
            return 'count' + '：'
          }
        },
      },
      grid: [
        {
          width: '40%',
          left: '5%',
          bottom: 0,
          containLabel: true
        },
        {
          width: '40%',
          right: '5%',
          bottom: 0,
          containLabel: true
        }
      ],
      xAxis: [
        {
          gridIndex: 0,
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        },
        {
          gridIndex: 1,
          id:'1',
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        },
      ],
      yAxis: [
        {
          type: 'value',
          gridIndex: 0,
        },
        {
          type: 'value',
          gridIndex: 1
        }
      ],
      series: [
        {
          name: 'active',
          type: 'bar',
          data: [],
          xAxisIndex: 0,
          yAxisIndex: 0,
          barMaxWidth:'40',
        },
        {
          name: 'inActive',
          type: 'bar',
          data: [],
          xAxisIndex: 1,
          yAxisIndex: 1,
          barMaxWidth:'40',
        },
      ]
    };


    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart.setOption(option);
  }


  fetch(current) {
    ajaxs.get('/track-api?page=' + current + '&pagesize=' + appConfig.pageSize).then(res => {
      if (res.meta && res.meta.success) {
        this.setState({trackApiListData: res.data, pageTotal: res.meta.page.total})
      }
    })
  }

  getActiveList(myChart) {
    ajaxs.get('/track-api/top-active').then(res => {
      console.log('活跃的=====>', res.data);

      let arr = [];
      let yData = [];

      res.data.forEach(item => {
        arr.push(item.count);
        yData.push(item.holder.split(',')[0].split('=')[1]);
      });

      myChart.setOption({
        series:[{
          name:'active',
          data:arr
        }],
        xAxis:[{
          gridIndex:0,
          data:yData
        }]
      })

    })
  }

  getInActiveList(myChart) {
    ajaxs.get('/track-api/top-inactive').then(res => {
      console.log('不活跃的=====>', res.data);

      let arr = [];
      let yData = [];

      res.data.forEach(item => {
        arr.push(item.count);
        yData.push(item.holder.split(',')[0].split('=')[1]);
      });
      myChart.setOption({
        series:[{
          name:'inActive',
          data:arr
        }],
        xAxis:[{
          id:'1',
          gridIndex:1,
          data:yData
        }]
      })
    })
  }


  onPageChange = (current) => {
    console.log(current);
    this.setState({
      current,
    }, () => {
      this.fetch(current)
    });
  };


  render() {
    return (
      <div style={styles.box}>
        <div className="TrackApiList_header" style={{height: '200px'}}>
          <div id="track" style={{height: '100%'}}/>
        </div>
        <div className="TrackApiList_list">
          <Table dataSource={this.state.trackApiListData}
                 hasBorder={true}
                 style={styles.table}
          >
            <Table.Column title="客户" alignHeader="center" align='center' dataIndex="holder"/>
            <Table.Column title="主机编码" alignHeader="center" align='center' dataIndex="host_id"/>
            <Table.Column title="API" alignHeader="center" align='center' dataIndex="api"/>
            <Table.Column title="使用时间" alignHeader="center" align='center' dataIndex="created_at"/>
          </Table>
          <div style={styles.pagination}>
            <Pagination
              current={this.state.current}
              onChange={this.onPageChange}
              total={this.state.pageTotal * appConfig.pageSize}
              hideOnlyOnePage
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    caseId: state.cases.case.id,
  }),

  dispatch => ({
    actions: bindActionCreators({}, dispatch),
  }),
)(TrackApiList);


const styles = {
  table: {
    margin: '20px 0',
    minHeight: '503px',
    padding: '20px'
  },
  box: {
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: '6px',
    padding: '20px',
    margin: '20px'
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};
