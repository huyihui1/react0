import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../bbStores/bbStat/GroupByPeeracct';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';
import { addrComponent } from '../../../../../client/utils/hotRenders';


class GroupByPeeracct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: ['对方卡号', '对方账号', '对方户名','对方银行机构号','对方银行机构名称','总交易次数', '次数名次', '合计金额', '金额名次', '存款次数','取款次数','存款金额','取款金额','私人时间次数','工作时间次数','5万元以上次数', '首次交易时间','最后交易时间',],
      criteria: [],
      hotSetting: {
        fixedColumnsLeft: 5,
        columns:columns.groupByPeeracct,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer:  (td, row, col, prop, value, cellProperties) =>{
          if (col === 2) {
            console.log(value)
            const dom = document.createElement('div');
             //let owner_bank_acct = cellProperties.instance.getDataAtRowProp(row, 'owner_bank_acct');
             //let owner_card_num = cellProperties.instance.getDataAtRowProp(row, 'owner_card_num');不懂是啥含义
            const component = addrComponent(value, styles);
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);//将自己创建的dom放入到一个数组中以便在每次渲染之前会重新消除
          }
          if (col ===4){
            const dom = document.createElement('div');
            const component = addrComponent(value, styles);
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom);
          }
        }
      },
      drilldownOptions: {
        '总交易次数': ['peer_card_num', 'peer_bank_acct'],
        '存款次数': ['peer_card_num', 'peer_bank_acct', {trx_direction: 1}],
        '取款次数': ['peer_card_num', 'peer_bank_acct', {trx_direction: -1}],
        '私人时间次数': ['peer_card_num', 'peer_bank_acct', {time_class: 0}],
        '工作时间次数': ['peer_card_num', 'peer_bank_acct', {time_class: 1}],
      },
    };
    this.domArr = [];
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const {hotSetting} = this.state;
    let colWidthsArr = setBBColWidth(this.state.colHeaders);
    hotSetting.colWidths = colWidthsArr;
  }

  fetchData(criteria) {
    const {getGroupByPeeracct} = this.props.actions;
    getGroupByPeeracct({case_id: this.props.caseId,criteria,view: {}});
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
    this.props.actions.clearPeeracct();
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
        <ChartTitle title={this.props.title}  align="center"/>
        <ExcelView id="groupByPeeracctExcel" colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.groupByPeeracctList}/>
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
    groupByPeeracctList: state.peeracct.groupByPeeracctList,
    bbSearchs:state.bbSearchs,
    isLoading:state.peeracct.showLoading
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByPeeracct);
