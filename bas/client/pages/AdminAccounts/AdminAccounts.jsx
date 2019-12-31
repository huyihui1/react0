import React, {Component} from 'react';
import PageTitle from '../common/PageTitle';
import UesrAdminList from './components/AdminAccountList';
import EasySearch from './components/EasySearch';
import DocumentTitle from 'react-document-title';


class AdminAccounts extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "用户管理"};
    this.state = {};
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title}/>
          <EasySearch/>
          <div style={styles.container}>
            <UesrAdminList/>
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



export default AdminAccounts;
