import React, { Component } from 'react';
import { Dialog } from "@alifd/next";
import BinForm from "./BinForm"

export default class AddData extends Component {

  render() {
    return (
      <span>
        <Dialog
          visible={this.props.visible}
          onOk={this.props.onClose}
          closeable="esc,mask,close"
          onCancel={this.props.onClose}
          onClose={this.props.onClose}
          footer={false}
          title={`${this.props.isEdit ? "编辑" : "添加"}银行卡标识`}
        >
          <BinForm onClose={this.props.onClose} isEdit={this.props.isEdit}/>
        </Dialog>
      </span>
    );
  }
}
