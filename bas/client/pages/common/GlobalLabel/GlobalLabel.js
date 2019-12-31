import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from '@alifd/next';

import NumberLabel from './components/NumberLabel/NumberLabel';
import LabelctLabel from './components/LabelctLabel';
import CaseEventLabel from './components/CaseEventLabel';
import SimplePbillRecordList from '../../PBAnalyze/components/InfiniteScrollGrid/SimplePbillRecordList';
import DailyPbills from './../Drilldown/DailyPbills';
import NumConnections from './../Drilldown/NumConnections';
import {toggleSimplePbillRecordList, addZindex} from '../../../stores/simplePbillRecordList/actions';
import { isPhoneNumber, isCellTowerCode, isEventTime, isShortNum } from '../../../gEvents';

import './globalLabel.css';


class GlobalLabel extends Component {
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

  componentDidMount() {
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

  onDoubleClick(e) {
    // if (this.state.visible) {
    //   return
    // }
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
      if (targetItem.num) {
        visible = true;
        type = 'shortNum'
        activeItem = targetItem;
      } else if (targetItem.time) {
        visible = true;
        type = 'time'
        activeItem = targetItem.time;
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
    let zIndex = this.props.PBAnalyze.zIndex + 1;
    this.props.actions.addZindex(zIndex)
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
    const className = e.target.className;
    if (typeof className === 'string' && className.indexOf('drilldown') !== -1) {
      let { panes } = this.state;
      const showSimplePbillRecordList = this.props.PBAnalyze.showSimplePbillRecordList
      const simplePbillRecordListParams = this.props.PBAnalyze.simplePbillRecordListParams
      const header = this.props.PBAnalyze.header
      if (showSimplePbillRecordList && this.flag) {
        this.flag=false
        panes.push({
          type: 'drilldown',
          opt: {criteria: simplePbillRecordListParams, view: {'order-by': "started_at"}, adhoc: {limit: 500, page: 1, daily_rec: "all" }},
          visible: true,
          zIndex: this.props.PBAnalyze.zIndex,
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
    this.page = null;
    this.props.actions.toggleSimplePbillRecordList(false, params);
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
    const height = document.querySelector('.GlobalLabel') && document.querySelector('.GlobalLabel').offsetHeight;
    return (
      <Fragment>
        {
          panes.map((item, index) => {
            const { visible, activeItem, type, opt, zIndex,header } = item;
            if (type === 'num' || type === 'shortNum') {
              return (
                <div className={`GlobalLabel show`} key={typeof activeItem === 'object' ? activeItem.num : activeItem} style={{zIndex}}>
                  <div className="GlobalLabel-close" style={{ position: visible ? 'fixed' : 'absolute', right: visible ? '5px' : '10px' }}>
                    <Icon type="close" onClick={() => { this.onClose(index); }} size="small" />
                  </div>
                  {/*<div className="GlobalLabel-close2" onClick={() => { this.onClose(index); }} style={{ position: visible ? 'fixed' : 'absolute', right: '42.5%', transform: 'translateX(-42.5%)' }}>*/}
                    {/*<Icon type="close" size="small" />*/}
                  {/*</div>*/}
                  <div>
                    <NumberLabel activeItem={activeItem} type={type} onClose={this.onClose} index={index} />
                  </div>
                </div>
              );
            } else if (type === 'code') {
              return (
                <div className={`GlobalLabel ${visible ? 'show' : null}`} key={activeItem} style={{zIndex}}>
                  <div className="GlobalLabel-close" style={{ position: visible ? 'fixed' : 'absolute', right: visible ? '20px' : '10px' }}>
                    <Icon type="close" onClick={() => { this.onClose(index); }} size="small" />
                  </div>
                  {/*<div className="GlobalLabel-close2" onClick={() => { this.onClose(index); }} style={{ position: visible ? 'fixed' : 'absolute', right: '42.5%', transform: 'translateX(-42.5%)' }}>*/}
                    {/*<Icon type="close" size="small" />*/}
                  {/*</div>*/}
                  <div>
                    <LabelctLabel activeItem={activeItem} type={type} onClose={this.onClose} index={index} />
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
                    <Icon type="close" onClick={() => {this.onDrillDownClose(index, {url: `/cases/${this.props.caseId}/pbills/records/search`})}} size="small" />
                  </div>
                  <div>
                    {
                      // header ? (
                      //   <DailyPbills pagingType={this.pagingType} height={height} componentProps={{url: `/cases/${this.props.caseId}/pbills/overview/group-by-startedday`, opt, }}/>
                      // ) : (
                      //   <SimplePbillRecordList pagingType={this.pagingType} height={height} componentProps={{url: `/cases/${this.props.caseId}/pbills/records/search`, opt, }} />
                      // )
                      header === 'DailyPbills' ? <DailyPbills clearPage = {this.clearPage} pagingType={this.pagingType} height={height} componentProps={{url: `/cases/${this.props.caseId}/pbills/overview/group-by-startedday`, opt, }}/> : null
                    }
                    {
                      header === 'NumConnections' ? <NumConnections clearPage = {this.clearPage} pagingType={this.pagingType} height={height} componentProps={{url: `/cases/${this.props.caseId}/pbills/peer-num/num-connections`, opt }}/> : null
                    }
                    {
                      header === 'Other' ? <SimplePbillRecordList pagingType={this.pagingType} height={height} componentProps={{url: `/cases/${this.props.caseId}/pbills/records/search`, opt, }} /> : null
                    }
                  </div>
                </div>
              )
            }
          })
        }
        {/*<div ref={(e) => { this.pbListBox = e; }} className={(this.props.PBAnalyze || {}).showSimplePbillRecordList ? 'pbListBox show' : 'pbListBox'}>*/}
          {/*<div className="pbListBox-close" style={{ position: 'fixed', right: '10px', top: '10px', zIndex: 999, cursor: 'pointer' }}>*/}
            {/*<Icon type="close" onClick={() => {this.page = null; this.props.actions.toggleSimplePbillRecordList(false, null)}} size="small" />*/}
          {/*</div>*/}
          {/*<div>*/}
            {/*{*/}
              {/*(this.props.PBAnalyze || {}).showSimplePbillRecordList ? <SimplePbillRecordList pagingType={this.pagingType} height={height} componentProps={{url: `/cases/${this.props.caseId}/pbills/records/search`, opt, }} /> : null*/}
            {/*}*/}
          {/*</div>*/}
        {/*</div>*/}
      </Fragment>
    );
  }
}
export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    PBAnalyze: state.SimplePbillRecordList
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({toggleSimplePbillRecordList, addZindex}, dispatch),
  }),
)(GlobalLabel);
