import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Grid, Drawer, Loading } from '@alifd/next';
import moment from 'moment';

import injectReducer from '../../../utils/injectReducer';
import CasesReducer from '../../../stores/case/reducer';
import { updateCase, getCasesList, activeCase, setCase } from '../../../stores/case/actions';
import appConfig from '../../../appConfig';

const {Row, Col} = Grid;

import './caseSelect.scss'

@withRouter
class CaseSelect extends Component {
  static displayName = 'CaseSelect';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      isRequest: true,
      showLoading: true,
      casesList: []
    };

  }

  fetchData = () => {
    this.props.getCasesList({
      page: this.state.current,
      pagesize: this.props.pageSize,
    }).then((res) => {
      if (res.meta.success) {
        this.setState({
          casesList: res.data,
          showLoading: false
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }

  componentDidMount() {
    this.fetchData()
  }


  handleInvoke = (caseData) => {
    this.props.setCase(caseData);
    const {history: {location: {pathname}}} = this.props;
    const url = pathname.replace(/[0-9]+/g, caseData.id);
    this.props.history.replace('/reload');
    this.props.onClose()
    setTimeout(() => {
      this.props.history.push(url);
    }, 20)
  }

  onScroll = (e) => {
    let scrollTop = e.target.scrollTop;
    let h = e.target.offsetHeight;
    if (scrollTop > h / 2 && this.state.isRequest) {
      let {current} = this.state
      current += 1;
      this.props.getCasesList({
        page: current,
        pagesize: this.props.pageSize,
      }).then((res) => {
        if (res.meta.success) {
          if (res.data.length > 0) {
            this.setState({
              isRequest: true,
              casesList: [...this.state.casesList, ...res.data]
            })
          }
        }
      }).catch(err => {
        console.log(err);
      })
      this.setState({
        current,
        isRequest: false
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.setState({
        current: 1,
        casesList: [],
        isRequest: true,
        showLoading: true
      }, () => {
        this.fetchData()
      })
    }
  }

  render() {
    return (
      <Drawer
        title="案件切换"
        placement="left"
        visible={this.props.visible}
        width={350}
        onClose={this.props.onClose}
        bodyStyle={{background: '#eee'}}
        onScroll={this.onScroll}
      >
        <Loading visible={this.state.showLoading} style={{width: '100%'}}>
          <Row wrap>
            {this.state.casesList.map((data, index) => {
              return (
                <Col l="24" xs="24" xxs="24" key={index} onClick={this.handleInvoke.bind(this, data)}>
                  <div className={'caseList'} style={styles.card}>
                    <div style={styles.head}>
                      <h4 style={styles.title}>{data.num}</h4>
                    </div>
                    <div style={styles.body}>
                      <p style={{...styles.creator, ...styles.info}}>
                        <span className="keith">案件名称：</span>
                        {data.name}
                      </p>
                      <p style={{...styles.leader, ...styles.info}}>
                        <span className="keith">话单记录：</span>
                        {`${data.owner_num_count}份${data.pb_rec_count}条`}
                      </p>
                      <p style={{...styles.time, ...styles.info}}>
                        <span className="keith">话单时间：</span>
                        <span style={{
                          display: 'inline-block',
                          transform: 'scale(.85)',
                          marginLeft: '-14px'
                        }}>{`${data.pb_started_at ? `${moment(data.pb_started_at).format('YYYY年MM月DD日')} - ` : ''}${data.pb_ended_at ? moment(data.pb_ended_at).format('YYYY年MM月DD日') : ''}`}</span>
                      </p>
                      <p style={{...styles.time, ...styles.info}}>
                        <span className="keith">账单记录：</span>
                        {`${data.owner_card_count}份${data.bb_rec_count}条`}
                      </p>
                      <p style={{...styles.time, ...styles.info}}>
                        <span className="keith">账单时间：</span>
                        <span style={{
                          display: 'inline-block',
                          transform: 'scale(.85)',
                          marginLeft: '-14px'
                        }}>{`${data.bb_started_at ? `${moment(data.bb_started_at).format('YYYY年MM月DD日')} - ` : ''}${data.bb_ended_at ? moment(data.bb_ended_at).format('YYYY年MM月DD日') : ''}`}</span>
                      </p>
                      <p style={{...styles.leader, ...styles.info}}>
                        <span className="keith">案件状态：</span>
                        {data.status === '1' ? '在办' : '存档'}
                      </p>
                      <p style={{...styles.leader, ...styles.info}}>
                        <span className="keith">经&nbsp;&nbsp;办&nbsp;&nbsp;人：</span>
                        {data.operator}
                      </p>
                      <p style={{...styles.leader, ...styles.info}}>
                        <span className="keith">备&emsp;&emsp;注：</span>
                        {data.memo}
                      </p>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Loading>
      </Drawer>
    );
  }
}

const styles = {
  container: {
    background: '#fafafa',
  },
  createScheme: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '310px',
    cursor: 'pointer',
  },
  card: {
    displayName: 'flex',
    marginBottom: '20px',
    background: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    minWidth: '283px'
  },
  head: {
    position: 'relative',
    padding: '16px 16px 8px',
    borderBottom: '1px solid #e9e9e9',
  },
  title: {
    margin: '0 0 5px',
    width: '90%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '16px',
    fontWeight: '500',
    color: 'rgba(0,0,0,.85)',
  },
  desc: {
    margin: '0',
    fontSize: '14px',
    color: '#666',
  },
  body: {
    position: 'relative',
    padding: '16px',
  },
  info: {
    margin: '0 0 8px',
    fontSize: '13px',
    color: '#666',
  },
  time: {
    position: 'relative',
    whiteSpace: 'nowrap'
  },
  addIcon: {
    marginRight: '10px',
  },
  editIcon: {
    position: 'absolute',
    top: '50%',
    right: '16px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    zIndex: 30,
  },
  label: {
    display: 'inline-block',
    width: '65px',
    textAlign: 'justify',
    verticalAlign: 'top',
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

const mapStateToProps = (state) => {
  return {
    case: state.cases.case,
    casesList: state.cases.items,
    pageSize: state.cases.pageSize,
    meta: state.cases.meta,
  };
};

const mapDispatchToProps = {
  updateCase,
  getCasesList,
  activeCase,
  setCase
};
const withReducer = injectReducer({ key: 'cases', reducer: CasesReducer });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withRouter,
  withReducer,
  withConnect,
)(CaseSelect);
