import React, {Component} from 'react';
import Container from '@icedesign/container';
import SearchBar from './components/SearchBar';
import LabelCellList from './components/LabelCellList';
import DocumentTitle from 'react-document-title'
import PageTitle from '../common/PageTitle/index';


export default class LabelCell extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: '基站标注'};
    this.state = {};
  }

  static displayName = 'LabelCell';


  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          {/*<div style={styles.nav}>*/}
            {/*<h2 style={styles.breadcrumb}>{this.meta.title}</h2>*/}
          {/*</div>*/}
          <PageTitle title={this.meta.title} tour={{page: "labelCell"}}/>
          <SearchBar/>
          <Container style={styles.container}>
            <LabelCellList/>
          </Container>
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
