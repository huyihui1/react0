import React, { Component } from 'react';
import { Grid, Icon, Dialog,Button,Message } from '@alifd/next';
import {withRouter } from 'react-router';
const { Row, Col } = Grid;

import { connect } from 'react-redux';
import { compose } from 'redux';

import { caseReducer } from '../../../../stores/case/reducer';
import injectReducer from '../../../../utils/injectReducer';
import { changeCase } from '../../../../stores/case/actions'

const getData = () => {
  return Array.from({ length: 10 }).map((item, index) => {
    return {
      title: `案件 0${index + 1}`,
      id: `case${index + 1}`,
      body: [
        {
          label: '案件名称',
          value: `案件 ${index + 1}`,
        },
        {
          label: '案件编号',
          value: `123,23${index}`,
        },
        {
          label: '案件状态',
          value: '已结案',
        },
        {
          label: '更新时间',
          value: '2018-09-20',
        },
        {
          label: '发布人',
          value: '张小三',
        },
        {
          label: '相关备注',
          value: '无',
        },
      ],
    };
  });
};
@withRouter
class ModelCard extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }


  handleInvoke = (caseData) => {

    this.props.changeCase({
      id:caseData.id,
      name:caseData.name
    })
    this.props.history.push(`/cases/${caseData.id}/pb_filesimport`)
    // Dialog.confirm({
    //   content: '请先申请权限在查看调用示例',
    // });
  };

  handleOnline = () => {
    Dialog.confirm({
      content: '只有超级权限才能设置在线预测',
    });
  };

  handleClick = (text) => {
    if(text === "添加"){
      this.showAddModal()
    }else{
      Message.toast.success(`暂不支持${text}`);
    }
  };

  render() {
    const mockData = getData();
    const buttons = [
      '新增案件',
      '编辑',
      '删除',
    ];
    return (
      <div>

        <Row wrap gutter="40" style={styles.row}>

          {mockData.map((data, index) => {
            return (
              <Col l="6" key={index}>
                <div style={styles.modelCard}>
                  <div style={styles.head}>
                    <Icon type="electronics" style={styles.icon} /> {data.title}
                  </div>
                  <div style={styles.body}>
                    {data.body.map((item, key) => {
                      return (
                        <div style={styles.item} key={key}>
                          <span style={styles.label}>{item.label}：</span>
                          <span style={styles.value}>{item.value}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={styles.footer}>
                    <a
                      onClick={this.handleInvoke.bind(this,{id:data.id,name:data.title})}
                      style={{ ...styles.button, background: '#58ca9a' }}
                    >
                      进入案件
                    </a>
                    <a
                      onClick={this.handleOnline}
                      style={{ ...styles.button, background: '#ee706d' }}
                    >
                      案件设置
                    </a>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

    );
  }
}

const styles = {
  row: {
    padding: '20px',
  },
  modelCard: {
    background: '#fff',
    border: '1px solid #f5f5f5',
    marginBottom: '40px',
    borderRadius: '4px',
  },
  head: {
    padding: '10px 0',
    background: '#5e83fb',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '4px 4px 0 0',
  },
  item: {
    padding: '10px 0',
    display: 'flex',
  },
  label: {
    width: '50%',
    padding: '0 20px',
    fontWeight: '500',
    textAlign: 'right',
    fontSize: '13px',
  },
  value: {
    width: '50%',
    fontSize: '13px',
  },
  body: {
    padding: '20px',
  },
  icon: {
    marginRight: '10px',
  },
  footer: {
    borderTop: '1px solid #eee',
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    marginRight: '10px',
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '3px',
    color: '#fff',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  buttons: {
    margin: "10px 20px",
    letterSpacing: "2px",
  },
  button2:{
    color:"#333",
    height: "32px",
    padding: "0 20px",
    fontSize: "14px",
    lineHeight: "30px",
    borderWidth: "1px",
  }
};

const mapStateToProps = (state) => {
  return { case: state.cases };
};

const mapDispatchToProps ={
  changeCase,
}
const withReducer = injectReducer({ key: 'cases', reducer: caseReducer });
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
export default compose(
  withReducer,
  withConnect
)(ModelCard)
