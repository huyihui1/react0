import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import randomColor from 'randomcolor';
// import { actions as caseOverviewActions } from '../../stores/';

const colors = ['#ff461f', '#ad6b27', '#2f2df2', '#a50621', '#faff72', '#0a0c91', '#3f7f3f', '#d60686', '#f26f73', '#188791']
class HighlightCode extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  ctCodeRender(ext, dataKey, cellData, rowData, clickHandler, search, rowIndex) {
    let component = (
      <span>
        <span className={search.loc_rule === 'same_lac' && Array.isArray(ext) && ext.indexOf(cellData.split(':')[0].toLowerCase()) !== -1 ? 'highlightCode' : ''} style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[0]}:</span>
        <span className={search.loc_rule === 'same_ci' && Array.isArray(ext) && ext.indexOf(cellData.split(':')[1].toLowerCase()) !== -1 ? 'highlightCode' : ''} style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[1]}:</span>
        <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[2]}</span>
      </span>
    );
    let data = null
    if(ext) {
      data = ext[rowData.started_day];
    }
    if (search.loc_rule === 'scope_ct' && data) {
      for (let i = 0; i < data.length; i++) {
        const scopeCtElement = data[i];
        if (scopeCtElement.indexOf(cellData) !== -1) {
          let index = i > 9 ? i % 10 : i
          component = (
            <span style={{color: colors[index]}}>
              <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[0]}:</span>
              <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[1]}:</span>
              <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[2]}</span>
            </span>
          );
          break;
        }
      }
      return component;
    } else if (search.loc_rule === 'same_lac' && data) {
      let index = data.indexOf(cellData.split(':')[0].toUpperCase());
      if (index !== -1) {
        component = (
          <span>
              <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap', color: colors[index] }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[0]}:</span>
              <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[1]}:</span>
              <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[2]}</span>
            </span>
        );
      }
    } else if (search.loc_rule === 'same_ci' && data) {
      let index = data.indexOf(cellData.split(':')[1].toUpperCase());
      if (index !== -1) {
        component = (
          <span>
              <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[0]}:</span>
              <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap', color: colors[index]  }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[1]}:</span>
              <span style={{ display: 'inline-block', width: '100%', whiteSpace: 'nowrap' }} labeldata={JSON.stringify({ code: cellData })} onClick={(e) => { clickHandler(e, rowData, cellData, dataKey, rowIndex); }}>{cellData.split(':')[2]}</span>
            </span>
        );
      }
    }
    return component;
  }

  render() {
    const { dataKey, cellData, rowData, clickHandler, search, rowIndex, pBAnalyzes, simplePbillRecordList, extType } = this.props;
    const ext = extType ? (simplePbillRecordList || {}).ext : (pBAnalyzes || {}).ext
    return (
      <Fragment>
        {
          this.ctCodeRender(ext, dataKey, cellData, rowData, clickHandler, search, rowIndex)
        }
      </Fragment>
    );
  }
}

export default connect(
  state => ({
    pBAnalyzes: state.PBAnalyze,
    caseId: state.cases.case.id,
    simplePbillRecordList: state.SimplePbillRecordList.ext,
    search: state.search,
  }),
  // mapDispatchToProps
  dispatch => ({
    // actions: bindActionCreators({ ...caseOverviewActions }, dispatch),
  }),
)(HighlightCode);
