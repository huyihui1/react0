import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../../../bbStores/bbStat/GroupByPeeracctandtrxamtclass';
import ExcelView from './ExcelView';
import ChartTitle from './ChartTitle';
import columns from '../../../../utils/hotColsDef';
import { setBBColWidth } from '../../../../handontableConfig';
import { addrComponent } from '../../../../../client/utils/hotRenders';



class GroupByPeeracctandtrxamtclass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      colHeaders: ['对方卡号', '对方账号', '对方户名', '对方银行机构号', '对方银行机构名称', '总交易次数',
        '< 200(含)元',
        '200 ~ 1000元',
        '1000(含) ~ 4500元',
        '4500(含) ~ 9000元',
        '9000(含) ~ 5万元',
        '5万(含) ~ 9万元',
        '9万(含) ~ 50万元',
        '50万(含) ~ 100万元',
        '> 100万(含)元'],
      criteria: [],
      hotSetting: {
        fixedColumnsLeft: 6,
        columns: columns.groupByPeeracctandtrxamtclass,
        beforeRender: (isForced) => {
          this.unmountCompsOnDoms();
        },
        afterRenderer: (td, row, col, prop, value, cellProperties) =>{
          if (col ===2){
            const dom = document.createElement('div');
            const component = addrComponent(value, styles);
            ReactDOM.render(component, dom);
            td.innerHTML = '';
            td.appendChild(dom);
            this.domArr.push(dom)
          }
          if (col ===4){
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
        '总交易次数': ['peer_card_num', 'peer_bank_acct'],
        '< 200(含)元': ['peer_card_num', 'peer_bank_acct', {trx_amt_class: 1}],
        '200 ~ 1000元': ['peer_card_num', 'peer_bank_acct', {trx_amt_class: 2}],
        '1000(含) ~ 4500元': ['peer_card_num', 'peer_bank_acct', {trx_amt_class: 3}],
        '4500(含) ~ 9000元': ['peer_card_num', 'peer_bank_acct', {trx_amt_class: 4}],
        '9000(含) ~ 5万元': ['peer_card_num', 'peer_bank_acct', {trx_amt_class: 5}],
        '5万(含) ~ 9万元': ['peer_card_num', 'peer_bank_acct', {trx_amt_class: 6}],
        '9万(含) ~ 50万元': ['peer_card_num', 'peer_bank_acct', {trx_amt_class: 7}],
        '50万(含) ~ 100万元': ['peer_card_num', 'peer_bank_acct', {trx_amt_class: 8}],
        '> 100万(含)元': ['peer_card_num', 'peer_bank_acct', {trx_amt_class: 9}],
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
    const {getGroupByPeeracctandtrxamtclass} = this.props.actions;
    getGroupByPeeracctandtrxamtclass({case_id: this.props.caseId, criteria, view: {}});
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
    this.props.actions.clearPeeracctandtrxamtclass();
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
        <div id="groupByPeeracctandtrxamtclass" style={{display: this.state.isChart ? 'block' : 'none'}}/>
        <ExcelView id="groupByPeeracctandtrxamtclassExcel" colHeaders={this.state.colHeaders}
                   hotSetting={this.state.hotSetting || null}
                   isLoading={this.props.isLoading}
                   drilldown={this.state.drilldownOptions}
                   data={this.props.groupByPeeracctandtrxamtclassList}/>
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
    groupByPeeracctandtrxamtclassList: state.peeracctandtrxamtclass.groupByPeeracctandtrxamtclassList,
    bbSearchs: state.bbSearchs,
    isLoading: state.peeracctandtrxamtclass.showLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(GroupByPeeracctandtrxamtclass);
