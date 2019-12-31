import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { Icon, Nav, Message, Switch } from '@alifd/next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import doT from 'dot';

import {MenusReducer} from '../../../../stores/menus/reducer';
import {toggleNav, setCase} from '../../../../stores/case/actions';
import {VerifyLogin, getCaseName} from '../../../../pages/UserLogin/actions';
import {getFavoritesList} from '../../../../stores/menus/actions';
import Logo from '../Logo';
import { asideMenuConfig, casMenuConfig, tasMenuConfig } from '../../../../menuConfig';
import Authorized from '../../../../utils/Authorized';
import GlobalLabel from '../../../../pages/common/GlobalLabel';
import BBGlobalLabel from '../../../../pages/bbills/common/BBGlobalLabel';
import FullMenus from './components/FullMenus'
import FavoritesMenus from './components/FavoritesMenus'

import './index.scss';
import { PBAnalyzeReducer } from '../../../../stores/PBAnalyze/reducer';
import injectReducer from '../../../../utils/injectReducer';
import ajaxs from '../../../../utils/ajax';
import { mainRoutersContext } from '../../../../contexts/mainRoutes-context';
import appConfig from '../../../../appConfig';

// let menuConfig = asideMenuConfig;

// if (isCas()) {
//   asideMenuConfig = casMenuConfig;
// } else if (isTas()) {
//   asideMenuConfig = tasMenuConfig;
// }

const SubNav = Nav.SubNav;
const NavItem = Nav.Item;

class Aside extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    const openKeys = this.getDefaultOpenKeys();
    this.state = {
      openDrawer: false,
      openKeys,
      selectedKeys: null,
      caseId: null,
      isSwitch: false,
      menus: ''
    };
    this.flag = true
    this.openKeysCache = openKeys;
    this.onSelect = this.onSelect.bind(this);
    this.getSubMenuOrItem = this.getSubMenuOrItem.bind(this);
  }

  /**
   * 响应式通过抽屉形式切换菜单
   */
  toggleMenu = () => {
    const { openDrawer } = this.state;
    this.setState({
      openDrawer: !openDrawer,
    });
  };

  /**
   * 左侧菜单收缩切换
   */
  onMenuClick = () => {
    this.toggleMenu();
  };

  onSelect = (selectedKeys, item, extra) => {
    if (this.GlobalLabel) {
      this.GlobalLabel.onClose(0, true);
    }
    if (this.props.cases && this.props.cases.case.id || item.props.auth === 'false') {
      this.setState({
        selectedKeys,
      });
      this.props.history.push(selectedKeys[0]);
    } else {
      Message.error('请先在"我的工作台"选择案件并进入');
    }
  };

  /**
   * 获取默认展开菜单项
   */
  getDefaultOpenKeys = () => {
    const { location = {} } = this.props;
    const { pathname } = location;
    const menus = this.getNavMenuItems(asideMenuConfig);

    let openKeys = [];
    if (Array.isArray(menus)) {
      asideMenuConfig.forEach((item, index) => {
        if (pathname.startsWith(item.path)) {
          openKeys = [`${index}`];
        }
      });
    }

    return openKeys;
  };

  /**
   * 当前展开的菜单项
   */
  onOpenChange = (openKeys) => {
    if (this.GlobalLabel) {
      this.GlobalLabel.onClose(0, true);
    }
    console.log(openKeys);
    this.setState({
      openKeys,
    });
    this.openKeysCache = openKeys;
  };

  /**
   * 获取菜单项数据
   */
  getNavMenuItems = (menusData) => {
    const { login } = this.props;
    if (!menusData) {
      return [];
    }

    return menusData
      .filter((item) => {
        if (login && login.loginResult && login.loginResult.role === 'user') {
          return item.name && !item.isRoot
        } else if (login && login.loginResult && login.loginResult.system_id != 0) {
          return item.name && !item.isSuperRoot
        } else if (login && login.loginResult && login.loginResult.system_id == 0) {
          return item.name
        }
        return item.name && !item.hideInMenu
      })
      .map((item, index) => {
        const ItemDom = this.getSubMenuOrItem(item, index);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter((item) => item);
  };

  /**
   * 二级导航
   */
  getSubMenuOrItem = (item, index) => {
    if (item.children && item.children.some((child) => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubNav
            key={index}
            icon={item.icon ? <FontAwesomeIcon icon={item.icon} fixedWidth /> : null}
            label={<span className="ice-menu-collapse-hide">{item.name}</span>}
          >
            {childrenItems}
          </SubNav>
        );
      }
      return null;
    }

    const tempFn = doT.template(item.path);
    const path = tempFn({ caseId: this.props.cases ? this.props.cases.case.id : '' });

    return (
      <NavItem key={path} auth={`${item.auth}`}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '10px'}}>
          <span>{item.name}</span>
          <FontAwesomeIcon className={'externa-link'} title={'在新窗口打开'} icon={faExternalLinkAlt} onClick={(e) => {this.NavBlank(e, path, item)}} style={{color: '#d0d0d0'}}/>
        </div>
         {/*<Link to={path}>{item.name}</Link>*/}
      </NavItem>
    );
  };

  NavBlank = (e, path, item) => {
    console.log(item);
    e.stopPropagation();
    if (this.props.cases && this.props.cases.case.id || item.auth === 'false') {
      const w = window.open('about:blank');
      w.location.href = `/#${path}`;
    } else {
      Message.error('请先在"我的工作台"选择案件并进入');
    }
  }

  /**
   * 权限检查
   */
  checkPermissionItem = (authority, ItemDom) => {
    if (Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }

    return ItemDom;
  };

  componentWillReceiveProps(nextProps) {
    const { location: { pathname } } = nextProps;
    if (this.state.selectedKeys && this.state.selectedKeys[0] !== pathname) {
      this.setState({
        selectedKeys: [pathname],
      });
    }
    if (nextProps.cases.iconOnly) {
      this.setState({
        openKeys: []
      })
    }
    if (nextProps.location && nextProps.location.pathname && nextProps.login) {
      const caseId = parseInt(nextProps.location.pathname.replace(/\/cases\//, ''), 0);
      if (caseId && nextProps.login && this.state.caseId !== caseId) {
        this.props.getCaseName(caseId);
        this.setState({
          caseId
        })
      }
    }
    if (nextProps.login && nextProps.login.loginResult && nextProps.login.loginResult.menus && this.state.menus !== nextProps.login.loginResult.menus) {
      let menus = nextProps.login.loginResult.menus;
      if (menus === 'favorites') {
        this.setState({
          menus,
          isSwitch: true
        })
      }
      if (this.flag) {
        this.props.getFavoritesList(nextProps.login.loginResult.sub_system);
        this.flag = false
      }
    }
  }
  componentWillMount() {
    const caseId = parseInt(this.props.location.pathname.replace(/\/cases\//, ''), 0);
    if (caseId) {
      this.props.setCase({id: caseId});
    }
    this.props.VerifyLogin();
  }

  componentDidMount() {

  }

  onGlobRef = (e) => {
    this.GlobalLabel = e
  }

  onSwitchChange = (checked, e) => {
    e.stopPropagation()
    this.props.getFavoritesList(this.context.itemType);
    let v = 'favorites'
    if (!checked) {
      v = 'full'
    }
    ajaxs.post(`/user/settings`, {
      k: 'user.menus',
      v: v
    })
    this.setState({
      isSwitch: checked
    })
  }

  render() {
    const { openDrawer } = this.state;
    const {
      location: { pathname },
      isMobile,
      login
    } = this.props;
    return (
      <div
        className={cx('ice-design-layout-aside', { 'open-drawer': openDrawer })}
      >
        {isMobile && <Logo />}

        {isMobile && !openDrawer && (
          <a className="menu-btn" onClick={this.toggleMenu}>
            <Icon type="calendar" size="small" />
          </a>
        )}
        {
          this.state.isSwitch ? <FavoritesMenus globalLabel={this.GlobalLabel} />: <FullMenus globalLabel={this.GlobalLabel}/>
        }
        <div className={this.props.cases.iconOnly ? 'toggle-sidebar-button iconOnly' : 'toggle-sidebar-button'} onClick={this.props.toggleNav}>
          <Icon type={this.props.cases.iconOnly ? "arrow-double-right" : "arrow-double-left"} size="xs" />
          <span>缩进</span>
          <Switch checkedChildren="快捷版" checked={this.state.isSwitch} onChange={this.onSwitchChange} unCheckedChildren="高级版" style={{width: '80px', position: 'relative', top: '8px', marginLeft: '10px'}} />
        </div>
        {
          this.context.itemType === appConfig.PBAS ?
            (this.props.cases && this.props.cases.case.id ? <GlobalLabel onRef={this.onGlobRef} /> : null)
            :
            (
              this.props.cases && this.props.cases.case.id ? <BBGlobalLabel onRef={this.onGlobRef} /> : null
            )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.cases,
    route: state.route,
    login: state.login
  };
};
const mapDispatchToProps = {
  toggleNav,
  setCase,
  VerifyLogin,
  getCaseName,
  getFavoritesList,
};
const withReducer = injectReducer({ key: 'menus', reducer: MenusReducer });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withReducer,
  withConnect,
)(withRouter(Aside));
Aside.contextType = mainRoutersContext
