import React, { Component } from 'react';
import { Dialog } from '@alifd/next';
import LabelPNForm from './LabelPNForm';

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
          title={`${this.props.isEdit ? "编辑" : "添加"}号码标注`}
        >
          <LabelPNForm isEdit={this.props.isEdit} onClose={this.props.onClose} current={this.props.current} />
        </Dialog>
      </span>
    );
  }
}
