import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { MenuButton } from '@alifd/next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSquare, faYenSign } from '@fortawesome/free-solid-svg-icons';
import { isCas, isTas } from '../../../../utils/utils';
import appConfig from '../../../../appConfig';
import {mainRoutersContext} from '../../../../contexts/mainRoutes-context';
import {getFavoritesList, clearFavorites} from '../../../../stores/menus/actions';

import './index.scss';

const { Item } = MenuButton;
let logoText = appConfig.pbasTitle;

// if (isCas()) {
//   logoText = '话单分析系统';
// } else if (isTas()) {
//   logoText = '账单分析系统';
// }


 class Logo extends PureComponent {
  static contextType = mainRoutersContext;
  constructor(props) {
    super(props);
  }

  render() {
    const org = this.props.login && this.props.login.loginResult && this.props.login.loginResult.org;
    return (
      <mainRoutersContext.Consumer>
        {
          ({itemType, subSystems, toggleItemType}) => {
            if (itemType === appConfig.BBAS) {
              logoText = appConfig.bbasTitle
              if (org) {
                logoText = org + '账单分析'
              }
            } else {
              logoText = appConfig.pbasTitle;
              if (this.props.login && this.props.login.loginResult && this.props.login.loginResult.org) {
                logoText = org + '话单分析'
              }
            }
            window.sessionStorage.setItem('title', logoText)
            if (subSystems.length === 2) {
              return (
                <div className="logo">
                  <MenuButton style={{paddingLeft: 0}} text label={<span className="logo-text">
                  <FontAwesomeIcon icon={logoText.indexOf('账单分析') !== -1 ? faYenSign : faPhoneSquare} fixedWidth />
                    {logoText}
                </span>} onItemClick={(key) => {
                    this.props.clearFavorites()
                    this.props.getFavoritesList(key);
                    toggleItemType(key)
                  }}>{
                    logoText.indexOf('账单分析') !== -1 ? <Item key={appConfig.PBAS}>{(org + '话单分析') || appConfig.pbasTitle}</Item> : <Item key={appConfig.BBAS}>{(org + '账单分析') || appConfig.bbasTitle}</Item>
                  }</MenuButton>
                </div>
              )
            } else if (subSystems[0] === 'bbills') {
              return (
                <div className="logo">
                  <div className="logo-text">
                    <FontAwesomeIcon icon={faYenSign} fixedWidth />
                    {logoText}
                  </div>
                </div>
              )
            } else if (subSystems[0] === 'pbills') {
              return (
                <div className="logo">
                  <div className="logo-text">
                    <FontAwesomeIcon icon={faPhoneSquare} fixedWidth />
                    {logoText}
                  </div>
                </div>
              )
            }
          }
        }
      </mainRoutersContext.Consumer>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login
  };
};
const mapDispatchToProps = {
  getFavoritesList,
  clearFavorites
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logo);
