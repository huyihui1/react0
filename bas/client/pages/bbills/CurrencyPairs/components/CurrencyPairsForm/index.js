import React, { Component } from 'react';
import { Dialog } from "@alifd/next";
import CurrencyPairsForm from "./CurrencyPairsForm.js"//修改过

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
          title={`${this.props.isEdit ? "编辑" : "添加"}外币汇率`}
        >
          <CurrencyPairsForm onClose={this.props.onClose} isEdit={this.props.isEdit}/>
        </Dialog>
      </span>
    );
  }
}
