import React, {Component} from 'react';
import PageTitle from '../common/PageTitle';
import PbillsList from './components/PbillsList'
import DocumentTitle from 'react-document-title';
import * as Scroll from 'react-scroll';


// 回到顶部动画设置, 值越小越快
const scrollTime = 300;
const scroll = Scroll.animateScroll;

const topIcon = (
  <svg t="1569296853164" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
       p-id="3812" width="32" height="32">
    <path
      d="M796.422846 524.478323 537.312727 265.185862c-6.368176-6.39914-14.688778-9.471415-22.976697-9.407768-1.119849-0.096331-2.07972-0.639914-3.19957-0.639914-4.67206 0-9.024163 1.087166-13.023626 2.879613-4.032146 1.536138-7.87163 3.872168-11.136568 7.135385L227.647682 524.27706c-12.512727 12.480043-12.54369 32.735385-0.032684 45.248112 6.239161 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.624056-9.34412L479.1356 363.426421l0 563.712619c0 17.695686 14.336138 31.99914 32.00086 31.99914s32.00086-14.303454 32.00086-31.99914L543.13732 361.8576l207.91012 207.73982c6.240882 6.271845 14.496116 9.440452 22.687703 9.440452s16.319527-3.103239 22.560409-9.311437C808.870206 557.277355 808.902889 536.989329 796.422846 524.478323z"
      p-id="3813" fill="#8a8a8a"></path>
    <path
      d="M864.00258 192 160.00258 192c-17.664722 0-32.00086-14.336138-32.00086-32.00086S142.337858 128 160.00258 128l704 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.698266 192 864.00258 192z"
      p-id="3814" fill="#8a8a8a"></path>
  </svg>
);



class Pbills extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "话单列表"};
    this.state = {

    };
  }
  componentDidMount() {
    window.onscroll = () => {
      const t = document.documentElement.scrollTop || document.body.scrollTop;
      // if (Array.isArray(this.props.PBAnalyze) && this.props.PBAnalyze.length == 0) return;
      const topDom = document.getElementById('top');
      if (t > 500) {
        topDom.classList.add('show');
      } else {
        topDom.classList.remove('show');
      }
    };
  }
  componentWillUnmount() {
    window.onscroll = null
  }


  onTop = () => {
    scroll.scrollTo(0, {
      duration: scrollTime
    });
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div style={{height: '100%'}}>
          <div id="top" onClick={this.onTop}>
            {topIcon}
          </div>
          <PageTitle title={this.meta.title} tour={{page: "pbills"}}/>
          <PbillsList/>
        </div>
      </DocumentTitle>
    );
  }
}

export default Pbills;
