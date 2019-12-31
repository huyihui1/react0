import React, { Component } from 'react';
import { connect } from 'react-redux';

class BbScrollTitle extends Component {
  componentDidMount() {
    document.querySelector('#comboBillsList').style.width =
      document.querySelector('#comboBillsWindowScroller .ReactVirtualized__Table .ReactVirtualized__Table__headerRow').style.width;
  }
  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      document.querySelector('#comboBillsList').style.width =
        document.querySelector('#comboBillsWindowScroller .ReactVirtualized__Table .ReactVirtualized__Table__headerRow').style.width;
    }, 500);
  }

  render() {
    return (
      <div className="ReactVirtualized__Table__headerRow fixed"
        id="comboBillsList"
        role="row"
        style={{ height: '70px', overflow: 'hidden', paddingRight: '0px' }} // width: '91.15%'
      >
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 60px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="类别"
        >类别
                                                                                                                </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 125px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="本方号码"
        >本方号码
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 80px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="本方户名"
        >本方户名
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{flex: '0 1 50px'}}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="类型"
        >类型
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 100px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="时长/交易额"
        >时长/交易额
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 100px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="余额"
        >余额
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 125px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="对方号码"
        >对方号码
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 80px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="对方户名"
        >对方户名
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 125px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="对方行名/对方归属地"
        >对方行名/对方归属地
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 120px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="日期"
        >日期
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 60px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="时间"
        >时间
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 30px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="周几"
        >周几
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 100px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="机构名称/本方通话第"
        >机构名称/本方通话第
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 120px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="柜员号/本方基站"
        >柜员号/本方基站
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 110px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="机构号/对方通话地"
        >机构号/对方通话地
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 120px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="备注/对方基站"
        >备注/对方基站
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 50px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="外地/通话状态"
        >外地/通话状态
        </span>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cases: state.cases,
  };
};

export default connect(
  mapStateToProps,
)(BbScrollTitle);
