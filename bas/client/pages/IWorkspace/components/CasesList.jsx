import React, {Component} from 'react';
import {Grid, Icon, Dialog, Pagination, Message, Loading} from '@alifd/next';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose} from 'redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons'

import CasesReducer from '../../../stores/case/reducer';
import injectReducer from '../../../utils/injectReducer';
import {getCasesList, updateCase, setCase, activeCase} from '../../../stores/case/actions';

import '../style.css';
import { mainRoutersContext } from '../../../contexts/mainRoutes-context';
import CaseSetting from './CaseSetting'

const {Row, Col} = Grid;

class CasesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      casesList: [],
      current: 1,
      pageTotal: 1,
      caseId: null,
      caseSettingVisible: false
    };
    this.handleClick = this.handleClick.bind(this);
  }


  handleInvoke = (caseData) => {
    this.props.setCase(caseData);
    if (this.context.itemType === 'pbills') {
      this.props.history.push(`/cases/${caseData.id}/overview`);
    } else if (this.context.itemType === 'bbills') {
      this.props.history.push(`/cases/${caseData.id}/bbills/overview`);
    }
    // Dialog.confirm({
    //   content: '请先申请权限在查看调用示例',
    // });
  };

  handleOnline = (e, index) => {
    e.stopPropagation();
    const {id, name, num, operator, memo, status} = this.state.casesList[index];
    this.props.addCaseEvent({id, name, num, operator, memo, status});
  };

  handleCaseSettingForm = (e, id) => {
    e.stopPropagation();
    this.setState({
      caseId: id
    })
    this.showCaseSettingModel()
  }

  handleClick = (text) => {
    if (text === '添加') {
      this.showAddModal();
    } else {
      Message.success(`暂不支持${text}`);
    }
  };

  onPageChange = (current) => {
    console.log(current);
    this.setState({
      current,
    }, () => {
      const {case: {caseStatus}} = this.props;
      if (caseStatus === 0) {
        this.props.activeCase({
          page: this.state.current,
          pagesize: this.props.pageSize,
        });
      } else if (caseStatus === 1) {
        this.props.archivedCase({
          page: this.state.current,
          pagesize: this.props.pageSize,
        });
      } else {
        this.props.getCasesList({
          page: this.state.current,
          pagesize: this.props.pageSize,
        });
      }
    });
  };

  componentDidMount() {
    //  获取数据
    // this.props.getCasesList({
    //   page: this.state.current,
    //   pagesize: this.props.pageSize,
    // }, true);
    this.props.activeCase({
      page: this.state.current,
      pagesize: this.props.pageSize,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.state.casesList) !== JSON.stringify(nextProps.case.items)) {
      this.setState({
        casesList: nextProps.case.items,
      });
    }

    if (nextProps.meta.page) {
      this.setState({
        current: nextProps.meta.page.current,
        pageTotal: nextProps.meta.page.total,
      });
    }
  }
  blankUrl = (e, caseId) => {
    e.stopPropagation();
    let url = `/#/cases/${caseId}/overview`;
    if (this.context.itemType === 'bbills') {
      url = `/#/cases/${caseId}/bbills/overview`
    }
    const w = window.open('about:blank');
    w.location.href = url;
  }

  showCaseSettingModel = () => {
    this.setState({
      caseSettingVisible: !this.state.caseSettingVisible,
    }, () => {
      if (!this.state.caseSettingVisible) {
        this.setState({
          caseId: null
        })
      }
    })
  }

  render() {
    return (
      <div>
        <Loading tip="加载中..." visible={this.props.isLoading} style={{width: '100%', minHeight: '660px'}}>
          <Row wrap gutter="20">
            <Col l="6" xs="12" xxs="24">
              <div style={{...styles.card, ...styles.createScheme}} onClick={() => {
                this.props.addCaseEvent()
              }}>
                <Icon type="add" size="large" style={styles.addIcon}/>
                <span>新增案件</span>
              </div>
            </Col>
            {this.state.casesList.map((data, index) => {
              return (
                <Col l="6" xs="12" xxs="24" key={index} onClick={this.handleInvoke.bind(this, data)}>
                  <div style={styles.card}>
                    <div style={styles.head}>
                      <h4 style={styles.title}>{data.num}</h4>
                      {/* <p style={styles.desc}>{data.name}</p> */}
                      <Icon type="edit" style={{...styles.editIcon, right: '55px'}} size={"small"} onClick={(e) => {
                        this.handleOnline(e, index)
                      }}/>
                      <Icon type="set" style={{...styles.editIcon, right: '32px'}} size={"small"} onClick={(e) => {
                        this.handleCaseSettingForm(e, data.id)
                      }}/>
                      <FontAwesomeIcon style={{...styles.editIcon, right: 0, width: '20px', height: '15px'}} icon={faExternalLinkAlt} onClick={(e) => { this.blankUrl(e, data.id) }} />
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
                        {`${data.bb_bill_count}份${data.bb_rec_count}条`}
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
        <CaseSetting visible={this.state.caseSettingVisible} caseId={this.state.caseId} onClose={this.showCaseSettingModel} />
        <div style={styles.pagination}>
          <Pagination
            current={this.state.current}
            onChange={this.onPageChange}
            total={this.state.pageTotal * this.props.pageSize}
            hideOnlyOnePage
          />
        </div>
      </div>

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
    meta: state.cases.meta,
    case: state.cases,
    pageSize: state.cases.pageSize,
    isLoading: state.cases.isLoading,
  };
};

const mapDispatchToProps = {
  getCasesList,
  updateCase,
  setCase,
  activeCase,
};
const withReducer = injectReducer({key: 'cases', reducer: CasesReducer});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withReducer,
  withConnect,
)(withRouter(CasesList));
CasesList.contextType = mainRoutersContext

