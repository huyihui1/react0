import React, {Component} from 'react';
import {Button, Progress} from '@alifd/next';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ajax from '../../utils/ajax';
import {actions as caseOverviewActions} from '../../stores/caseOverview';
import IceNotification from '@icedesign/notification';

class BtnList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      celltowerProgress: {
        percent: 0,
        title: null,
      },
      citizenProgress: {
        percent: 0,
        title: null,
      },
      mergePbillsProgress: {
        percent: 0,
        title: null,
      },
      calltrackStart: false,
      citizensStart: false,
      mergePbillsStart: false,
      caseOverviews: null
    };
    this.mergePbills = null;
    this.citizensTime = null;
    this.calltrackTime = null;
    this.onCalltrackClick = this.onCalltrackClick.bind(this);
    this.onCitizensClick = this.onCitizensClick.bind(this);
    this.onMergePbillsClick = this.onMergePbillsClick.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  onCalltrackClick(caseId = this.props.caseId) {
    const {calltrackStart} = this.state;
    if (calltrackStart) return;
    this.setState({
      calltrackStart: true,
      celltowerProgress: {...this.state.celltowerProgress, percent: 0},
    });
    this.openNotificationWithIcon('解析基站信息后台任务开始执行。','info');
    ajax.post(`/cases/${caseId}/connect-cell-towers`, {}).then((res) => {
      if (res.meta.success) {
        this.calltrackTime = setInterval(() => {
          ajax.get(`/cases/${caseId}/background_tasks/${res.data[0].id}/progress`).then(res => {
            let percent = 0;
            if (res.data[0].total > 0) {
              percent = res.data[0].processed / res.data[0].total * 100;
              percent = percent > 100 ? 100 : percent;
            }
            this.setState({
              celltowerProgress: {...this.state.celltowerProgress, percent},
            }, () => {
              if (this.state.celltowerProgress.percent >= 100) {
                this.setState({
                  calltrackStart: false,
                });
                this.openNotificationWithIcon('解析基站信息后台任务完成。','success', this.calltrackTime);
              }
            });
          });
        }, 3000);
      }
    }).catch(err => {
      this.setState({
        calltrackStart: false,
      });
      console.log(err);
    });
  }

  onCitizensClick(caseId = this.props.caseId) {
    const {citizensStart} = this.state;
    if (citizensStart) return;
    this.setState({
      citizensStart: true,
      citizenProgress: {...this.state.citizenProgress, percent: 0},
    });
    this.openNotificationWithIcon('关联人员信息后台任务开始执行。','info');
    ajax.post(`/cases/${caseId}/connect-citizens`, {}).then((res) => {
      if (res.meta.success) {
        this.citizensTime = setInterval(() => {
          ajax.get(`/cases/${caseId}/background_tasks/${res.data[0].id}/progress`).then(res => {
            let percent = 0;
            if (res.data[0].total > 0) {
              percent = res.data[0].processed / res.data[0].total * 100;
              percent = percent > 100 ? 100 : percent;
            }
            this.setState({
              citizenProgress: {...this.state.citizenProgress, percent},
            }, () => {
              if (this.state.citizenProgress.percent >= 100) {
                this.openNotificationWithIcon('关联人员信息后台任务完成。', 'success', this.citizensTime);
                this.setState({
                  citizensStart: false,
                });
              }
            });
          });
        }, 3000);
      }
    }).catch(err => {
      this.setState({
        citizensStart: false,
      });
      console.log(err);
    });
  }

  onMergePbillsClick(caseId = this.props.caseId) {
    const {mergePbillsStart} = this.state;
    if (mergePbillsStart) return;
    this.openNotificationWithIcon('补全对方基站后台任务开始执行。','info');
    this.setState({
      mergePbillsStart: true,
      mergePbillsProgress: {...this.state.mergePbillsProgress, percent: 0}
    }, () => {
      ajax.post(`/cases/${caseId}/merge-pbills`, {}).then((res) => {
        if (res.meta.success) {
          this.mergePbills = setInterval(() => {
            ajax.get(`/cases/${caseId}/background_tasks/${res.data[0].id}/progress`).then(res => {
              let percent = 0;
              if (res.data[0].total > 0) {
                percent = res.data[0].processed / res.data[0].total * 100;
                percent = percent > 100 ? 100 : percent;
              }
              this.setState({
                mergePbillsProgress: {...this.state.mergePbillsProgress, percent},
              }, () => {
                if (this.state.mergePbillsProgress.percent >= 100) {
                  this.setState({
                    mergePbillsStart: false,
                  });
                  this.openNotificationWithIcon('补全对方基站后台任务完成。','success', this.mergePbills);
                }
              });
            });
          }, 3000);
        }
      }).catch(err => {
        this.setState({
          mergePbillsStart: false,
        });
        console.log(err);
      });
    });

  }

  openNotificationWithIcon = (title, type, clearTimer) => {
    IceNotification[type]({
      message: title,
    });
    if (clearTimer) {
      clearInterval(clearTimer)
    }
  };



  componentWillReceiveProps(nextProps) {
    if (nextProps.caseOverviews && nextProps.caseOverviews.items.jobs) {
      this.fetchData(nextProps.caseOverviews);
    }
  }

  componentDidMount() {
    if (this.props.caseOverviews && this.props.caseOverviews.items.jobs) {
      this.fetchData(this.props.caseOverviews);
    } else {
      // setTimeout(() => {
      //   this.basic()
      // }, 10);
      this.props.actions.fetchCaseOverviews({case_id: this.props.caseId})
    }
  }

  componentWillUnmount() {
    clearInterval(this.calltrackTime);
    clearInterval(this.citizensTime);
    clearInterval(this.mergePbills);
  }

  fetchData(caseOverviews) {
    const {caseId} = this.props;
    caseOverviews.items.jobs.forEach(item => {
      if (item.jtype === 'conn_celltower_job') {
        if (item.ended_at) {
          this.setState({
            celltowerProgress: {...this.state.celltowerProgress, percent: 100},
          });
        } else {
          this.setState({
            calltrackStart: true,
            celltowerProgress: {percent: 0, title: null},
          }, () => {
            clearInterval(this.calltrackTime);
            this.calltrackTime = setInterval(() => {
              ajax.get(`/cases/${caseId}/background_tasks/${item.jid}/progress`).then(res => {
                let percent = 0;
                if (res.data[0].total > 0) {
                  percent = res.data[0].processed / res.data[0].total * 100;
                  percent = percent > 100 ? 100 : percent;
                }
                if (percent >= 100) {
                  this.setState({
                    calltrackStart: false
                  })
                  this.openNotificationWithIcon('解析基站信息后台任务完成。','success', this.calltrackTime);
                }
                this.setState({
                  celltowerProgress: {percent, title: item.ended_at},
                });
              });
            }, 3000)
          })
        }
      }
      if (item.jtype === 'conn_citizen_job') {
        if (item.ended_at) {
          this.setState({
            citizenProgress: {...this.state.citizenProgress, percent: 100},
          });
        } else {
          this.setState({
            citizensStart: true,
            citizenProgress: {percent: 0, title: null},
          }, () => {
            clearInterval(this.calltrackTime);
            this.calltrackTime = setInterval(() => {
              ajax.get(`/cases/${caseId}/background_tasks/${item.jid}/progress`).then(res => {
                let percent = 0;
                if (res.data[0].total > 0) {
                  percent = res.data[0].processed / res.data[0].total * 100;
                  percent = percent > 100 ? 100 : percent;
                }
                if (percent >= 100) {
                  this.setState({
                    citizensStart: false
                  })
                  this.openNotificationWithIcon('关联人员信息后台任务完成。','success', this.calltrackTime);
                }
                this.setState({
                  citizenProgress: {percent, title: item.ended_at},
                });
              });
            }, 3000)
          })
        }
      }
      if (item.jtype === 'merge_pbills_job') {
        if (item.ended_at) {
          this.setState({
            mergePbillsProgress: {...this.state.mergePbillsProgress, percent: 100},
          });
        } else {
          this.setState({
            mergePbillsStart: true,
            mergePbillsProgress: {percent: 0, title: null},
          }, () => {
            clearInterval(this.mergePbills);
            this.mergePbills = setInterval(() => {
              ajax.get(`/cases/${caseId}/background_tasks/${item.jid}/progress`).then(res => {
                let percent = 0;
                if (res.data[0].total > 0) {
                  percent = res.data[0].processed / res.data[0].total * 100;
                  percent = percent > 100 ? 100 : percent;
                }
                if (percent >= 100) {
                  this.setState({
                    mergePbillsStart: false
                  })
                  this.openNotificationWithIcon('补全对方基站后台任务完成。','success', this.mergePbills);
                }
                this.setState({
                  mergePbillsProgress: {percent, title: item.ended_at},
                });
              });
            }, 3000)
          })
        }
      }
    });
  }

  render() {
    const {celltowerProgress, citizenProgress, mergePbillsProgress} = this.state;
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div>
          <Button style={{marginRight: '15px', background: '#e8f1ff'}}
                  component="a"
                  onClick={() => {
                    this.onMergePbillsClick();
                  }}
          >补全对方基站
          </Button>
          <div style={{width: '110%', marginLeft: '10px'}} title={mergePbillsProgress.title}>
            <div style={{display: mergePbillsProgress.percent === 0 ? 'block' : 'none'}}>
              <Progress percent={0} size="small"/>
            </div>
            <div style={{display: mergePbillsProgress.percent === 0 ? 'none' : 'block'}}>
              <Progress percent={mergePbillsProgress.percent} size="small"/>
            </div>
          </div>
        </div>
        <div>
          <Button style={{marginRight: '15px', background: '#e8f1ff'}}
                  component="a"
                  onClick={() => {
                    this.onCitizensClick();
                  }}
          >关联人员信息
          </Button>
          <div style={{width: '110%', marginLeft: '10px'}} title={citizenProgress.title}>
            <div style={{display: citizenProgress.percent === 0 ? 'block' : 'none'}}>
              <Progress percent={0} size="small"/>
            </div>
            <div style={{display: citizenProgress.percent === 0 ? 'none' : 'block'}}>
              <Progress percent={citizenProgress.percent} size="small"/>
            </div>
          </div>
        </div>
        <div>
          <Button style={{marginRight: '15px', background: '#e8f1ff'}}
                  component="a"
                  onClick={() => {
                    this.onCalltrackClick();
                  }}
          >解析基站信息
          </Button>
          <div style={{width: '110%', marginLeft: '8px'}} title={celltowerProgress.title}>
            <div style={{display: celltowerProgress.percent === 0 ? 'block' : 'none'}}>
              <Progress percent={0} size="small"/>
            </div>
            <div style={{display: celltowerProgress.percent === 0 ? 'none' : 'block'}}>
              <Progress percent={celltowerProgress.percent} size="small"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    caseOverviews: state.caseOverviews,
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...caseOverviewActions}, dispatch),
  }),
)(BtnList);
