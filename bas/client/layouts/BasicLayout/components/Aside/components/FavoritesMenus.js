import React, {Component} from 'react';
import {Nav, Message} from '@alifd/next';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import doT from 'dot';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt, faCircle} from '@fortawesome/free-solid-svg-icons';
import {getCaseName} from '../../../../../pages/UserLogin/actions';
import {asideMenuConfig, headerMenuConfig, tasMenuConfig} from '../../../../../menuConfig';
import {mainRoutersContext} from '../../../../../contexts/mainRoutes-context';
import appConfig from '../../../../../appConfig';


const {Item, SubNav} = Nav;
let menuConfig = ASSETS_TYPE === appConfig.BBAS ? JSON.parse(JSON.stringify(tasMenuConfig)) : JSON.parse(JSON.stringify(asideMenuConfig));

// @withRouter
class FavoritesMenus extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navList: [],
      openKeys: [],
      favoritesList: [],
      selectedKeys: null,
    };
  }
  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const {location: {pathname}} = nextProps;
    if (this.context.itemType === appConfig.BBAS) {
      menuConfig = tasMenuConfig;
      if (nextProps.favoritesList) {
        const favoritesList = nextProps.favoritesList;
        const res = this.findTreeData(favoritesList);
        menuConfig[0].children.push(menuConfig[1].children[0]);
        this.setState({
          favoritesList,
          navList: [...res],
        });
      }
    } else {
      menuConfig = asideMenuConfig;
      if (nextProps.favoritesList) {
        const favoritesList = nextProps.favoritesList;
        const res = this.findTreeData(favoritesList);
        menuConfig[0].children.push(menuConfig[1].children[0]);
        this.setState({
          favoritesList,
          navList: [...res],
        });
      }
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
    if (nextProps.favoritesList && nextProps.favoritesList !== this.state.favoritesList) {
      const favoritesList = nextProps.favoritesList;
      const res = this.findTreeData(favoritesList);
      menuConfig[0].children.push(menuConfig[1].children[0]);
      this.setState({
        favoritesList,
        navList: [...res],
      });
    }
  }

  findTreeData(source) {
    const t = [];
    const o = {}
    menuConfig.forEach(item => {
      if (item.children) {
        item.children.forEach(j => {
          if (source.indexOf(j.mkey) !== -1 && !o[j.name]) {
            o[j.name] = j.name
            t.push(j);
          }
        });
      }
    });
    headerMenuConfig.forEach(item => {
      if (source.indexOf(item.mkey) !== -1) {
        t.push(item)
      }
    });
    return t;
  }

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
    const {navList} = this.state;
    const {
      location: {pathname},
    } = this.props;
    return (
      <Nav style={{width: '200px'}}
           iconOnly={this.props.cases.iconOnly}
           type="normal"
           activeDirection={null}
           direction="ver"
           selectedKeys={this.state.selectedKeys || [pathname]}
           openKeys={this.state.openKeys}
           defaultSelectedKeys={[pathname]}
           onSelect={this.onSelect}
           onItemClick={this.onItemClick}
           onOpen={this.onOpenChange}
           hasArrow={false}
           className="favoritesMenus"
      >
        {
          navList.map(item => {
            const tempFn = doT.template(item.path);
            const path = tempFn({caseId: this.props.cases ? this.props.cases.case.id : ''});
            return (
              <Item key={path} auth={`${item.auth}`}
                    icon={<FontAwesomeIcon icon={item.icon || faCircle} style={{fontSize: '25px'}} fixedWidth/>}>
                <div style={{display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span className='text'>{item.name}</span>
                  <FontAwesomeIcon className="externa-link" title="在新窗口打开" icon={faExternalLinkAlt} onClick={(e) => {
                    this.NavBlank(e, path, item);
                  }} style={{color: '#d0d0d0'}}/>
                </div>
              </Item>
            );
          })
        }
      </Nav>
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
  getCaseName,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(FavoritesMenus));


FavoritesMenus.contextType = mainRoutersContext
