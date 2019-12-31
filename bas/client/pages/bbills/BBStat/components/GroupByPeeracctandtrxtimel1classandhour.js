import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../bbStores/bbStat/GroupByPeeracctandtrxtimel1classandhour';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';
import { addrComponent } from '../../../../utils/hotRenders';


class GroupByPeeracctandtrxtimel1classandhour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      criteria: [],
      hotSetting: {
        // colWidths: 100,
        fixedColumnsLeft: 5,
        columns: columns.groupByPeeracctandtrxtimel1classandhour,
        viewportColumnRenderingOffset: 70,//这个属性不懂意义(虚拟渲染表示先渲染70条,这样多于70条之后,剩余的就是动态渲染)
        nestedHeaders: [
          ['对方卡号',
            '对方账号',
            '对方户名',
            '对方银行机构号',
            '对方银行机构名称',
            {
              label: '4时',
              colspan: 2,
            },
            {
              label: '5时',
              colspan: 2,
            },
            {
              label: '6时',
              colspan: 2,
            },
            {
              label: '7时',
              colspan: 2,
            },
            {
              label: '8时',
              colspan: 2,
            },
            {
              label: '9时',
              colspan: 2,
            },
            {
              label: '10时',
              colspan: 2,
            },
            {
              label: '11时',
              colspan: 2,
            },
            {
              label: '12时',
              colspan: 2,
            },
            {
              label: '13时',
              colspan: 2,
            },
            {
              label: '14时',
              colspan: 2,
            },
            {
              label: '15时',
              colspan: 2,
            },
            {
              label: '16时',
              colspan: 2,
            },
            {
              label: '17时',
              colspan: 2,
            },
            {
              label: '18时',
              colspan: 2,
            },
            {
              label: '19时',
              colspan: 2,
            },
            {
              label: '20时',
              colspan: 2,
            },
            {
              label: '21时',
              colspan: 2,
            },
            {
              label: '22时',
              colspan: 2,
            },
            {
              label: '23时',
              colspan: 2,
            },
            {
              label: '24时',
              colspan: 2,
            },
            {
              label: '1时',
              colspan: 2,
            },
            {
              label: '2时',
              colspan: 2,
            },
            {
              label: '3时',
              colspan: 2,
            },
          ],
          [
            '',
            '',
            '',
            '',
            '',//前面户名 机构名下面的2个空格区域
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
            '次数',
            '金额',
          ]
        ],
        beforeRender: (isForced) =>{this.unmountCompsOnDoms()},
        afterRenderer: (td, row, col, prop, value, cellProperties) =>{
          if ( col ===2){
          const dom = document.createElement('div');
          const component = addrComponent(value, styles);
          ReactDOM.render(component, dom);
          td.innerHTML = '';
          td.appendChild(dom);
          this.domArr.push(dom);
        }
        if ( col ===4){
          const dom = document.createElement('div');
          const component = addrComponent(value, styles);
          ReactDOM.render(component, dom);
          td.innerHTML = '';
          td.appendChild(dom);
          this.domArr.push(dom);
        }
      }
      },
      drilldownOptions: {//下标属性(我可以先暂时不管)
        'total_trx_count': ['peer_card_num', 'peer_bank_acct'],
        '4时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 0}],
        '4时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 0}],
        '5时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 1}],
        '5时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 1}],
        '6时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 2}],
        '6时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 2}],
        '7时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 3}],
        '7时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 3}],
        '8时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 4}],
        '8时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 4}],
        '9时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 5}],
        '9时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 5}],
        '10时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 6}],
        '10时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 6}],
        '11时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 7}],
        '11时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 7}],
        '12时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 8}],
        '12时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 8}],
        '13时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 9}],
        '13时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 9}],
        '14时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 10}],
        '14时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 10}],
        '15时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 11}],
        '15时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 11}],
        '16时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 12}],
        '16时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 12}],
        '17时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 13}],
        '17时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 13}],
        '18时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 14}],
        '18时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 14}],
        '19时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 15}],
        '19时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 15}],
        '20时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 16}],
        '20时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 16}],
        '21时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 17}],
        '21时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 17}],
        '22时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 18}],
        '22时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 18}],
        '23时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 19}],
        '23时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 19}],
        '0时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 20}],
        '0时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 20}],
        '1时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 21}],
        '1时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 21}],
        '2时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 22}],
        '2时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 22}],
        '3时#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 23}],
        '3时#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_hour_class: 23}],
      },
    };
    //this.fetchData = this.fetchData.bind(this);
  }
  // getCellHeaders = () => {
  //   const arr = [];
  //   for (let i = 0; i < 24; i++) {
  //     arr.push({
  //       label: i + 4 >= 24 ? i - 20 + '时' : `${i + 4}时`,
  //       colspan: 2,
  //     });
  //   }
  //   return arr;
  // }

  componentDidMount() {
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth([//设置每个行宽
      '对方卡号',
      '对方账号',
      '对方户名',
      '对方银行机构号',
      '对方银行机构名称',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额',
      '次数',
      '金额'
    ]);
    hotSetting.colWidths = colWidthsArr;
    this.domArr = [];
  }

  fetchData(criteria) {
    const {getGroupByXxx} = this.props.actions;
    getGroupByXxx({case_id: this.props.caseId, criteria, view: {}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bbSearchs.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.bbSearchs.params.criteria)) {
      this.fetchData(nextProps.bbSearchs.params.criteria);
      this.setState({
        criteria: nextProps.bbSearchs.params.criteria,
      })
    }
  }
  componentWillUnmount() {
    this.props.actions.clearXxx()
    this.unmountCompsOnDoms();
  }
  unmountCompsOnDoms = () =>{
    this.domArr.forEach(d =>{
      ReactDOM.unmountComponentAtNode(d);
    })
  }


  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center"/>
        <ExcelView id="GroupByPeeracctandtrxtimel1classandhourExcel" colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.groupByPeeracctandtrxtimel1classandhourList}/>
      </div>
    );
  }
}
const styles = {
  compress: {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    textAlign: 'center',
  },
};
export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    groupByPeeracctandtrxtimel1classandhourList: state.Peeracctandtrxtimel1classandhour.groupByPeeracctandtrxtimel1classandhourList,
    bbSearchs: state.bbSearchs,
    isLoading: state.Peeracctandtrxtimel1classandhour.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByPeeracctandtrxtimel1classandhour);
