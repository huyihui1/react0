import React, { Component } from 'react';
import { Dialog } from "@alifd/next";
import CaseAdd from "./CaseAdd"

export default class AddData extends Component {

  render() {
    return (
      <span>
        <Dialog
          visible={this.props.visible}
          onOk={this.props.onClose}
          closable="esc,mask,close"
          onCancel={this.props.onClose}
          onClose={this.props.onClose}
          footer={false}
          title="新案件录入"
        >
          <CaseAdd onClose={this.props.onClose}/>
        </Dialog>
      </span>
    );
  }
}
