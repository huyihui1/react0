import React, { Component, Fragment } from 'react';
import Container from '@icedesign/container';
import { Button, Drawer } from '@alifd/next';


import { connect } from 'react-redux';
import { compose } from 'redux';
import caseReducer from '../../../stores/case/reducer';
import injectReducer from '../../../utils/injectReducer';
import Nofity from '../../common/Nofity';

import CaseSelect from './CaseSelect';


class CaseSwitch extends Component {
  constructor(props) {
    super(props);
    this.changeCase = this.changeCase.bind(this);
    this.state = {
      caseSelect: false,
      visible: false,
    };
  }

  changeCase() {
    this.setState({
      caseSelect: !this.state.caseSelect,
    });
  }

  componentDidMount() {

  }

  onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = (reason, e) => {
    this.setState({
      visible: false,
    });
  }


  render() {
    return (
      <Fragment>
        {this.props.case.name || this.props.login && this.props.login.summary && this.props.login.summary.name ?
          <div style={{cursor: 'pointer'}}>
            {this.props.case.status === 0 ? '存档' : '在办'}案件：
            {/* <span style={{ cursor: 'pointer', borderBottom: '1px solid #447eff', marginRight: '5px' }} */}
            <span style={{ display: 'inline-block', position: 'relative', marginRight: '5px', borderBottom: '1px solid #447eff' }} onClick={this.onOpen}>
              {
                this.props.case.name || this.props.login.summary && this.props.login.summary.name
              }
              <Nofity style={{position: 'absolute', right: '-20px'}}/>
            </span>
            <CaseSelect visible={this.state.visible} onClose={this.onClose} afterSwitchFun={this.props.afterSwitchFun} />
          </div>
          :
          null
        }
      </Fragment>
    );
  }
}


const mapStateToProps = (state) => {
  return { case: state.cases.case, login: state.login };
};

const mapDispatchToProps = {

};
const withReducer = injectReducer({ key: 'cases', reducer: caseReducer });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withReducer,
  withConnect,
)(CaseSwitch);
