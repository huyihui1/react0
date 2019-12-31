import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as caseOverviewActions} from '../../../../stores/caseOverview'
import {Message} from '@alifd/next';
import './index.module.scss';
// import DialogForm from './DialogForm';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCog} from '@fortawesome/free-solid-svg-icons';


const mock = [
  {
    title: '事件标注',
    path: '/cases/:id/caseEvent',
  },
  {
    title: '文件导入',
    path: '/cases/:id/pb_filesimport',
  },
  {
    title: '话单浏览',
    path: '/cases/:id/pb_analyze',
  },
  {
    title: '互相碰面查询',
    path: '/cases/:id/meetanalyze',
  },
  {
    title: '号码标注',
    path: '/cases/:id/labelpn',
  },
  {
    title: '虚拟网',
    path: '/cases/:id/vennumbers',
  },
  {
    title: '话单统计',
    path: '/cases/:id/pb_stat',
  },
  {
    title: '伴随号码查询',
    path: '/cases/:id/follownums',
  },
  {
    title: '基站标注',
    path: '/cases/:id/labelct',
  },
  {
    title: '亲情网',
    path: '/cases/:id/relnumbers',
  },
  {
    title: '每日通话轨迹',
    path: '/cases/:id/calltrack',
  },
  {
    title: '综合人员查询',
    path: '/cases/:id/citizens',
  },
  {
    title: 'xxx',
    path: '/',
  },
  {
    title: 'xxx',
    path: '/',
  },
  {
    title: 'xxx',
    path: '/',
  },
  {
    title: 'xxx',
    path: '/',
  },
  {
    title: 'xxx',
    path: '/',
  },
  {
    title: 'xxx',
    path: '/',
  },
];

class Function extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      menusAll: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.getMenusAllData = this.getMenusAllData.bind(this);
  }

  handleClick = (path) => {
    path = path.replace(/{case_id}/i, this.props.caseId);
    return path;
  };

  onOpen(blog) {
    this.setState({visible: blog})
  }

  // componentDidMount() {
  //   const actions = this.props.actions;
  //   actions.getMenusAllCaseOverview().then(res => {
  //     let newArr = res.body.data.slice(0,18);
  //     this.setState({menusAll: newArr})
  //   })
  //
  // }

  getMenusAllData(data) {
    let newArr = data.slice(0, 18);
    this.setState({menusAll: newArr})
  }


  render() {
    const {visible, menusAll} = this.state;
    return (
      <div className="function container" data-tut="reactour__function">
        <div className="function card">
          <h4 className="title">功能区<FontAwesomeIcon style={{float:'right', color:'rgb(163, 187, 243)'}} icon={faCog} onClick={() => {
            this.onOpen(true)
          }}/></h4>
          {/*<DialogForm onOpen={this.onOpen} visible={visible} getMenusAllData={this.getMenusAllData}/>*/}
          <div className="content">
            {menusAll.map((item, index) => {
              return (
                <div
                  key={index}
                  className="item"
                  title={item.label}
                >
                  <Link to={this.handleClick(item.path)}>
                    <p className="itemTitle">{item.label}</p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    caseId: state.cases.case.id,
  }
};

export default connect(
  mapStateToProps,

  dispatch => ({
    actions: bindActionCreators(caseOverviewActions, dispatch),
  })
)(Function);
