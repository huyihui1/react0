import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import CaseAdd from '../CaseAdd';
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
        text: '前期分析',
        lenght: '10',
      },
      {
        text: '侦办中',
        lenght: '3',
      },
      {
        text: '已结案',
        lenght: '8',
      },
    ];
    return (
      <div className="hidenBlock">
        <div style={styles.nav}>
          <h2 style={styles.breadcrumb}>我的工作台</h2>
          <div style={styles.buttons}>
            <Button style={styles.button} type="primary" onClick={this.showAddCase}>添加案件</Button>
            <ButtonGroup >
            {buttonGroup.map((item, index) => {
              return (
                <Button
                  key={index}
                  type="primary"
                  style={activeIndex === index ? { background: '#ee706d',borderRadius:"0" } : {borderRadius:"0"}}
                  onClick={() => this.handleSubmit(item.lenght, index)}
                >
                  {item.text}
                </Button>
              );
            })}
          </ButtonGroup>
          </div>
        </div>
        <IceContainer style={styles.container}>
          <CaseAdd visible={this.state.addCase} onClose={this.showAddCase}/>
        </IceContainer>
      </div>
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
