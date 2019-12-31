import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../bbStores/bbStat/GroupByPeeracctandtrxtimel1class';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';
import { addrComponent } from '../../../../utils/hotRenders';


class GroupByPeeracctandtrxtimel1class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      // colHeaders: ['对方卡号', '对方账号', '对方户名', '对方银行机构号', '对方银行机构名称', '总交易次数',
      //   '4:30 ~ 6:59',
      //   '7:00 ~ 8:29',
      //   '8:30 ~ 11:29',
      //   '11:30 ~ 13:59',
      //   '14:00 ~ 16:59',
      //   '17:00 ~ 18:29',
      //   '18:30 ~ 20:59',
      //   '21:00 ~ 23:59',
      //   '0:00 ~ 4:29'],
      criteria: [],
      hotSetting: {
        fixedColumnsLeft: 4,
        columns: columns.groupByPeeracctandtrxtimel1class,
        viewportColumnRenderingOffset: 1,
        nestedHeaders: [
          ['对方卡号',
            '对方账号',
            '对方户名',
            '总交易次数',
            '对方银行机构号',
            '对方银行机构名称',
            {
              label: '4:30 ~ 6:59',
              colspan: 2,
            },
            {
              label: '7:00 ~ 8:29',
              colspan: 2,
            },
            {
              label: '8:30 ~ 11:29',
              colspan: 2,
            },
            {
              label: '11:30 ~ 13:59',
              colspan: 2,
            },
            {
              label: '14:00 ~ 16:59',
              colspan: 2,
            },
            {
              label: '17:00 ~ 18:29',
              colspan: 2,
            },
            {
              label: '18:30 ~ 20:59',
              colspan: 2,
            },
            {
              label: '21:00 ~ 23:59',
              colspan: 2,
            },
            {
              label: '0:00 ~ 4:29',
              colspan: 2,
            },
          ],
          [
            '',
            '',
            '',
            '',
            '',
            '',
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
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: (td, row, col, prop, value, cellProperties) =>{
          if ( col ===2){
          const dom = document.createElement('div')
          const component = addrComponent(value, styles)
          ReactDOM.render(component, dom)
          td.innerHTML = ''
          td.appendChild(dom);
          this.domArr.push(dom)
        }
        if ( col ===5){
          const dom = document.createElement('div');
          const component = addrComponent(value, styles);
          ReactDOM.render(component, dom);
          td.innerHTML = '';
          td.appendChild(dom);
          this.domArr.push(dom)
        }
      }
      },
      drilldownOptions: {
        'total_trx_count': ['peer_card_num', 'peer_bank_acct'],
        '4:30~6:59#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 0}],
        '4:30~6:59#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 0}],
        '7:00~8:29#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 1}],
        '7:00~8:29#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 1}],
        '8:30-11:29#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 2}],
        '8:30-11:29#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 2}],
        '11:30~13:59#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 3}],
        '11:30~13:59#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 3}],
        '14:00~16:59#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 4}],
        '14:00~16:59#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 4}],
        '17:00~18:29#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 5}],
        '17:00~18:29#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 5}],
        '18:30~20:59#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 6}],
        '18:30~20:59#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 6}],
        '21:00~23:59#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 7}],
        '21:00~23:59#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 7}],
        '0:00~4:29#trx_count': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 8}],
        '0:00~4:29#trx_amt': ['peer_card_num', 'peer_bank_acct', {trx_time_l1_class: 8}],
      },
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth([
      '对方卡号',
      '对方账号',
      '对方户名',
      '对方银行机构号',
      '对方银行机构名称',
      '总交易次数',
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
    ]);
    this.domArr = [];
    hotSetting.colWidths = colWidthsArr;
  }

  fetchData(criteria) {
    const {getGroupByPeeracctandtrxtimel1class} = this.props.actions;
    getGroupByPeeracctandtrxtimel1class({case_id: this.props.caseId, criteria, view: {}});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bbSearchs.isSearch && JSON.stringify(this.state.criteria) !== JSON.stringify(nextProps.bbSearchs.params.criteria)) {
      this.fetchData(nextProps.bbSearchs.params.criteria);
      this.setState({
        criteria: nextProps.bbSearchs.params.criteria,
      },()=>{
        console.log(this.state.criteria)
      })
    }
  }
  componentWillUnmount() {
    //this.props.actions.clearPeeracctandtrxtimel1class();
    this.unmountCompsOnDoms();
  }
  unmountCompsOnDoms = () => {
      this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d);
    });
  };

  render() {
    return (
      <div className="chart-item">
        <ChartTitle title={this.props.title} align="center"/>
        <ExcelView id="groupByPeeracctandtrxtimel1classExcel" colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.groupByPeeracctandtrxtimel1classList}/>
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
    groupByPeeracctandtrxtimel1classList: state.peeracctandtrxtimel1class.groupByPeeracctandtrxtimel1classList,
    bbSearchs: state.bbSearchs,
    isLoading: state.peeracctandtrxtimel1class.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByPeeracctandtrxtimel1class);
