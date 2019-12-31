/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Balloon, Icon, Nav, Message } from '@alifd/next';
import IceImg from '@icedesign/img';
import Layout from '@icedesign/layout';
import cx from 'classnames';
import doT from 'dot';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, withRouter } from 'react-router-dom';
import { headerMenuConfig } from '../../../../menuConfig';
import CaseSwitch from '../../../../pages/common/CaseSwitch';
import {clearCases} from '../../../../stores/case/actions';
import Logo from '../Logo';

import './index.scss';

@withRouter
class Header extends PureComponent {
  handleSetting = () => {
    this.props.history.push('/settings');
  };
  onSelect = (selectedKeys, item, extra) => {
    if (this.props.cases && this.props.cases.case.id) {

    } else {
      Message.error('请先在"我的工作台"选择案件并进入');
    }
  }
  render() {
    const { isMobile, className, style, login } = this.props;

    return (
      <Layout.Header
        theme="dark"
        className={cx('ice-design-layout-header', className)}
        style={{ ...style }}
      >
        <Logo />
        <div style={{ flex: 1, marginLeft: '20px' }}>
          <CaseSwitch />
        </div>
        <div className="ice-design-layout-header-menu">
          {/* Header 菜单项 begin */}
          {headerMenuConfig && headerMenuConfig.length > 0 ? (
            <Nav direction="hoz" type="secondary" selectedKeys={[]} onSelect={this.onSelect}>
              {headerMenuConfig.map((nav, idx) => {
                const linkProps = {};
                if (nav.newWindow) {
                  linkProps.href = nav.path;
                  linkProps.target = '_blank';
                } else if (nav.external) {
                  linkProps.href = nav.path;
                } else {
                  const tempFn = doT.template(nav.path);
                  const path = this.props.cases && this.props.cases.case.id ? tempFn({ caseId: this.props.cases.case.id }) : '';
                  linkProps.to = path;
                }
                return (
                  <Nav.Item key={idx} icon={nav.icon ? <FontAwesomeIcon icon={nav.icon} /> : null}>
                    {linkProps.to ? (
                      <Link {...linkProps}>{!isMobile ? nav.name : null}</Link>
                    ) : (
                      <span {...linkProps}>{!isMobile ? nav.name : null}</span>
                    )}
                  </Nav.Item>
                );
              })}
            </Nav>
          ) : null}
          {/* Header 菜单项 end */}

          {/* Header 右侧内容块 */}
          <Balloon
            trigger={
              <div className="ice-design-header-userpannel">
                <IceImg
                  height={40}
                  width={40}
                  src="https://img.alicdn.com/tfs/TB1L6tBXQyWBuNjy0FpXXassXXa-80-80.png"
                  className="user-avatar"
                />
                <div className="user-profile">
                  <span className="user-name">{login && login.loginResult && login.loginResult.account}</span>
                  <br />
                  <span className="user-department">{login && login.loginResult && login.loginResult.name}</span>
                </div>
                <Icon type="arrow-down" size="xxs" className="icon-down" />
              </div>
            }
            closable={false}
            className="user-profile-menu"
          >
            <ul>
              <li
                className="user-profile-menu-item"
                onClick={this.handleSetting}
              >
                <Icon type="set" size="small" />
                设置
              </li>
              <li
                className="user-profile-menu-item"
                onClick={() => {
                  this.props.handleLogout();
                  this.props.clearCases();
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} style={{fontSize: '14px', marginRight: '6px'}} />
                退出
              </li>
            </ul>
          </Balloon>
        </div>
      </Layout.Header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
    cases: state.cases,
  };
};

const mapDispatchToProps = {
  clearCases
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
