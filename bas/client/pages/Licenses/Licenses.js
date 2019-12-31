import React, {Component} from 'react';
import PageTitle from '../common/PageTitle';
import LicensesList from './components/LicensesList'
import DocumentTitle from 'react-document-title';
import Container from "../LabelPN/LabelPN";


class Licenses extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "许可证管理"};
    this.state = {};
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title}/>
          <div style={styles.container}>
            <LicensesList/>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: '6px',
    padding: '20px',
    margin: '20px',
  },
};

export default Licenses;
