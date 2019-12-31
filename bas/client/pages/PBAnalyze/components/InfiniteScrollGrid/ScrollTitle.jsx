import React, { Component } from 'react';
import { connect } from 'react-redux';

class ScrollTitle extends Component {
  componentDidMount() {
    document.querySelector('#scrollTitle').style.width =
      document.querySelector('#windowScroller .ReactVirtualized__Table .ReactVirtualized__Table__headerRow').style.width;
  }
  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      document.querySelector('#scrollTitle').style.width =
        document.querySelector('#windowScroller .ReactVirtualized__Table .ReactVirtualized__Table__headerRow').style.width;
      console.log(document.querySelector('#scrollTitle').style.width);
    }, 500);
  }

  render() {
    return (
      <div className="ReactVirtualized__Table__headerRow fixed"
        id="scrollTitle"
        role="row"
        style={{ height: '70px', overflow: 'hidden', paddingRight: '0px' }} // width: '91.15%'
      >
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 55px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="计费类型"
        >计费类型
                                                                                                                </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 55px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="状态"
        >状态
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{flex: '0 1 55px'}}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="本方通话地"
        >本方通话地
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 150px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="本方号码"
        >本方号码
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 80px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="人员信息"
        >人员信息
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 50px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="联系类型"
        >联系类型
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 150px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="对方号码"
        >对方号码
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 70px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="短号"
        >短号
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 80px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="人员信息"
        >人员信息
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 75px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="归属地"
        >归属地
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 55px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="对方通话地"
        >对方通话地
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 30px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="长途"
        >长途
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 30px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="虚拟"
        >虚拟
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
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 50px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="时间类型"
        >时间类型
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 30px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="周几"
        >周几
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 50px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="时间性质"
        >时间性质
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 60px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="时长分"
        >时长分
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 80px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="时长类别"
        >时长类别
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{ flex: '0 1 55px' }}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="本方基站"
        >本方基站
        </span>
        </div>
        <div className="ReactVirtualized__Table__headerColumn" role="columnheader" style={{flex: '0 1 55px'}}><span
          className="ReactVirtualized__Table__headerTruncatedText"
          title="对方基站"
        >对方基站
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
)(ScrollTitle);
