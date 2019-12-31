import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageTitle from '../common/PageTitle';
import NormalizeCTList from './components/NormalizeCTList'
import DocumentTitle from 'react-document-title';



class NormalizeCT extends Component {

  constructor(props) {
    super(props);
    this.meta = {title:'基站补正'};
    this.state = {};
  }

  render() {

    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <div style={{marginTop: '20px'}}>
            <PageTitle title={this.meta.title} tour={{page: "normalizeCT"}}/>
          </div>
          <NormalizeCTList />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(
  state => ({
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({

  }),
)(NormalizeCT);
