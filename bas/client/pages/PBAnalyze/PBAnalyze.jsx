import React, { Component } from 'react';
import {Button} from '@alifd/next';
import { connect } from 'react-redux';
import PbAnalyzeList from './components/InfiniteScrollGrid/PBAnalyzeList';
import SearchBar from '../common/SearchBox';
import BtnList from '../common/BtnList';
import './PBAnalyze.scss';
import ajaxs from '../../utils/ajax';
import DocumentTitle from 'react-document-title';


class PbAnalyze extends Component {
  // static displayName = 'TableFilter';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.meta = {title:'话单浏览'};
    this.state = {
      windowScroller: null,
      isShow: false,
      conditions: [],
      labelGroup: []
    };
    this.onArrowClick = this.onArrowClick.bind(this);
    this.getConditionsData = this.getConditionsData.bind(this);
    this.getWindowScroller = this.getWindowScroller.bind(this);
    this.fetchLabelGroup = this.fetchLabelGroup.bind(this);
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

  componentDidMount() {
    this.fetchLabelGroup();
  }

  fetchLabelGroup(caseId = this.props.caseId) {
    ajaxs.get(`/cases/${caseId}/pnum_labels/label-group`).then(res => {
      this.setState({
        labelGroup: res.data
      })
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    const btnList = (id) => {
      return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <BtnList />
          {/*<Button style={{ marginRight: '15px' }} component="a" href={`/#/cases/${id}/pb_filesimport`}>文件导入</Button>*/}
        </div>
      )
    }
    const button = <Button style={{ marginRight: '15px' }} component="a" href={`/#/cases/${this.props.caseId}/pb_filesimport`}>文件导入</Button>;


    return (
      <DocumentTitle title={this.meta.title}>
        <div className="pb-analyze">
          <div style={{marginTop: '20px'}}>
            <SearchBar isHide={true} title={this.meta.title} isShow={true} buttons={btnList} button={button} tour={{page: "pbAnalyze"}} labelGroup={this.state.labelGroup} windowScroller={this.state.windowScroller} />
          </div>
          <div data-tut="reactour__pbAnalyzeList">
            <PbAnalyzeList getWindowScroller={this.getWindowScroller} labelGroup={this.state.labelGroup} updateLabelGroup={this.fetchLabelGroup} />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    // actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(PbAnalyze);
