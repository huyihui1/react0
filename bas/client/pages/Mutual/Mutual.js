import React, {Component} from 'react';
import SearchBar from './components/SearchBar';
import MutualBody from './components/MutualBody';
import DocumentTitle from 'react-document-title';
import uuidv1 from "uuid/v1";


class Mutual extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: '一对一画像'};
    this.state = {};
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <SearchBar title={this.meta.title} isShow/>
          <MutualBody/>
        </div>
      </DocumentTitle>
    )
  }
}

export default Mutual
