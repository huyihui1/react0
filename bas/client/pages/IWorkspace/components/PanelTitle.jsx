import React, {Component} from 'react';
import {connect} from 'react-redux';
import IceContainer from '@icedesign/container';
import {enquireScreen} from 'enquire-js';
import {Grid, Button} from '@alifd/next';
import CaseForm from './CaseForm';
import {getCasesList, activeCase, archivedCase} from '../../../stores/case/actions';
import DocumentTitle from 'react-document-title';
import PageTitle from '../../common/PageTitle/index';
import './../style.css'



const ButtonGroup = Button.Group;

class PanelTitle extends Component {
  static displayName = 'PanelTitle';

  constructor(props) {
    super(props);
    this.meta = {title: "我的工作台"};
    this.state = {
      isMobile: false,
      activeIndex: 0,
      addCase: false,
      values: {
        status: '1'
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAddCase = this.showAddCase.bind(this);
  }

  componentDidMount() {
    this.props.panelTitleRef(this)
    this.enquireScreenRegister();
  }

  handleSubmit = (text, idx) => {
    this.setState({
      activeIndex: idx,
    }, () => {
      if (text === '在办') {
        this.props.activeCase({
          page: 1,
          pagesize: this.props.state.cases.pageSize,
        });
      } else if (text === '存档') {
        this.props.archivedCase();
      } else {
        this.props.getCasesList({
          page: 1,
          pagesize: this.props.state.cases.pageSize,
        });
      }
    });
  };

  showAddCase(values = {status: '1'}) {
    console.log(values);
    this.setState({
      addCase: !this.state.addCase,
      values,
    });
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
    const {activeIndex} = this.state;
    const buttonGroup = [
      {
        text: '在办',
        lenght: '3',
      },
      {
        text: '存档',
        lenght: '8',
      },
      {
        text: '全部',
      },
    ];
    return (
      <DocumentTitle title={this.meta.title}>
        <div className="hidenBlock">
          {/*<div style={styles.nav}>*/}
            {/*<h2 style={styles.breadcrumb}>{this.meta.title}</h2>*/}
            {/*<div style={styles.buttons}>*/}
              {/*<ButtonGroup>*/}
                {/*{buttonGroup.map((item, index) => {*/}
                  {/*return (*/}
                    {/*<Button*/}
                      {/*key={index}*/}
                      {/*type="primary"*/}
                      {/*style={activeIndex === index ? {background: '#ee706d', borderRadius: '0'} : {borderRadius: '0'}}*/}
                      {/*onClick={() => this.handleSubmit(item.text, index)}*/}
                    {/*>*/}
                      {/*{item.text}*/}
                    {/*</Button>*/}
                  {/*);*/}
                {/*})}*/}
              {/*</ButtonGroup>*/}
            {/*</div>*/}
          {/*</div>*/}
          <PageTitle title={this.meta.title} tour={{page: "iWork"}}/>
          <div style={styles.buttons}>
            <ButtonGroup>
              {buttonGroup.map((item, index) => {
                return (
                  <Button
                    key={index}
                    type="primary"
                    style={activeIndex === index ? {background: '#ee706d', borderRadius: '0'} : {borderRadius: '0'}}
                    onClick={() => this.handleSubmit(item.text, index)}
                  >
                    {item.text}
                  </Button>
                );
              })}
            </ButtonGroup>
          </div>

          <IceContainer style={styles.container}>
            <CaseForm visible={this.state.addCase} values={this.state.values} onClose={this.showAddCase}/>
          </IceContainer>
        </div>
      </DocumentTitle>
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
    position: 'relative',
  },
  breadcrumb: {
    borderLeft: '5px solid #447eff',
    paddingLeft: '16px',
    margin: '0 0 0 20px',
  },
  buttons: {
    position: 'absolute',
    right: '15px',
    top: '20px'
  },
  button: {
    margin: '0 5px',
  },
  container: {
    padding: '0',
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

const mapStateToProps = (state) => {
  return {state};
};

const mapDispatchToProps = {
  getCasesList,
  archivedCase,
  activeCase,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PanelTitle);
