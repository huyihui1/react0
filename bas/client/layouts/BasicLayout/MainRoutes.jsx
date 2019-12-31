import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';

import NotFound from '../../components/NotFound';
import { asideMenuConfig, tasMenuConfig } from '../../menuConfig';
import Authorized from '../../utils/Authorized';
import appConfig from '../../appConfig';
import {mainRoutersContext} from '../../contexts/mainRoutes-context';
import {routerData} from '../../routerConfig';
import {bbasRouterData} from '../../bbasRouterConfig';

const { AuthorizedRoute } = Authorized;
let menuConfig = asideMenuConfig;



class MainRoutes extends Component {
  static displayName = 'MainRoutes';
  static contextType = mainRoutersContext;
  constructor(props) {
    super(props);
    this.state = {
      routerData: routerData,
      itemType: ''
    }
  }

  /**
   * 根据菜单取得重定向地址.
   */
  getRedirectData = () => {
    const redirectData = [];
    const getRedirect = (item) => {
      if (item && item.children) {
        if (item.children[0] && item.children[0].path) {
          redirectData.push({
            from: `${item.path}`,
            to: `${item.children[0].path}`,
          });
          item.children.forEach((children) => {
            getRedirect(children);
          });
        }
      }
    };

    asideMenuConfig.forEach(getRedirect);

    return redirectData;
  };

  /**
   * 渲染权限路由组件
   */
  renderAuthorizedRoute = (item, index) => {
    return item.component ? (
      <AuthorizedRoute
        key={index}
        path={item.path}
        component={item.component}
        exact={item.exact}
        authority={item.authority}
        redirectPath="/exception/403"
      />
    ) : null;
  };
  componentDidMount() {
    if (ASSETS_TYPE === appConfig.BBAS) {
      menuConfig = tasMenuConfig;
      this.setState({
        routerData: bbasRouterData,
        itemType: this.context.itemType
      })
      // import(`../../bbasRouterConfig`).then(module => {
      //   console.log(module);
      //   this.setState({
      //     routerData: module.bbasRouterData,
      //     itemType: this.context.itemType
      //   })
      // })
    }
  }

  componentDidUpdate() {
    if (this.context.itemType !== this.state.itemType) {
      if (this.context.itemType === appConfig.BBAS) {
        menuConfig = tasMenuConfig;
        this.setState({
          routerData: bbasRouterData,
          itemType: this.context.itemType
        })
        // import(`../../bbasRouterConfig`).then(module => {
        //   this.setState({
        //     routerData: module.bbasRouterData,
        //     itemType: this.context.itemType
        //   })
        // })
      } else  {
        this.setState({
          routerData: routerData,
          itemType: this.context.itemType
        })
      }
    }
  }

  render() {
    const redirectData = this.getRedirectData();
    const {routerData} = this.state;
    return (
      <mainRoutersContext.Consumer>
        {
          ({ itemType, toggleItemType }) => {
            return (
              <Switch>
                {/* 渲染权限路由表 */}

                {routerData.map(this.renderAuthorizedRoute)}

                {/* 路由重定向，嵌套路由默认重定向到当前菜单的第一个路由 */}
                {redirectData.map((item, index) => {
                  return <Redirect key={index} exact from={item.from} to={item.to} />;
                })}

                {/* 首页默认重定向到 /iworkspace */}
                <Redirect exact from="/" to="/iworkspace" />
                {/* 未匹配到的路由重定向到 404 */}
                <Route component={NotFound} />
              </Switch>
            )
          }
        }
      </mainRoutersContext.Consumer>
    );
  }
}

export default MainRoutes;
