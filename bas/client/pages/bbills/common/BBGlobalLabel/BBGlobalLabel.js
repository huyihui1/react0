import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from '@alifd/next';

import {actions} from '../../../../bbStores/BBGlobalLabel'
import { actions as bbAnalyzeActions } from '../../../../bbStores/bbAnalyze';
import {toggleBbDrilldownList} from '../../../../bbStores/bbDrilldownList/actions';
import { isPhoneNumber, isCellTowerCode, isEventTime, isShortNum } from '../../../../gEvents';

import BankAcctLabel from './components/BankAcctLabel/BankAcctLabel'
import TrxLocLabels from './components/TrxLocLabels/index'
import BBDrilldownList from './components/BBDrilldownList'

import './globalLabel.css';


class BBGlobalLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: null,
      activeItem: null,
      panes: [],
    };
    this.flag = true;
    this.page = null;
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.handleActiveItem = this.handleActiveItem.bind(this);
  }

  componentDidMount() {//不清楚作用
    this.props.onRef(this);
    window.addEventListener('dblclick', this.onDoubleClick);
    window.addEventListener('click', this.onClick);
    window.addEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.onClose();
    }
  }

  onDoubleClick(e) {//不懂
    if (!e.target.innerText) return;
    let targetItem = null
    if (e.target.getAttribute('labeldata')) {
      targetItem = JSON.parse(e.target.getAttribute('labelData'));
    } else {
      targetItem = e.target.innerText.replace(/,/g, '');
    }
    console.log(e.target);
    console.log(targetItem);
    let visible = false;
    let type = null;
    let activeItem = null;
    const { panes } = this.state;
    if (typeof targetItem === 'object') {
      if (targetItem.card_num || targetItem.bank_acct) {
        visible = true;
        type = 'num'
        activeItem = targetItem;
      } else if (targetItem.branch_num || targetItem.teller_code) {
        visible = true;
        type = 'trxLocLabels'
        activeItem = targetItem;
      } else if (targetItem.code) {
        visible = true;
        type = 'code'
        activeItem = targetItem.code;
      }
    } else {
      if (isPhoneNumber(targetItem) || isShortNum(targetItem)) {
        visible = true;
        type = isPhoneNumber(targetItem) ? 'num' : 'shortNum';
        activeItem = targetItem;
      } else if (isEventTime(targetItem)) {
        visible = true;
        type = 'time';
        activeItem = targetItem;
      } else if (isCellTowerCode(targetItem)) {
        visible = true;
        type = 'code';
        activeItem = targetItem;
      }
    }

    if (!visible) return;
    panes.forEach((item, index) => {
      if (typeof activeItem === 'object' && typeof item.activeItem === 'object') {
        if (JSON.stringify(item.activeItem) === JSON.stringify(activeItem)) {
          panes.splice(index, 1);
        }
      } else if (item.activeItem === activeItem) {
        panes.splice(index, 1);
      }
    });
    let zIndex = this.props.globalLabels.zIndex + 1;
    this.props.actions.addZindexGlobalLabel(zIndex)
    panes.push({
      visible,
      type,
      activeItem,
      zIndex
    });
    this.setState({
      panes,
    });
  }

  onClick = (e) => {
    const className = e.target.className

    if (typeof className === 'string' && className.indexOf('drilldown') !== -1) {
      let { panes } = this.state;
      const showSimplePbillRecordList = this.props.PBAnalyze.showSimplePbillRecordList
      const simplePbillRecordListParams = this.props.PBAnalyze.simplePbillRecordListParams
      const header = this.props.PBAnalyze.header
      if (showSimplePbillRecordList && this.flag) {
        this.flag=false
        let zIndex = this.props.globalLabels.zIndex + 1;
        this.props.actions.addZindexGlobalLabel(zIndex)
        panes.push({
          type: 'drilldown',
          opt: {criteria: simplePbillRecordListParams, view: {'order-by': "trx_full_time"}, adhoc: {limit: 500, page: 1 }, drilldown:true},
          visible: true,
          zIndex,
          header
        })
      } else {

      }
      this.setState({
        panes,
      }, () => {
        setTimeout(() => {
          this.flag = true
        }, 500)
      });
    }
  }

  onClose(index, isClear = false) {
    let { panes } = this.state;
    if (isClear) {
      panes = [];
    } else {
      panes.splice(index, 1);
    }
    this.setState({
      panes,
    });
  }

  handleActiveItem(activeItem) {
    this.setState({
      activeItem,
    });
  }
  pagingType = (data, params) => {
    console.log(params);
    console.log(data)
    if (params.opt) {
      if (this.page === null) {
        this.page = params.opt.adhoc.page + 1;
      } else {
        this.page += 1;
      }
      params.opt.adhoc.page = this.page
      return params.opt
    }
    return {}
  }
  onDrillDownClose = (index, params) => {
    console.log(index,params)
    this.page = null;
    this.props.actions.toggleBbDrilldownList(false, params).then(res => {
      if (res) {
        this.props.actions.fetchDrillDownAnalyzes({case_id: this.props.caseId, ...res})
      }
    })
    this.onClose(index)
  }

  componentWillUnmount() {
    this.page = null;
    window.removeEventListener('dblclick', this.onDoubleClick);
    window.removeEventListener('click', this.onClick);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  clearPage = () => {
    this.page = null;
  };

  render() {
    const { panes } = this.state;
    const height = window.innerHeight
    return (
      <Fragment>
        {
          panes.map((item, index) => {
            const { visible, activeItem, type, opt, zIndex,header } = item;
            if (type === 'num') {
              return (
                <div className={`GlobalLabel show`} key={activeItem.branch_num || activeItem.teller_code} style={{zIndex}}>
                  <div className="GlobalLabel-close" style={{ position: visible ? 'fixed' : 'absolute', right: visible ? '5px' : '10px' }}>
                    <Icon type="close" onClick={() => { this.onClose(index); }} size="small" />
                  </div>
                  <div>
                    <BankAcctLabel activeItem={activeItem} type={type} onClose={this.onClose} index={index} />
                  </div>
                </div>
              );
            } else if (type === 'trxLocLabels') {
              return (
                <div className={`GlobalLabel ${visible ? 'show' : null}`} key={activeItem.branch_num || activeItem.teller_code} style={{zIndex}}>
                  <div className="GlobalLabel-close" style={{ position: visible ? 'fixed' : 'absolute', right: visible ? '20px' : '10px' }}>
                    <Icon type="close" onClick={() => { this.onClose(index); }} size="small" />
                  </div>
                  <div>
                    <TrxLocLabels activeItem={activeItem} type={type} onClose={this.onClose} index={index} />
                  </div>
                </div>
              );
            } else if (type === 'time') {
              return (
                <div className={`GlobalLabel ${visible ? 'show' : null}`} key={activeItem} style={{zIndex}}>
                  <div className="GlobalLabel-close" style={{ position: visible ? 'fixed' : 'absolute', right: visible ? '20px' : '10px' }}>
                    <Icon type="close" onClick={() => { this.onClose(index); }} size="small" />
                  </div>
                  <div>
                    <CaseEventLabel activeItem={activeItem} type={type} onClose={this.onClose} index={index} />
                  </div>
                </div>
              );
            } else if (type === 'drilldown') {
              return (
                <div className={`GlobalLabel ${visible ? 'show' : null}`} style={{padding: 0, zIndex}} key={index}>
                  <div className="GlobalLabel-close" style={{position: 'fixed', right: '10px', top: '10px', zIndex: 999, cursor: 'pointer' }}>
                    <Icon type="close" onClick={() => {this.onDrillDownClose(index, {url: `/cases/${this.props.caseId}/bbills/records/search`})}} size="small" />
                  </div>
                  <div>
                    {/*{*/}
                      {/*header === 'DailyPbills' ? <DailyPbills clearPage = {this.clearPage} pagingType={this.pagingType} height={height} componentProps={{url: `/cases/${this.props.caseId}/pbills/overview/group-by-startedday`, opt, }}/> : null*/}
                    {/*}*/}
                    {/*{*/}
                      {/*header === 'NumConnections' ? <NumConnections clearPage = {this.clearPage} pagingType={this.pagingType} height={height} componentProps={{url: `/cases/${this.props.caseId}/pbills/peer-num/num-connections`, opt }}/> : null*/}
                    {/*}*/}
                    {
                      header === 'Other' ? <BBDrilldownList pagingType={this.pagingType} height={height} componentProps={{url: `/cases/${this.props.caseId}/bbills/records/search`, opt, }} /> : null
                    }
                  </div>
                </div>
              )
            }
          })
        }
      </Fragment>
    );
  }
}
export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    globalLabels: state.globalLabels,
    PBAnalyze: state.bbDrilldownList
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions, ...bbAnalyzeActions, toggleBbDrilldownList}, dispatch),
  }),
)(BBGlobalLabel);
