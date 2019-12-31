import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Dialog, Table, Input, Button, Message, Upload, Select, Checkbox} from '@alifd/next';
import moment from 'moment';
import {actions as PbillsActions} from "../../../stores/Pbills";


import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceContainer from "../../VENNumbers/components/VENNumberForm/VenNumberForm";
import solarLunar from "solarlunar";
import IceLabel from '@icedesign/label';


const Option = Select.Option;

class FamilyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: ['Lucy King',
        'Lily King',
        'Jim Green',],
      networkData: '',
      newsetData:[]
    };
    this.tableColumnRenderShort = this.tableColumnRenderShort.bind(this);
    this.tableColumnRenderNetwork = this.tableColumnRenderNetwork.bind(this);
    this.onChangeShort = this.onChangeShort.bind(this);
    this.onChangeNetwork = this.onChangeNetwork.bind(this);
    this.onRowMouseEnter = this.onRowMouseEnter.bind(this)
  }

  onChangeShort(value) {
    this.state.newsetData.forEach(item => {
      if (item.owner_num === this.state.networkData.owner_num) {
        item.rel_short_num = value
      }
    })
  }


  onChangeNetwork(value) {
    this.state.newsetData.forEach(item => {
      if (item.owner_num === this.state.networkData.owner_num) {
        item.rel_network = value
      }
    })
  }


  tableColumnRenderShort(value, index, record) {
    return (
      <Select.AutoComplete onChange={this.onChangeShort} defaultValue={value}/>
    );
  }

  tableColumnRenderNetwork(value, index, record) {
    return (
      <Select.AutoComplete dataSource={this.props.relNumBers} onChange={this.onChangeNetwork} defaultValue={value}/>
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
        num: item.owner_num,
        short_num: item.rel_short_num,
        network: item.rel_network
      };
      arr.push(obj)
    });

    const {actions, caseId} = this.props;


    actions.setFanilyPbills({caseId, values: arr}).then(res => {
      if (res.body.meta.success) {
        Message.success('设置成功');
        this.props.onClose();
        this.props.getPbillsList(this.props.current);
        this.props.rowSelection.selectedRowKeys = [];
      }else {
        Message.error(res.body.meta.message)
      }
    })


  };

  onRowMouseEnter(value) {
    this.setState({networkData: value})
  }


  componentDidMount() {
    this.props.actions.getRelNumBersPbills({caseId: this.props.caseId})
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
        title='设置亲情网'
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
              <Table.Column title="短号" alignHeader="center" align='center' dataIndex="rel_short_num"
                            cell={this.tableColumnRenderShort}/>
              <Table.Column title="亲情网名称" alignHeader="center" align='center' dataIndex='rel_network'
                            cell={this.tableColumnRenderNetwork}/>
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
    relNumBers: state.pbills.relNumBers
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...PbillsActions}, dispatch),
  }),
)(FamilyForm);
