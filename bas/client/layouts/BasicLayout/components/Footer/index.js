import React, { PureComponent } from 'react';
import Layout from '@icedesign/layout';
import Logo from '../Logo';

import './index.scss';

export default class Footer extends PureComponent {
  render() {
    return (
      <Layout.Footer className="ice-design-layout-footer" type={null}>
        <div className="ice-design-layout-footer-body">
          <div style={{ filter: 'grayscale(100%)', opacity: 0.3 }}>
            {/*<Logo />*/}
          </div>
          {/*<div className="copyright">*/}
            {/*© 2018 SHULAN Tech*/}
          {/*</div>*/}
        </div>
      </Layout.Footer>
    );
  }
}
