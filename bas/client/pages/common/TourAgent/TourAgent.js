import React, { Component } from 'react';
import Tour from 'reactour';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import pageTour from '../../../appTour';

export default class TourAgent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTourOpen: false,
    };
    this.closeTour = this.closeTour.bind(this);
    this.openTours = this.openTours.bind(this);
  }
  openTours() {
    this.setState({ isTourOpen: true });
  }
  closeTour() {
    this.setState({ isTourOpen: false });
  }

  disableBody() {
    document.body.style.overflowY = 'hidden';
  }

  enableBody() {
    document.body.style.overflowY = 'auto';
  }

  render() {
    const { page } = this.props;
    return (
      <div style={{ display: 'inline-block', marginLeft: '5px' }}>
        <span style={{ cursor: 'pointer'}} onClick={this.openTours} title={'帮助教程'}>
          <FontAwesomeIcon icon={faQuestionCircle} className = "tourIcon" />
        </span>
        <Tour
          startAt={0}
          steps={pageTour[page]}
          isOpen={this.state.isTourOpen}
          onRequestClose={this.closeTour}
          onAfterOpen={this.disableBody}
          onBeforeClose={this.enableBody}
        />
      </div>
    );
  }
}
