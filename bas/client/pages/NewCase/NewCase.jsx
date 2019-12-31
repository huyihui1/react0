import React, { Component } from 'react';
import Container from '@icedesign/container';
import CaseSearch from './components/CaseSearch';
import CaseTable from './components/CaseTable';

export default class NewCase extends Component {
  render() {
    return (
      <div>
        <div style={styles.nav}>
          <h2 style={styles.breadcrumb}>案件录入</h2>
        </div>
        <CaseSearch/>
        <Container style={styles.container}>
          <CaseTable />
        </Container>
      </div>
    );
  }
}

const styles = {
  nav: {
    background: 'white',
    height: '72px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '10px 20px',
  },
  container: {
    padding: '10px 20px',
    margin: '20px',
  },
  breadcrumb: {
    borderLeft: '5px solid #447eff',
    paddingLeft: '16px',
    margin: '0 0 0 20px',
  },
  // container: {
  //   margin: '20px',
  // },
};
