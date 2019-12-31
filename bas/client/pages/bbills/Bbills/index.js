import React, {Component} from 'react';
import PageTitle from '../common/PageTitle';
import DocumentTitle from 'react-document-title';
import BbillsList from './Bbills'


class Bbills extends Component {
  constructor(props) {
    super(props);
    this.meta = {title: "账单列表"};
    this.state = {

    };
  }
  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div style={{height: '100%'}}>
          <PageTitle title={this.meta.title} tour={{page: "bbills" }} />
          <BbillsList/>
        </div>
      </DocumentTitle>
    );
  }
}
//tour={{page: "bbills"}}
export default Bbills;
