import React, {Component} from 'react';
import {Balloon, Button, Input, Table, Radio, Select, Loading, Message, Dialog} from '@alifd/next';
import {Link} from 'react-router-dom';
import moment from 'moment'

const RadioGroup = Radio.Group;
import {FormBinder, FormBinderWrapper, FormError as IceFormError} from "@icedesign/form-binder";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actions as bbillsActions} from '../../../bbStores/bbills';
import ajaxs from '../../../utils/ajax'


class ExpandedApp extends Component{
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      owner_name: '',
      apply_on: ''
    }
    this.flag = true
  }

  onSetClick = (record, index) => {
    this.setState({
      owner_name: this.props.record.owner_name
    }, () => {
      this.popupSetOwnerName(record, index)
    })
  }

  setRender = (value, index, record) => {
    return (
      <Button onClick={() => this.onSetClick(record, index)}>设置户名</Button>
    )
  }

  popupSetOwnerName = (record, rowIndex) => {
    const {actions, caseId} = this.props;
    let type = '';
    let apply_on = record.bank_acct ? 'bank_acct' : 'card_num';
    switch (record.card_type) {
      case 1 :
        type = '借记卡';
      case 2 :
        type = '贷记卡(信用卡)';
      case 3 :
        type = '准贷记卡';
      case 4 :
        type = '预付费卡'
    }
    const onSelectChange = (value) => {
      apply_on = value
    }

    const dialog = Dialog.show({
      title: '设置账号户名',
      content: (
        <div>
          <FormBinderWrapper
            value={this.state}
          >
            <label>
              <div style={styles.formItem}>
                <div style={styles.formLabel}>户名</div>
                <FormBinder name="owner_name">
                  <Input
                    placeholder={'请输入户名'}
                    style={{...styles.input}}
                    autoFocus
                    onFocus={(e) => {
                      console.log(e.target);
                      e.target.select()
                    }}
                  />
                </FormBinder>
              </div>
            </label>
          </FormBinderWrapper>
          <label>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>银行卡号</div>
              <Input
                value={record.card_num}
                addonTextAfter={type}
                placeholder={'请输入银行卡号'}
                style={{...styles.input}}
                trim
                readOnly
              />
            </div>
          </label>
          <label>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>银行账号</div>
              <Input
                value={record.bank_acct}
                placeholder={'请输入银行账号'}
                style={{...styles.input}}
                trim
                readOnly
              />
            </div>
          </label>
          <label>
            <div style={styles.formItem}>
              <div style={styles.formLabel}>银行名称</div>
              <Input
                value={record.bank_name}
                placeholder={'请输入银行名称'}
                style={{...styles.input}}
                trim
                readOnly
              />
            </div>
          </label>
          <div style={styles.formItem}>
            <div style={styles.formLabel}>应用到相同</div>
            <RadioGroup defaultValue={apply_on} onChange={onSelectChange}>
              <Radio value="bank_acct"disabled={!record.bank_acct}>银行账号</Radio>
              <Radio value="card_num" disabled={!record.card_num}>银行卡号</Radio>
            </RadioGroup>
          </div>
        </div>
      ),
      footer: (
        <div style={{textAlign: 'right'}}>
          <Button type="primary" onClick={() => {
            const {owner_name} = this.state;
            if (!owner_name) {
              Message.warning('户名不能为空')
              return
            }
            Message.loading({
              title: '修改中...',
              duration: 0,
            });
            actions.updateListBbills({owner_name, apply_on, owner_card_num: record.card_num, owner_bank_acct: record.bank_acct, bank_name: record.bank_name, card_type: record.card_type,  case_id: caseId, id: this.props.record.id })
              .then(res => {
                if (res.body && res.body.meta.success) {
                  Message.success('修改成功...');
                  // const {dataSource} = this.state
                  // dataSource.splice(rowIndex, 1);
                  this.props.isRequest()
                  // this.fetchData()
                  // this.props.actions.fetchBbills({caseId: this.props.caseId});
                }
              })
              .catch(err => {
                Message.error('修改失败...');
                console.log(err);
              });
            dialog.hide()
          }}>
            确认
          </Button>
          <Button type="secondary" onClick={() => dialog.hide()} style={{marginLeft: '15px'}}>
            取消
          </Button>
        </div>
      )
    });
  };

  cardNumRender = (value, index, record) => {
    let type = '';
    switch (record.card_type) {
      case 1 :
        type = '借记卡';
      case 2 :
        type = '贷记卡(信用卡)';
      case 3 :
        type = '准贷记卡';
      case 4 :
        type = '预付费卡'
    }

    if (value) {
      return (
        <div style={{display: 'flex'}}>
          <span style={{flex: '0 0 30%', textAlign: 'left'}}>{type ? type : ''}</span>
          <span style={{flex: 1}}>{value}</span>
        </div>
      )
    }
  };

  componentDidMount() {
    this.fetchData()
  }


  componentDidUpdate(prevProps, prevState) {
    if (this.props.openRowKeys.indexOf(this.props.record.id) !== -1 && this.props.isReqChildren) {
      console.log(this.props.record);
      ajaxs.post(`/cases/${this.props.caseId}/bbills/accts-and-cards`, {
        case_id: this.props.caseId,
        name: this.props.record.owner_name
      }).then(res => {
        if (res.data && (res.data.bank_cards || res.data.bank_accts)) {
          const dataSource = res.data.bank_cards.concat(res.data.bank_accts);
          this.setState({dataSource})
        }
      })
      this.props.isRequest(false)
    }
  }

  fetchData = () => {
    this.props.actions.getAcctsAndCardsBbills({
      case_id: this.props.caseId,
      name: this.props.record.owner_name
    }).then(res => {
      if (res.body.data && (res.body.data.bank_cards || res.body.data.bank_accts)) {
        let dataSource = res.body.data.bank_cards.concat(res.body.data.bank_accts);
        this.setState({dataSource})
      }
    })
  }


  render() {
    const {dataSource} = this.state;
    return (
      <Table dataSource={dataSource}
             primaryKey="id"
             // loading={this.props.bbills.isLoading}
             hasBorder={true}
      >
        <Table.Column title="银行卡号" alignHeader="center" align='center' dataIndex='card_num' cell={this.cardNumRender}/>
        <Table.Column title="银行账号" alignHeader="center" align='center' dataIndex='bank_acct'/>
        <Table.Column title="银行名称" alignHeader="center" align='center' dataIndex='bank_name'/>
        <Table.Column cell={this.setRender} width={130}/>
      </Table>
    )
  }
}



class Bbills extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      rowSelection: {
        onChange: this.onTableChange.bind(this),
        // onSelect(selected, record, records) {
        //   that.props.actions.setBbills(record);
        //   console.log('onSelect', selected, record, records);
        // },
        selectedRowKeys: [],
        // mode: 'single'
      },
      values: {},
      buttons: ['删除账单'],
      tips: '',
      owner_name: '',
      itemId: null,
      openRowKeys: [],
      isReqChildren: false
    };
    this.openRowKeys = []
    this.onTableChange = this.onTableChange.bind(this);
    this.popupAlert = this.popupAlert.bind(this);
  }

  onTableChange(ids, record) {
    console.log(ids);
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = ids;

    let argsArray = [];
    record.forEach(item => {
      argsArray.push(item.owner_name)
    });
  }


  popupAlert() {
    const dialog = Dialog.show({
      title: '警告',
      content: '是否确认删除?',
      footer: (
        <div style={{width: '300px'}}>
          <Button type="primary" onClick={() => {
            // Message.loading({
            //   title: '删除中...',
            //   duration: 0,
            // });
            // this.props.actions.removePbills({
            //   caseId: this.props.caseId,
            //   owner_name: this.state.deletePbillsList
            // }).then(res => {
            //   if (res.status === 'resolved') {
            //     Message.success('删除成功');
            //     this.state.rowSelection.selectedRowKeys = [];
            //     this.getPbillsList(this.state.current)
            //   }
            // }).catch(err => {
            //   // console.log(err);
            //   Message.error('删除失败');
            // });
            dialog.hide()
          }}>
            确认
          </Button>
          <Button type="secondary" onClick={() => dialog.hide()} style={{marginLeft: '15px'}}>
            取消
          </Button>
        </div>
      )
    });
  };

  onSearchNameChange = (name) => {
    this.setState({
      owner_name: name,
    });
  }




  //查询
  validateFields = () => {
    const {validateAll} = this.refs.form;
    const {actions, title} = this.props;
    validateAll((errors, values) => {
      let val = {...values};
      for (let key in val) {
        if (!val[key] || !val[key].length) {
          delete val[key]
        }
      }
      if (JSON.stringify(val) !== "{}") {
        this.props.actions.searchBbills({case_id: this.props.caseId, ...val})
      } else {
        this.props.actions.searchBbills({case_id: this.props.caseId, q: ''})
      }

    });
  };

  componentDidMount() {
    this.props.actions.fetchBbills({caseId: this.props.caseId});
  }


  componentWillReceiveProps(nextProps) {
  }

  checkQuery = () => {

  };
  checkLabelGroups = () => {

  };
  onRowClick = (record) => {
    const {rowSelection} = this.state;
    rowSelection.selectedRowKeys = [record.id];
    this.setState({
      rowSelection,
      itemId: record.id,
      owner_name: record.owner_name
    });
    this.props.actions.setBbills(record);
  };


  isRequest = (bool = true) => {
    this.setState({
      isReqChildren: bool
    })
  }

  expandedRowRender = (record, index) => {
    return <ExpandedApp record={record} openRowKeys={this.state.openRowKeys} isRequest={this.isRequest} isReqChildren={this.state.isReqChildren} actions={this.props.actions} bbills={this.props.bbills} caseId={this.props.caseId}/>
  };
  onRowOpen = (openRowKeys, currentRowKey, expanded, currentRecord) => {
    console.log(openRowKeys, currentRecord);
    if (expanded) {
      // this.props.actions.getAcctsAndCardsBbills({
      //   case_id: this.props.caseId,
      //   name: currentRecord.owner_name
      // }).then(res => {
      //   if (res.body.data && (res.body.data.bank_cards || res.body.data.bank_accts)) {
      //     currentRecord.arr = res.body.data.bank_cards.concat(res.body.data.bank_accts);
      //     this.setState({})
      //   }
      // })
      // this.setState({
      //   itemId: currentRecord.id,
      //   owner_name: currentRecord.owner_name
      // })
    }
    this.setState({
      openRowKeys
    })
    this.openRowKeys = openRowKeys
  };
  handleClick = (text) => {
    if (text === '设置账号户名') {
      if (this.state.rowSelection.selectedRowKeys.length > 0) {
        this.popupSetOwnerName()
      } else {
        Message.warning('请选择一条数据')
      }
    }
  }

  renderTime = (value) => {
    return moment(value).format('YYYY-MM-DD')
  }

  render() {
    return (
      <div>
        <div className="pbills_header">
          <FormBinderWrapper
            ref="form"
            value={this.state.values}
          >
            <label style={styles.caseNumber}>
              <FormBinder name="q">
                <Input
                  placeholder={'请输入姓名/卡号'}
                  style={{...styles.input}}
                  trim
                />
              </FormBinder>
            </label>

            {/*<label style={styles.caseNumber}>*/}
            {/*分类标签:*/}
            {/*<FormBinder name="label_groups" validator={this.checkLabelGroups}>*/}
            {/*<Select mode="tag" showSearch style={{width: '300px', marginLeft: '5px'}}>*/}
            {/*/!*{*!/*/}
            {/*/!*this.state.labelGroupList.map(item => {*!/*/}
            {/*/!*return (*!/*/}
            {/*/!*<Option key={item.name + item.id} value={item.name}>{item.name}</Option>*!/*/}
            {/*/!*);*!/*/}
            {/*/!*})*!/*/}
            {/*/!*}*!/*/}
            {/*<Input/>*/}
            {/*</Select>*/}
            {/*</FormBinder>*/}
            {/*/!*<IceFormError name="label_groups" style={{...styles.formError, left: '840px', display: 'none'}}/>*!/*/}
            {/*</label>*/}
          </FormBinderWrapper>
          <span>
          <Button
            type="primary"
            style={{...styles.button, marginLeft: '10px'}}
            onClick={this.validateFields}
          >
            查询
          </Button>
            {/*<div style={{*/}
            {/*position: 'absolute',*/}
            {/*left: '660px',*/}
            {/*top: '8px',*/}
            {/*color: '#f76048',*/}
            {/*width: '250px'*/}
            {/*}}>{this.state.tips}</div>*/}
        </span>
        </div>
        <div className='pbills_body' ref='pbillsBody'
             style={{minHeight: `${document.documentElement.offsetHeight - 300}px`}}>
          <div style={{margin: '0 20px'}}>
            <div style={styles.buttons}>
              {this.state.buttons.map((text, index) => {
                return (
                  <Button
                    key={index}
                    className={text === '删除账单' ? 'deleteBtn' : ''}
                    style={styles.button}
                    onClick={() => this.handleClick(text)}
                  >
                    {text}
                  </Button>
                );
              })}
            </div>
            <Loading visible={this.props.bbills.isLoading} style={{width: '100%'}} tip="加载中...">
              <div ref='table'>
                <Table dataSource={this.props.bbills.items}
                       onRowClick={this.onRowClick}
                       primaryKey="id"
                       onBodyScroll={this.onBodyScroll}
                       stickyHeader={true}
                       expandedRowRender={this.expandedRowRender}
                       onRowOpen={this.onRowOpen}
                       style={{textAlign: 'center'}}
                       openRowKeys={this.state.openRowKeys}
                >
                  <Table.Column title="户名" alignHeader="center" align='center' dataIndex='owner_name' width={100} lock/>
                  <Table.Column title="卡号数量" alignHeader="center" align='center' dataIndex='owner_card_count' width={70}/>
                  <Table.Column title="账号数量" alignHeader="center" align='center' dataIndex='owner_acct_count' width={70}/>
                  <Table.Column title="对方账号数量" alignHeader="center" align='center' dataIndex='peer_acct_count' width={70}/>
                  <Table.Column title="账目数量" alignHeader="center" align='center' dataIndex='total_trx' width={70} />
                  <Table.Column title="开始日期" alignHeader="center" align='center' dataIndex='started_at' width={105} cell={this.renderTime}/>
                  <Table.Column title="结束日期" alignHeader="center" align='center' dataIndex='ended_at' width={105} cell={this.renderTime}/>
                  <Table.Column title="创建时间" alignHeader="center" align='center' dataIndex='created_at' width={105} cell={this.renderTime}/>
                  <Table.Column title="更新时间" alignHeader="center" align='center' dataIndex='updated_at' width={105} cell={this.renderTime}/>
                </Table>


              </div>
            </Loading>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: '20px',
    letterSpacing: '2px',
  },
  input: {
    width: '400px'
  },
  select: {
    verticalAlign: 'middle',
    width: '200px',
  },
  shortInput: {
    width: '110px',
  },
  caseNumber: {
    position: 'relative'
  },
  date: {
    marginRight: '24px',
  },
  button: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
  button2: {
    margin: '0 8px',
    letterSpacing: '2px',
  },
  table: {
    // margin: '20px 0',
    minHeight: '438px',
  },
  buttons: {
    marginBottom: '20px'
  },
  pagination: {
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '35px',
  },
  columnRenderStyle: {
    width: '100%',
    height: '17px',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center'
  },
  formItem: {
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  formLabel: {
    width: '70px',
    marginRight: '15px',
    textAlign: 'right',
  },
  formError: {
    position: 'absolute',
    top: '2px',
    color: '#f76048',
    width: '200px'
  },
};


export default connect(
  state => ({
    caseId: state.cases.case.id,
    bbills: state.bbills
  }),
  dispatch => ({
    actions: bindActionCreators({...bbillsActions}, dispatch),
  }),
)(Bbills);
