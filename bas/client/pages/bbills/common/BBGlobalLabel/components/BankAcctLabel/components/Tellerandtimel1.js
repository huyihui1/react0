import React, { Component } from 'react';
import { Message, Balloon } from '@alifd/next';
import ReactDOM from 'react-dom';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/index';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import echarts from 'echarts';
import { connect } from 'react-redux';
import _ from 'lodash';
import ExcelView from '../../../../../BBStat/components/ExcelView';
import ChartTitle from '../../../../../BBStat/components/ChartTitle';
import ajaxs from '../../../../../../../utils/ajax';
import columns from '../../../../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../../../../handontableConfig';

// import actions from '../../../../../../../bbStores/bankAcctLabels'

const hourArr = [
  '00时',
  '01时',
  '02时',
  '03时',
  '04时',
  '05时',
  '06时',
  '07时',
  '08时',
  '09时',
  '10时',
  '11时',
  '12时',
  '13时',
  '14时',
  '15时',
  '16时',
  '17时',
  '18时',
  '19时',
  '20时',
  '21时',
  '22时',
  '23时',
];

class Tellerandtimel1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      hotSetting: {
        fixedColumnsLeft: 3,
        columns: columns.tellerandtimel1Label,
        nestedHeaders: [
          ['机构号', '柜员号', '机构名称', '24小时分布图',
          '00时',
          '01时',
          '02时',
          '03时',
          '04时',
          '05时',
          '06时',
          '07时',
          '08时',
          '09时',
          '10时',
          '11时',
          '12时',
          '13时',
          '14时',
          '15时',
          '16时',
          '17时',
          '18时',
          '19时',
          '20时',
          '21时',
          '22时',
          '23时',
          ],
          // [
          //   '',
          //   '',
          //   '',
          //   '',
          //   '次数',
          //   '金额',
          //   '次数',
          //   '金额',
          //   '次数',
          //   '金额',
          //   '次数',
          //   '金额',
          //   '次数',
          //   '金额',
          //   '次数',
          //   '金额',
          //   '次数',
          //   '金额',
          //   '次数',
          //   '金额',
          //   '次数',
          //   '金额',
          // ],
        ],
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: (td, row, col, prop, value, cellProperties) => {
          if (col === 3) {
            const dom = document.createElement('div');
            const component = (
              <Balloon align="r"
                       // triggerType="click"
                       needAdjust={true}
                       offset={[20,10]}
                       trigger={<FontAwesomeIcon icon={faChartBar} style={{marginRight:'0',fontSize:'16px',color:'#999'}}></FontAwesomeIcon>}
                       closable={false}
                       onVisibleChange={(visible, type) => {console.log(visible)
                       this.onVisibleChange(visible, type, cellProperties.instance.getDataAtRow(row), row)
                       }}
              >
                <div>
                  <div id={"distribution" + row} style={{height: '200px', width: '500px' }}/>
                </div>
              </Balloon>
            );
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
        }
        },
      dataSource: null,
      isLoading: true,
      // drilldownOptions: {
      //   '柜员号': ['trx_branch_num', 'teller_code'],
      //   '机构号': ['trx_branch_num', 'teller_code', {trx_direction: 1}],
      //   '机构名称': ['trx_branch_num', 'teller_code', {trx_direction: -1}],
      // },
    };
    this.domArr = [];
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props.activeItem.branch_num);
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth( ['机构号', '柜员号', '机构名称', '24小时分布图',
    '00时',
    '01时',
    '02时',
    '03时',
    '04时',
    '05时',
    '06时',
    '07时',
    '08时',
    '09时',
    '10时',
    '11时',
    '12时',
    '13时',
    '14时',
    '15时',
    '16时',
    '17时',
    '18时',
    '19时',
    '20时',
    '21时',
    '22时',
    '23时',
    ]);
    hotSetting.colWidths = colWidthsArr;
    this.setState({hotSetting})
  }

  componentWillUnmount() {
    this.unmountCompsOnDoms();
  }

  unmountCompsOnDoms = () => {
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
  }

  onVisibleChange = (visible, type, rowData, row) => {
    if (visible){
      const myChart = echarts.init(document.getElementById("distribution" + row), 'light');
      this.initC3(myChart, rowData);
    }
  };

  initC3(myChart,rowData) {
    this.setState({
      myChart:myChart,
    });
    console.log(myChart)
    let yData = [];
    for (let i =4; i< 28; i++){
      yData.push(parseInt(rowData[i]))
    }
    console.log(yData)
    const option = {
      color: ['#3398DB'],
      title: [
        {
          text: rowData[0] + '  金额24小时分布图',
          textAlign: 'center',
          left: "50%",
          top:20
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: hourArr,
          //,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] ,
          //hourArr,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel:{
            showMaxLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          // name: '',
          type: 'bar',
          barWidth: '60%',
          //data:[10,2,3] 
          data: yData
          //yData
        }
      ]
    };
    // // window.addEventListener('resize', () => {
    // //   if (this.state.isChart) {
    // //     myChart.resize();
    // //   }
    // // });
     myChart.setOption(option);
  }

  fetchData(num) {
    const { card_num, bank_acct } = this.props.activeItem;
    const params = {
      criteria: {},
      view: {},
      drilldown: true
    };
    if (bank_acct) {
      params.criteria.owner_bank_acct = bank_acct;
    }
    if (card_num) {
      params.criteria.owner_card_num = card_num;
    }
    ajaxs.post(`/cases/${this.props.caseId}/bbills/branch/group-by-tellerandhour`, { ...params }).then(res => {
      if (res.meta.success) {
        console.log(res.data)
        let dataSource = this.formatData(res.data);
        // if (dataSource.length < 15) {//少于15条按15条来
        //   dataSource = [...dataSource, ...Array.from({ length: 15 - dataSource.length }, () => ({}))];
        // }
         
        
        this.setState({
          isLoading: false,
          dataSource,
        });
      } else {
        Message.error('数据请求失败');
        this.setState({
          isLoading: false,
          dataSource: [],
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }


  formatData = (data) => {
    const arr = [];

    for (let i = 0; i < data.length; i++) {
      let ai = {};
      for (let j = 0; j < data[i].length; j++) {
        const a2 = data[i][j];
        ai = { ...ai, ...a2 };
      }
      arr.push(ai);
      console.log(arr)
    }
    return arr;
  
  }

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center" />
        <ExcelView id="relatedOwnersExcel"
          styles={{ height: '450px' }}
          colHeaders={this.state.colHeaders}
          hotSetting={this.state.hotSetting || null}
          isLoading={this.state.isLoading}
          data={this.state.dataSource}
          // drilldown={this.state.drilldownOptions}
        />
      </div>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    bankAcctLables: state.bankAcctLables,
  }),
  // mapDispatchToProps
  dispatch => ({
    // actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(Tellerandtimel1);
