import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faChartBar, faDownload, faFileExcel } from '@fortawesome/free-solid-svg-icons';

class ChartTitle extends Component {
  render() {
    return (
      <div className="chart-title noDraggable">
        <h3 style={{textAlign: this.props.align || 'left', paddingLeft: '20px'}}>
          {this.props.title}
        </h3>
        {/*<div className="toolbox">*/}
          {/*<span title="图表视图"*/}
            {/*onClick={() => {*/}
                    {/*this.props.handleChart(true);*/}
                  {/*}}*/}
          {/*>*/}
            {/*<FontAwesomeIcon icon={faChartBar} />*/}
          {/*</span>*/}
          {/*<span title="数据视图"*/}
            {/*onClick={() => {*/}
                  {/*this.props.handleChart(false);*/}
                {/*}}*/}
          {/*>*/}
            {/*<FontAwesomeIcon icon={faTable} />*/}
          {/*</span>*/}
          {/*<span title="保存为图片" onClick={this.props.getImgURL}>*/}
            {/*<FontAwesomeIcon icon={faDownload} />*/}
          {/*</span>*/}
          {/*<span title="导出数据" onClick={this.props.getExcel}>*/}
            {/*<FontAwesomeIcon icon={faFileExcel} />*/}
          {/*</span>*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default ChartTitle;
