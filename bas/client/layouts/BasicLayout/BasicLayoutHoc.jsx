import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import injectReducer from '../../utils/injectReducer';
import profileReducer from '../../stores/userProfile/reducer';
import logoutReducer from '../../stores/userLogout/reducer';
import loginReducer from '../../pages/UserLogin/reducer';
import { userProfile } from '../../stores/userProfile/action';
import { userLogout } from '../../stores/userLogout/action';

const BasicLayoutHoc = (WrappedComponent) => {
  class Container extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      this.props.userProfile();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapDispatchToProps = {
    userProfile,
    userLogout,
  };

  const mapStateToProps = (state) => {
    return { profile: state.profile, logout: state.logout };
  };

  const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
  );

  const withProfileReducer = injectReducer({
    key: 'profile',
    reducer: profileReducer,
  });

  const withLogoutReducer = injectReducer({
    key: 'logout',
    reducer: logoutReducer,
  });
  const withLoginReducer = injectReducer({
    key: 'login',
    reducer: loginReducer,
  });
  return compose(
    withProfileReducer,
    withLogoutReducer,
    withLoginReducer,
    withConnect
  )(Container);
};

export default BasicLayoutHoc;
