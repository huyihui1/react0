import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import MapChart from './MapChart';
import './index.scss';

const { Row, Col } = Grid;

export default class WorkingIndex extends Component {
  static displayName = 'WorkingIndex';


  render() {
    return (
      <div className="workingIndex container" data-tut="reactour__working__index">
        <div className="card">
          <div>
            <Row wrap gutter={20}>
              <Col xxs="24" l="24" style={styles.item}>
                <h4 className="title">通话地区分布</h4>
                <MapChart />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    height: '480px',
    overflowY: 'scroll',
  },
  projectStatus: {
    marginTop: '30px',
    paddingTop: '10px',
    borderTop: '1px solid #f5f5f5',
  },
  meta: {
    margin: '10px 0 0',
    fontSize: '12px',
    color: '#666',
  },
  count: {
    margin: '0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#45a1ff',
  },
};
