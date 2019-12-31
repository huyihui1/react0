import React, { Component } from 'react';
import { Dialog } from "@alifd/next";
import RelNumbersForm from "./RelNumbersForm"

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
          title={`${this.props.isEdit ? "编辑" : "添加"}亲情网`}
        >
          <RelNumbersForm onClose={this.props.onClose} isEdit={this.props.isEdit}/>
        </Dialog>
      </span>
    );
  }
}
