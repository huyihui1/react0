import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../bbStores/bbStat/GroupByOwneracct';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from "../../../../utils/hotColsDef";
import { setBBColWidth } from '../../../../handontableConfig';
import { addrComponent } from '../../../../utils/hotRenders';


class GroupByOwneracct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: ['本方卡号',
        '本方账号',
        '户名',
        '银行机构号',
        '银行机构名称',
        '首次交易时间',
        '最后交易时间',
        '首末次交易时间相隔天数',
        '交易过的对方卡号数',
        '总交易次数',
        '存款次数',
        '取款次数',
        '存款总金额',
        '取款总金额'],
      criteria: [],
      hotSetting: {
        fixedColumnsLeft: 5,
        columns:columns.groupByOwneracct,//表示下传的条件
        beforeRender: (isForced) =>{this.unmountCompsOnDoms()},
        afterRenderer: (td, row, col, prop, value, cellProperties) =>{
          if (col === 4){
            const dom  = document.createElement('div')
            const component = addrComponent(value, styles)
            ReactDOM.render(component, dom)
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
           }
        }
      },
      drilldownOptions: {
        '总交易次数': ['owner_card_num', 'owner_bank_acct'],
        '存款次数': ['owner_card_num', 'owner_bank_acct', {trx_direction: 1}],
        '取款次数': ['owner_card_num', 'owner_bank_acct', {trx_direction: -1}],
        '存款总金额': ['owner_card_num', 'owner_bank_acct', {trx_direction: 1}],
        '取款总金额': ['owner_card_num', 'owner_bank_acct', {trx_direction: -1}],
      },
    };
    this.fetchData = this.fetchData.bind(this);
    this.domArr = [];
  }

  componentDidMount() {
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth(this.state.colHeaders);
    hotSetting.colWidths = colWidthsArr;
  }

  fetchData(criteria) {
    const {getGroupByOwneracct} = this.props.actions;
    getGroupByOwneracct({case_id: this.props.caseId, criteria, view: {}});
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
    this.props.actions.clearOwneracct();
    this.unmountCompsOnDoms();
  }
  unmountCompsOnDoms = () =>{
    this.domArr.forEach(d => {
      ReactDOM.unmountComponentAtNode(d)//消除虚拟dom
    })
  }


  render() {
    return (
      <div>
        <ChartTitle title={this.props.title} align="center"/>
        <ExcelView id="groupByOwneracctExcel" colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.groupByowneracctList}/>
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
}
export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    groupByowneracctList: state.owneracct.groupByowneracctList,
    bbSearchs: state.bbSearchs,
    isLoading: state.owneracct.showLoading
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByOwneracct);
