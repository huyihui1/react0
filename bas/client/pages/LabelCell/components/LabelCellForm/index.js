import React, { Component } from 'react';
import { Dialog, Button } from "@alifd/next";
import LabelCellForm from "./LabelCellForm"

export default class LabelCellFormDialog extends Component {
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
          title={`${this.props.isEdit ? "编辑" : "添加"}基站标注`}
        >
          <LabelCellForm onClose={this.props.onClose} isEdit={this.props.isEdit} current={this.props.current}/>
        </Dialog>
      </span>
    );
  }
}
