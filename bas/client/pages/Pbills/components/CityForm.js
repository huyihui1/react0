import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Dialog, Table, Input, Button, Message, Upload, Select, Checkbox} from '@alifd/next';
import moment from 'moment';
import {actions as PbillsActions} from "../../../stores/Pbills";
import IceLabel from '@icedesign/label';


import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceContainer from "../../VENNumbers/components/VENNumberForm/VenNumberForm";
import solarLunar from "solarlunar";

const Option = Select.Option;

class CityForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: ['Lucy King',
        'Lily King',
        'Jim Green',],
      networkData: '',
      newsetData: []
    };
    this.tableColumnRender = this.tableColumnRender.bind(this);
    this.onChangeCity = this.onChangeCity.bind(this);
    this.onRowMouseEnter = this.onRowMouseEnter.bind(this)
  }

  onChangeCity(value) {
    this.state.newsetData.forEach(item => {
      if (item.owner_num === this.state.networkData.owner_num) {
        item.residence = value
      }
    })
  }


  tableColumnRender(value, index, record) {
    return (
      <Select.AutoComplete onChange={this.onChangeCity} defaultValue={value}/>
    );
  }

  ownerNumRender(value, index, record) {
    return (
      <div>
        <span>{value}</span>
        {record.Tagging ? (<IceLabel inverse={false} style={{
          fontSize: '12px',
          backgroundColor: record.Tagging.label_bg_color,
          color: record.Tagging.label_txt_color,
          marginLeft: '1px'
        }}>{record.Tagging.label}</IceLabel>) : ''}
      </div>
    )
  }

  validateAllFormField = () => {
    let arr = [];
    this.state.newsetData.forEach(item => {
      let obj = {
        id: item.id,
        residence: item.residence,
      };
      arr.push(obj)
    });

    const {actions, caseId} = this.props;
    actions.setCityPbills({caseId, values: arr}).then(res => {
      if (res.body.meta.success) {
        Message.success('设置成功');
        this.props.onClose();
        this.props.getPbillsList(this.props.current);
        this.props.rowSelection.selectedRowKeys = [];
      } else {
        Message.error(res.body.meta.message)
      }
    })
  };

  onRowMouseEnter(value) {
    this.setState({networkData: value})
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.setData) {
      this.setState({newsetData: JSON.parse(JSON.stringify(nextProps.setData))})
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
        title='设置常驻地'
      >
        {/*<IceContainer style={styles.container}>*/}
        <IceFormBinderWrapper
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formContent}>
            <Table dataSource={this.props.setData}
                   primaryKey="id"
                   onRowMouseEnter={this.onRowMouseEnter}
                   fixedHeader={true}
                   maxBodyHeight={250}
            >
              <Table.Column title="长号" alignHeader="center" align='center' dataIndex="owner_num"
                            cell={this.ownerNumRender}/>
              <Table.Column title="城市" alignHeader="center" align='center' dataIndex="residence"
                            cell={this.tableColumnRender}/>
            </Table>
            <div style={{textAlign: 'right', marginTop: '20px'}}>
              <Button
                type="primary"
                style={styles.submitButton}
                onClick={this.validateAllFormField}
              >
                提 交
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
        {/*</IceContainer>*/}
      </Dialog>
    );
  }
}

const styles = {
  container: {
    marginBottom: 0,
  },
  formContent: {
    padding: '20px',
    width: '800px'
  },
  formItem: {
    marginBottom: '25px',
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
    actions: bindActionCreators({...PbillsActions}, dispatch),
  }),
)(CityForm);
