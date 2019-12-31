import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { enquireScreen } from 'enquire-js';
import { Balloon, Icon, Grid, Button } from '@alifd/next';

const { Row, Col } = Grid;

const ButtonGroup = Button.Group;

export default class StatisticalCard extends Component {
  static displayName = 'StatisticalCard';

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      activeIndex: null,
      addCase: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAddCase = this.showAddCase.bind(this);
  }

  componentDidMount() {
    this.enquireScreenRegister();
  }

  handleSubmit = (len, idx) => {
    this.setState({
      activeIndex: idx,
    });
  };

  showAddCase(){
    this.setState({
      addCase: !this.state.addCase
    })
  }

  enquireScreenRegister = () => {
    const mediaCondition = 'only screen and (max-width: 720px)';

    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    }, mediaCondition);
  };


  render() {
    const {activeIndex} = this.state
    const buttonGroup = [
      {
        text: '已发布',
        lenght: '10',
      },
      {
        text: '开发中',
        lenght: '3',
      },
      {
        text: '我的',
        lenght: '8',
      },
    ];
    return (
      <IceContainer style={styles.container}>
        <div style={styles.nav}>
          <h2 style={styles.breadcrumb}>话单浏览：{"2018-01-01ABC"}</h2>
        </div>
      </IceContainer>
    );
  }
}

const styles = {
  nav: {
    background: 'white',
    height: '72px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative'
  },
  breadcrumb: {
    borderLeft: '5px solid #447eff',
    paddingLeft: '16px',
    margin: '0 0 0 20px',
  },
  buttons:{
    position: 'absolute',
    right: '0'
  },
  button:{
    margin: '0 5px'
  },
  container: {
    padding: '10px 20px',
  },
  statisticalCardItem: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0',
  },
  circleWrap: {
    width: '70px',
    height: '70px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    marginRight: '10px',
  },
  imgStyle: {
    maxWidth: '100%',
  },
  helpIcon: {
    marginLeft: '5px',
    color: '#b8b8b8',
  },
  statisticalCardDesc: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statisticalCardText: {
    position: 'relative',
    color: '#333333',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  statisticalCardNumber: {
    color: '#333333',
    fontSize: '24px',
  },
  itemHelp: {
    width: '12px',
    height: '12px',
    position: 'absolute',
    top: '1px',
    right: '-15px',
  },
};
