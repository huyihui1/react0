import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Icon, Nav, Message } from '@alifd/next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import doT from 'dot';

import { toggleNav, setCase } from '../../../../../stores/case/actions';
import { VerifyLogin, getCaseName } from '../../../../../pages/UserLogin/actions';
import { asideMenuConfig, casMenuConfig, tasMenuConfig,headerMenuConfig} from '../../../../../menuConfig';
import Authorized from '../../../../../utils/Authorized';
import appConfig from '../../../../../appConfig';
import {mainRoutersContext} from '../../../../../contexts/mainRoutes-context';
const newAsideMenuConfig = JSON.parse(JSON.stringify(asideMenuConfig));

let menuConfig = asideMenuConfig;


const SubNav = Nav.SubNav;
const NavItem = Nav.Item;

@withRouter
class FullMenus extends Component {
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
      menuConfig: JSON.parse(JSON.stringify(menuConfig)),
    };

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
    if (this.props.globalLabel) {
      this.props.globalLabel.onClose(0, true);
    }
    if (this.props.cases && this.props.cases.case.id || item.props.auth === 'false') {
      this.setState({
        selectedKeys,
      });
      this.props.history.push(selectedKeys[0]);
    } else {
      // this.props.history.push('/');
      Message.error('请先在"我的工作台"选择案件并进入');
    }
  };

  /**
   * 获取默认展开菜单项
   */
  getDefaultOpenKeys = () => {
    const { location = {} } = this.props;
    const { pathname } = location;
    const menus = this.getNavMenuItems(menuConfig);

    let openKeys = [];
    if (Array.isArray(menus)) {
      menuConfig.forEach((item, index) => {
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
    if (this.props.globalLabel) {
      this.props.globalLabel.onClose(0, true);
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
          return item.name && !item.isRoot;
        } else if (login && login.loginResult && login.loginResult.system_id != 0) {
          return item.name && !item.isSuperRoot;
        } else if (login && login.loginResult && login.loginResult.system_id == 0) {
          return item.name;
        }
        return item.name && !item.hideInMenu;
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '10px' }}>
          <span className='text'>{item.name}</span>
          <FontAwesomeIcon className="externa-link" title="在新窗口打开" icon={faExternalLinkAlt} onClick={(e) => { this.NavBlank(e, path, item); }} style={{ color: '#d0d0d0' }} />
        </div>
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
        openKeys: [],
      });
    }
    if (nextProps.location && nextProps.location.pathname && nextProps.login) {
      const caseId = parseInt(nextProps.location.pathname.replace(/\/cases\//, ''), 0);
      if (caseId && nextProps.login && this.state.caseId !== caseId) {
        this.props.getCaseName(caseId);
        this.setState({
          caseId,
        });
      }
    }
    // if (nextProps.favoritesList && nextProps.favoritesList !== this.state.favoritesList) {
    //   let favoritesList = nextProps.favoritesList;
    //   let res = this.findTreeData(favoritesList);
    //   asideMenuConfig[0].children = [...res];
    //   this.setState({
    //     favoritesList,
    //     asideMenuConfig,
    //   });
    // }
  }
  componentWillMount() {

  }

  componentDidMount() {
  }

  findTreeData(source) {
    let t = [];
    newAsideMenuConfig.forEach(item => {
      if (item.children) {
        item.children.forEach(j => {
          if (source.indexOf(j.mkey) !== -1) {
            t.push(j)
          }
        })
      }
    });
    headerMenuConfig.forEach(item => {
      if (source.indexOf(item.mkey) !== -1){
        t.push(item)
      }
    });
    return t
  }
  onItemClick = (key, item ) => {
    if (this.props.cases && this.props.cases.case.id || item.props.auth === 'false') {
      const { history, location } = this.props;
      history.replace('/reload');
      setTimeout(() => {
        history.push(key);
        this.setState({
          selectedKeys: [key]
        })
      }, 20);
    }
  }

  render() {
    const { openDrawer } = this.state;
    const {
      location: { pathname },
      isMobile,
    } = this.props;
    return (
      <mainRoutersContext.Consumer>
        {
          ({itemType, toggleItemType}) => {
            if (itemType === appConfig.BBAS) {
              menuConfig = tasMenuConfig
            } else {
              menuConfig = asideMenuConfig
            }
            return (
              <Nav
                style={{ width: 200 }}
                direction="ver"
                mode={this.props.cases.iconOnly ? 'popup' : 'inline'}
                activeDirection={null}
                selectedKeys={this.state.selectedKeys || [pathname]}
                openKeys={this.state.openKeys}
                defaultSelectedKeys={[pathname]}
                onOpen={this.onOpenChange}
                onClick={this.onMenuClick}
                onSelect={this.onSelect}
                onItemClick={this.onItemClick}
                iconOnly={this.props.cases.iconOnly}
                hasArrow={false}
              >
                {this.getNavMenuItems(menuConfig)}
              </Nav>
            )
          }
        }
      </mainRoutersContext.Consumer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.cases,
    route: state.route,
    login: state.login,
    favoritesList: state.menus.favoritesList,
  };
};
const mapDispatchToProps = {
  toggleNav,
  setCase,
  VerifyLogin,
  getCaseName,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FullMenus);
