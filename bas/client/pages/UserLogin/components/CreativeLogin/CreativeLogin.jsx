import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import Hotkeys from 'react-hot-keys';
import DocumentTitle from 'react-document-title';
import LoginIntro from './LoginIntro';
import LoginForm from './LoginForm';
import appConfig from '../../../../appConfig'
import { mainRoutersContext } from '../../../../contexts/mainRoutes-context';

const { Row, Col } = Grid;

export default class CreativeLogin extends Component {
  static propTypes = {};

  static defaultProps = {};
  static contextType = mainRoutersContext;

  constructor(props) {
    super(props)
    this.meta = {title: '数岚情报分析平台'};
    this.state = {
      devMode: true
    }
  }

  componentDidMount() {
    window.sessionStorage.removeItem('title')
  }

  onKeyDown = () => {
    this.setState({devMode: true})
  }

  render() {
    // if (this.context.itemType === appConfig.BBAS) {
    //   this.meta.title = appConfig.bbasTitle
    // } else {
    //   this.meta.title = appConfig.pbasTitle;
    // }
    return (
      <DocumentTitle title={this.meta.title}>
        <Hotkeys
          keyName="shift+w+m+p"
          onKeyDown={this.onKeyDown}
        >
          <div style={styles.container}>
            <Row wrap>
              <Col s={24} m={24} l="12">
                <LoginIntro />
              </Col>
              <Col s={24} m={24} l="12">
                <div style={styles.content}>
                  <LoginForm userLogin={this.props.userLogin} devMode={this.state.devMode}/>
                </div>
              </Col>
            </Row>
          </div>
        </Hotkeys>
      </DocumentTitle>
    );
  }
}

const styles = {
  container: {
    position: 'relative',
    width: '100wh',
    // minWidth: '1200px',
    height: '100vh',
    backgroundImage: `url(${require('./images/bg.jpg')})`,
    overflow: 'hidden',
    overflowY: 'auto'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
};
