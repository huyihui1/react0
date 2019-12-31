/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import styles from './index.module.scss';



import PageTitle from '../common/PageTitle';
import Container from '@icedesign/container';
import Backups from "./components/Backups";
import MissedCtRequests from "./components/MissedCtRequests";
import DocumentTitle from 'react-document-title';


export default class SystemData extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "数据管理"};
    this.state = {

    };
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div className="settings-form">
          <PageTitle title={this.meta.title} isHide />
          <Container className={styles.container}>
            <Backups/>
            <MissedCtRequests/>
          </Container>
        </div>
      </DocumentTitle>
    );
  }
}
