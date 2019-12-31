import React from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/languages/zh-CN';
import 'handsontable/dist/handsontable.full.css';

import appConfig from '../../appConfig'

class ExcelView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotSettings: {
        stretchH: 'all',
        colHeaders: this.props.colHeaders || false,
        rowHeaders: true,
        contextMenu: false,
        editor: false,
        licenseKey: 'non-commercial-and-evaluation',
        height: '100%',
        // colWidths: 120,
        manualColumnResize: true,
        manualRowResize: true,
        className:'htCenter htMiddle',
        readOnly: true,
        startRows: appConfig.NO_DATA_ROW_LIMIT,
        startCols: this.props.colHeaders.length,
        renderer: (instance, td, row, col, prop, value, cellProperties) => {
          if (row === 0 && col === 0) {
            td.innerHTML = `<div>${appConfig.NO_DATA_TEXT}</div>`
          }
          td.style.textAlign = 'center';
          return td
        },
        mergeCells: [
          {row: 0, col: 0, rowspan: 1, colspan: this.props.colHeaders.length}
        ]
      },
    };
  }
  componentDidMount() {
    console.log(this.props.hotSetting);
    if (this.props.hotSetting) {
      this.setState({
        hotSettings: {
          ...this.state.hotSettings,
          ...this.props.hotSetting
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hotSetting && JSON.stringify(nextProps.hotSetting) !== JSON.stringify(this.state.hotSettings)) {
      this.setState({
        hotSettings: {
          ...this.state.hotSettings,
          ...nextProps.hotSetting,
        }
      });
    }
  }

  render() {
    return (
      <div style={{ padding: '15px 20px', height: '50%', ...this.props.styles }}>
        <HotTable id={this.props.id} settings={this.state.hotSettings} language="zh-CN" />
      </div>
    );
  }
}

export default ExcelView;
