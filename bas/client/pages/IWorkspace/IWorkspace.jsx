import React, { Component } from 'react';
import SearchBar from './components/SearchBar';
import PanelTitle from './components/PanelTitle'
import CasesList from './components/CasesList';

export default class IWorkspace extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.panelTitleRef = this.panelTitleRef.bind(this);
    this.addCaseEvent = this.addCaseEvent.bind(this);
  }
  panelTitleRef(e) {
    this.panelTitleRef = e;
  }
  addCaseEvent(values) {
    this.panelTitleRef.showAddCase(values);
  }

  render() {
    return (
      <div className="dashboard-page">
        <PanelTitle panelTitleRef={this.panelTitleRef} />
        <SearchBar />
        <CasesList addCaseEvent={this.addCaseEvent} />
      </div>
    );
  }
}
