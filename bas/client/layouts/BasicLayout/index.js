import React, { Component } from 'react';
import Layout from '@icedesign/layout';
import { withRouter } from 'react-router';
import { enquire } from 'enquire-js';
import postscribe from 'postscribe';

import Header from './components/Header';
import Aside from './components/Aside';
import Footer from './components/Footer';
import BasicLayoutHoc from './BasicLayoutHoc';
import MainRoutes from './MainRoutes';
import './index.scss';
import appConfig from '../../appConfig';
import {mainRoutersContext, itemType, subSystems} from '../../contexts/mainRoutes-context';
import ajaxs from '../../utils/ajax';

@withRouter
@BasicLayoutHoc
export default class BasicLayout extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.toggleItemType = (t) => {
      console.log(t);
      this.props.history.push('/');
      ajaxs.post(`/user/settings`, {
        k: 'user.subSystem',
        v: t
      })
      this.setState({
        itemType: t
      })
    }
    this.state = {
      isScreen: 'isDesktop',
      itemType: itemType,
      subSystems,
      toggleItemType: this.toggleItemType
    };
  }

  componentWillMount() {
    if (!BUILD_TYPE) {
      ajaxs.get(`/user/session`).then(res => {
        this.setState({
          itemType: res.data.sub_system,
          subSystems: res.data.sub_systems
        })
      })
    }
  }

  componentDidMount() {
    this.enquireScreenRegister();
  }

  /**
   * 注册监听屏幕的变化，可根据不同分辨率做对应的处理
   */
  enquireScreenRegister = () => {
    const isMobile = 'screen and (max-width: 720px)';
    const isTablet = 'screen and (min-width: 721px) and (max-width: 1199px)';
    const isDesktop = 'screen and (min-width: 1200px)';

    enquire.register(isMobile, this.enquireScreenHandle('isMobile'));
    enquire.register(isTablet, this.enquireScreenHandle('isTablet'));
    enquire.register(isDesktop, this.enquireScreenHandle('isDesktop'));
  };

  enquireScreenHandle = (type) => {
    const handler = {
      match: () => {
        this.setState({
          isScreen: type,
        });
      },
    };

    return handler;
  };

  render() {
    const { profile = {}, userLogout } = this.props;
    const isMobile = this.state.isScreen !== 'isDesktop';
    const layoutClassName = 'ice-design-layout-light ice-design-layout'; // 调整为light 类名

    return (
      <mainRoutersContext.Provider value={this.state}>
        <div id="basicLayout" className={layoutClassName}>
          <Layout>
            <Header
              isMobile={isMobile}
              profile={profile}
              handleLogout={userLogout}
            />
            <Layout.Section>
              <Layout.Aside width="auto" type={null}>
                <Aside isMobile={isMobile} />
              </Layout.Aside>
              <Layout.Main style={{width: '85%'}}>
                <MainRoutes />
              </Layout.Main>
            </Layout.Section>

            <Footer />
          </Layout>
        </div>
      </mainRoutersContext.Provider>
    );
  }
}
