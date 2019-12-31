import React, { Component } from 'react';
import MatrixList from './components/MatrixList/MatrixList';
import SearchBar from './components/SearchBar';
import DocumentTitle from 'react-document-title';


export default class Matrix extends Component {
  static displayName = 'TableFilter';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.meta = {title:'矩阵关系'};
    this.state = {
      windowScroller: null,
      isShow: false,
      conditions: [],
      searchData: []
    };
    this.onArrowClick = this.onArrowClick.bind(this);
    this.getConditionsData = this.getConditionsData.bind(this);
    this.getWindowScroller = this.getWindowScroller.bind(this);
    this.getSearchData = this.getSearchData.bind(this);
  }
  getWindowScroller(windowScroller) {
    this.setState({
      windowScroller,
    })
  }
  onArrowClick() {
    this.setState({
      isShow: !this.state.isShow,
    }, () => {
      setTimeout(() => {
        this.state.windowScroller.updatePosition();
      }, 200);
    });
  }
  getConditionsData(conditions) {
    this.setState({
      conditions,
    });
  }
  getSearchData(val) {
    this.setState({
      searchData: val
    })
  }

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div className="pb-analyze">
          <div style={{marginTop: '20px'}}>
            <SearchBar title={this.meta.title} windowScroller={this.state.windowScroller} getSearchData={this.getSearchData} />
          </div>
          <MatrixList getWindowScroller={this.getWindowScroller} searchData={this.state.searchData} />
        </div>
      </DocumentTitle>
    );
  }
}
