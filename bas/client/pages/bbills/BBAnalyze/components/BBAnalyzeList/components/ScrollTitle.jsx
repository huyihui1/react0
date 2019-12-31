import React, { Component } from 'react';
import { connect } from 'react-redux';

class BbScrollTitle extends Component {
  componentDidMount() {
    document.querySelector('#bbScrollTitle').style.width =
      document.querySelector('#bbWindowScroller .ReactVirtualized__Table .ReactVirtualized__Table__headerRow').style.width;
  }
  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      document.querySelector('#bbScrollTitle').style.width =
        document.querySelector('#bbWindowScroller .ReactVirtualized__Table .ReactVirtualized__Table__headerRow').style.width;
    }, 500);
  }

  render() {
    return (
      <div className="ReactVirtualized__Table__headerRow fixed"
        id="bbScrollTitle"
        role="row"
        style={{ height: '70px', overflow: 'hidden', paddingRight: '0px' }} // width: '91.15%'
      >
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 150px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="本方账号"
        >本方账户
                                                                                                                </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 125px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="本方户名"
        >本方户名
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 40px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="状态"
        >状态
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{flex: '0 1 50px'}}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="类型"
        >类型
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 60px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="摘要"
        >摘要
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 100px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="交易额"
        >交易额
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 50px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="币种"
        >币种
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 100px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="余额"
        >余额
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 150px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="对方账号"
        >对方账户
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 125px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="对方户名"
        >对方户名
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
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 80px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="机构号"
        >机构号
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 100px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="机构名称"
        >机构名称
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 80px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="柜员号"
        >柜员号
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 80px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="渠道"
        >渠道
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 120px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="备注"
        >备注
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
