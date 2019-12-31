import React, { Component } from 'react';
import { Dialog } from '@alifd/next';
import VenNumberForm from './VenNumberForm';

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
          title={`${this.props.isEdit ? '编辑' : '添加'}虚拟网号码`}
        >
          <VenNumberForm onClose={this.props.onClose} isEdit={this.props.isEdit} />
        </Dialog>
      </span>
    );
  }
}
