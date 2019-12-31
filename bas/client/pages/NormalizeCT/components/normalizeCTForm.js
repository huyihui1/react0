import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Dialog, Table, Input, Button, Message, Upload, Select, Checkbox} from '@alifd/next';
import moment from 'moment';
import {actions as NormalizeCTActions} from '../../../stores/NormalizeCT';
import './normalizeCt.css'

import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

const Option = Select.Option;

class normalizeCTForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerSuggesList: [],
      peerSuggesList: [],
      ownerSuggesCode: '',
      peerSuggesCode: '',
      ownerCompletionList: '',
      peerCompletionList: '',
      checkedStatus: ''
    };
    this.onRowClickOwner = this.onRowClickOwner.bind(this);
    this.onRowClickPeer = this.onRowClickPeer.bind(this);
    this.completeData = this.completeData.bind(this);
    this.checkboxChange = this.checkboxChange.bind(this)
  }


  onTableChange = (ids, records) => {
    const {rowSelection, licensesId} = this.state;
    rowSelection.selectedRowKeys = ids;
    this.setState({rowSelection});
  };

  onRowClickOwner(record, index, e) {
    const {ownerSuggesList} = this.state;
    ownerSuggesList.forEach(item => {
      if (record === item) {
        this.setState({ownerSuggesCode: item.ct_code});
        item.checkStatus = true;
        item.check = <Checkbox checked={item.checkStatus}></Checkbox>
      } else {
        item.checkStatus = false;
        item.check = <Checkbox checked={item.checkStatus}></Checkbox>
      }
    });

    this.setState({ownerSuggesList, ownerCompletionList: record});
  }

  onRowClickPeer(record) {
    const {peerSuggesList} = this.state;

    peerSuggesList.forEach(item => {
      if (record === item) {
        this.setState({peerSuggesCode: item.ct_code});
        item.checkStatus = true;
        item.check = <Checkbox checked={item.checkStatus}></Checkbox>
      } else {
        item.checkStatus = false;
        item.check = <Checkbox checked={item.checkStatus}></Checkbox>
      }
    });
    this.setState({peerSuggesList, peerCompletionList: record});
  }

  completeData() {
    const {actions, caseId, normalizeRowData} = this.props;
    const {ownerCompletionList, peerCompletionList, checkedStatus} = this.state;
    if (ownerCompletionList || peerCompletionList) {
      actions.completeDataNormalizeCT({
        caseId: caseId,
        id: normalizeRowData.id,
        owner_lac: ownerCompletionList.lac,
        owner_ci: ownerCompletionList.ci,
        owner_mnc: ownerCompletionList.mnc,
        peer_lac: peerCompletionList.lac,
        peer_ci: peerCompletionList.ci,
        peer_mnc: peerCompletionList.mnc,
        complement_same_ct_code: checkedStatus === true ? 1 : ''
      }).then(res => {
        if (res.status === 'resolved') {
          Message.success('补全成功');
          this.setState({ownerCompletionList: '', peerCompletionList: ''});
          this.props.fetch(this.props.current);
          this.props.onClose()
        }
      })
    }
  }


  // componentDidMount() {
  //   const {ownerSuggesList} = this.state;
  //   ownerSuggesList.forEach(item => {
  //     item.checkStatus = false;
  //     item.check = <Checkbox checked={item.checkStatus}></Checkbox>
  //   });
  //   this.setState({ownerSuggesList})
  // }

  checkboxChange(checked) {
    this.setState({checkedStatus: checked})
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.normalizeRowData && nextProps.normalizeRowData.owner_ct_code || nextProps.normalizeRowData && nextProps.normalizeRowData.peer_ct_code) {
      this.setState({
        ownerSuggesCode: nextProps.normalizeRowData.owner_ct_code,
        peerSuggesCode: nextProps.normalizeRowData.peer_ct_code
      });
    }

    if (nextProps.suggestList && nextProps.suggestList.length !== 0 && nextProps.normalizeRowData) {
      let ownerList = [];
      let peerList = [];
      nextProps.suggestList.forEach(item => {
        if (item.ci === nextProps.normalizeRowData.owner_ci) {
          ownerList.push(item)
        } else if (item.ci === nextProps.normalizeRowData.peer_ci) {
          peerList.push(item)
        }
      });

      ownerList.forEach(item => {
        item.checkStatus = false;
        item.check = <Checkbox checked={item.checkStatus}></Checkbox>
      });
      peerList.forEach(item => {
        item.checkStatus = false;
        item.check = <Checkbox checked={item.checkStatus}></Checkbox>
      });


      this.setState({ownerSuggesList: ownerList, peerSuggesList: peerList});
    }
  }

  render() {
    const {normalizeRowData} = this.props;
    return (
      <Dialog
        visible={this.props.visible}
        onOk={this.props.onClose}
        closeable="esc,mask,close"
        onCancel={this.props.onClose}
        onClose={this.props.onClose}
        footer={false}
        title='数据补全'
      >
        <IceFormBinderWrapper ref="form">
          <div style={{padding: '20px'}}>
            <div className="normalizect" style={{width: '800px'}}>
              <div className='normalize_left' style={{position: 'relative'}}>
                <div style={{position: 'absolute', top: '0', right: '0'}}><Checkbox
                  onChange={this.checkboxChange}>应用到相同缺失基站编码</Checkbox></div>
                {!normalizeRowData.owner_lac && normalizeRowData.owner_ci ? (
                  <div className="owner">
                    <div style={{marginBottom: '10px'}}>
                      <span>本方号码&nbsp;:&nbsp;{this.props.normalizeRowData.owner_num}</span>
                      <span style={{'marginLeft': '30px'}}>基站&nbsp;:&nbsp;{this.state.ownerSuggesCode}</span>
                    </div>
                    <Table
                      dataSource={this.state.ownerSuggesList}
                      // rowSelection={this.state.rowSelection}
                      onRowClick={this.onRowClickOwner}
                      primaryKey="cal"
                      useVirtual
                      maxBodyHeight={200}
                    >
                      <Table.Column align="center" title="本方基站编码" dataIndex="ct_code"/>
                      <Table.Column align="center" title="地址" dataIndex="addr"/>
                      <Table.Column align="center" title="" dataIndex="check"/>
                    </Table>
                  </div>
                ) : ('')}


                {!normalizeRowData.peer_lac && normalizeRowData.peer_ci ? (
                  <div className="peer">
                    <div style={{marginBottom: '10px'}}>
                      <span>对方号码&nbsp;:&nbsp;{this.props.normalizeRowData.peer_num}</span>
                      <span style={{'marginLeft': '30px'}}>基站&nbsp;:&nbsp;{this.state.peerSuggesCode}</span>
                    </div>
                    <Table
                      dataSource={this.state.peerSuggesList}
                      onRowClick={this.onRowClickPeer}
                      primaryKey="cal"
                      useVirtual
                    >
                      <Table.Column align="center" title="对方基站编码" dataIndex="ct_code"/>
                      <Table.Column align="center" title="地址" dataIndex="addr"/>
                      <Table.Column align="center" title="" dataIndex="check"/>
                    </Table>
                  </div>
                ) : ('')}

              </div>
            </div>
            <div style={{textAlign: 'right', marginTop: '15px'}}>
              <Button
                type="primary"
                style={styles.submitButton}
                onClick={this.completeData}
              >
                数据补全
              </Button>
              <Button
                type="secondary"
                style={styles.submitButton2}
                onClick={this.props.onClose}
              >
                退 出
              </Button>
            </div>
          </div>
        </IceFormBinderWrapper>

      </Dialog>
    );
  }
}

const styles = {
  container: {
    marginBottom: 0,
  },
  formContent: {
    marginLeft: '30px',
  },
  formItem: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  formLabel: {
    width: '70px',
    marginRight: '15px',
    textAlign: 'right',
  },
  formError: {
    marginLeft: '10px',
    // width: '96px'
  },
  submitButton: {
    marginLeft: '85px',
  },
  submitButton2: {
    marginLeft: '15px',
  },
};

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...NormalizeCTActions}, dispatch),
  }),
)(normalizeCTForm);
