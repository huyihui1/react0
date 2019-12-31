import React, {Component} from 'react';
import Container from '@icedesign/container';
import CaseImport from './components/CaseImport';
import FilesTable from './components/FilesTable';
import PageTitle from '../common/PageTitle';
import CaseList from './components/CaseList';
import DocumentTitle from 'react-document-title';


export default class FilesImport extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "他案导入"};
    this.state = {

    };
  }
  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <PageTitle title={this.meta.title} tour={{page: "casesImport"}}/>
          <CaseList/>
          {/*<Container style={styles.container}>*/}
          {/*{"导入结果"}*/}
          {/*<FilesTable/>*/}
          {/*</Container>*/}
        </div>
      </DocumentTitle>
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
  },
  breadcrumb: {
    borderLeft: '5px solid #447eff',
    paddingLeft: '16px',
    margin: '0 0 0 20px',
  },
  container: {
    margin: '20px',
  },
};
