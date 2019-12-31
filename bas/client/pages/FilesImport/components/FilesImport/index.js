import React, { Component } from 'react';
import { Upload, Icon, Field, Form, Button} from '@alifd/next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {faUpload} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ajax from '../../../../utils/ajax';
import { actions as pbFilesImportActions } from '../../../../stores/pbFilesImport';

import './style.css';

const FormItem = Form.Item;


class FilesImportComponent extends Component {
  field = new Field(this);
  constructor(props) {
    super(props);
    this.state = {};
    this.onSuccess = this.onSuccess.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
  }

  beforeUpload(info, options) {
    options.data.import_id = this.props.uuid;
    // this.props.actions.setImportIdPbFileImp(options.data.import_id);
    console.log(info);
  }

  onChange(info) {
    console.log('onChane callback : ', info);
  }

  onDragOver() {
    console.log('dragover callback');
  }

  onDrop(fileList) {
    console.log('drop callback : ', fileList);
  }

  async onSuccess(info) {
    // this.props.actions.setLoadingPbFileImp(true);
    // const res = await this.props.actions.getPreviewFilesPbFileImp({
    //   caseId: this.props.caseId,
    //   import_id: info.response.data.import_id,
    // }, {
    //   query: {
    //     page: 1,
    //     pagesize: this.props.pageSize,
    //   } })
    if (!info.response.meta.success) {
      let newlist = this.field.getValues().upload;
      let lastList = newlist[newlist.length - 1];
      lastList.state = 'error';
      lastList.errorMsg = info.response.data[0].error;
      this.field.setValues({
        upload: newlist
      })
    } else {
      this.props.actions.setPbFileImp({ data: info.response, uploadField: this.field });
      console.log(info);
    }
  }
  onError(file) {
    console.log('onError callback : ', file);
  }
  onRemove() {

  }

  componentDidMount() {
    this.props.actions.clearPbFileImp({}, {isPure: true});
  }

  render() {
    return (
      <div>
        {/*<div style={{ marginBottom: '10px' }}>*/}
          {/*<span>数据模板:</span>*/}
          {/*<a style={{ marginLeft: '10px' }} href={`${ajax.baseUrl}/downloads/pbills`} target="_blank">文件模板.csv</a>*/}
        {/*</div>*/}
        <Form field={this.field}>
          <FormItem style={{marginBottom: 0}}>
            <Upload.Dragger
              name="upload"
              action={`${ajax.baseUrl}/cases/${this.props.caseId}/pbills/upload`}
              accept=".hfs"
              listType="text"
              headers={{ 'X-Requested-With': null }}
              data={{ import_id: null }}
              onDragOver={this.onDragOver}
              onDrop={this.onDrop}
              beforeUpload={this.beforeUpload}
              onSuccess={this.onSuccess}
              onError={this.onError}
              onRemove={this.onRemove}
              withCredentials
              multiple
            >
              <div className="next-upload-drag" style={styles.padding}>
                <p className="next-upload-drag-icon">
                  <FontAwesomeIcon icon={faUpload} size="2x"></FontAwesomeIcon>
                </p>
                <p className="next-upload-drag-text">点击或者拖动文件到虚线框内上传</p>
                <p className="next-upload-drag-hint">
                  仅支持话单转换器生成的话单
                </p>
              </div>
            </Upload.Dragger>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const styles = {
  padding: {
    padding: '10px',
  },
}

export default connect(
  state => ({
    pbFileImps: state.pbFileImps,
    caseId: state.cases.case.id,
    pageSize: state.pbFileImps.pageSize,
    isLoading: state.pbFileImps.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...pbFilesImportActions }, dispatch),
  }),
)(FilesImportComponent);
