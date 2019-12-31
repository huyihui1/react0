import React, { Component } from 'react';
import SearchBar from './components/SearchBar/index';
import FindNewsList from './components/FindNewsList'
import DocumentTitle from 'react-document-title';



export default class NewNums extends Component {
  constructor(props) {
    super(props);
    this.meta = {title:'新号搜索'};
    this.state = {
      isShow: false,
      windowScroller: null,
    };
    this.onArrowClick = this.onArrowClick.bind(this);
    this.getConditionsData = this.getConditionsData.bind(this);
    this.getWindowScroller = this.getWindowScroller.bind(this);
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

  render() {
    return (
      <DocumentTitle title={this.meta.title}>
        <div>
          <div style={{ marginTop: '20px' }}>
            <SearchBar title={this.meta.title} isShow windowScroller={this.state.windowScroller} />
          </div>
          <FindNewsList />
        </div>
      </DocumentTitle>
    );
  }
}
