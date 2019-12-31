import React, { Component } from 'react';
import InCommonsList from './components/InCommonsList/InCommonsList';
import SearchBar from './components/SearchBar';
import DocumentTitle from 'react-document-title';

export default class InCommon extends Component {
  static displayName = 'TableFilter';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.meta = {title:'号码碰撞'};
    this.state = {
      windowScroller: null,
      isShow: false,
      conditions: [],
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
        <div className="pb-analyze">
          <div style={{marginTop: '20px'}}>
            <SearchBar title={this.meta.title} windowScroller={this.state.windowScroller} />
          </div>
          <InCommonsList getWindowScroller={this.getWindowScroller} />
        </div>
      </DocumentTitle>
    );
  }
}
