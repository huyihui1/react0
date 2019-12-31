import React, { Component } from 'react';
import { Balloon, Icon } from '@alifd/next';

const Tooltip = Balloon.Tooltip;
const errorIcon = <Icon type="error" size="small" style={{ color: '#FF3333', marginLeft: '10px' }} />;

export class ErrorRender extends Component {
  static displayName = 'ErrorRender';

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Tooltip trigger={errorIcon} align="r" popupStyle={{ color: '#FF3333' }}>{this.props.message}</Tooltip>
    );
  }
}

export default ErrorRender;
