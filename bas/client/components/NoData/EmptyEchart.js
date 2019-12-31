import React, { Component } from 'react';
import appConfig from '../../appConfig'

class EmptyEchart extends Component {
  render() {
    return (
      <div style={{position: 'relative', height: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', fontSize: '14px', backgroundColor: '#fff', border: '1px solid #ccc'}}>
        <h3 style={{position: 'absolute', top: '10px', color: '#333', marginTop: '10px', fontSize: '18px', fontWeight: '600'}}>{this.props.title}</h3>
        {appConfig.NO_DATA_TEXT}
      </div>
    )
  }
}

export default EmptyEchart
