import React, { Component } from 'react';
import { Upload, Dialog, Field, Form, Input, Select, Grid, Message, Button } from '@alifd/next';
import Container from '@icedesign/container';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ajax from '../../../../utils/ajax';
import { actions as citizensImportActions } from '../../../../stores/citizens';
import FilesTable from '../FilesTable';

import './style.css';

const FormItem = Form.Item;
const Option = Select.Option;
const { Row, Col } = Grid;

class FilesImportComponent extends Component {
  field = new Field(this);
  constructor(props) {
    super(props);
    this.state = {};
    this.onSuccess = this.onSuccess.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.saveUploaderRef = this.saveUploaderRef.bind(this);
  }

  beforeUpload(info, options) {
    const { area_code, version, category, name } = this.field.getValues();
    // options.data.import_id = this.props.uuid;
    options.data.name = name;
    options.data.area_code = area_code;
    options.data.version = version;
    options.data.category = category;
    console.log(info);
  }

  onSubmit() {
    console.log(this.uploaderRef);
    this.uploaderRef.startUpload();
  }

  saveUploaderRef(ref) {
    if (ref) {
      this.uploaderRef = ref.getInstance();
    }
  };

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
    console.log(info);
    if (info.response.meta.success) {
      this.props.afterUploadFun();
      this.field.reset();
      this.uploaderRef.removeFile(info);
      Message.success("导入成功")
    } else {
      Message.error("导入失败")
      Message.error(info.response.meta.message);
    }
  }

  onRemove() {

  }

  componentDidMount() {
    this.props.actions.clearCitizen({}, { isPure: true });
  }
  onClose() {
    this.props.onClose();
  }
  render() {
    const { init } = this.field;
    return (
      <Dialog
        visible={this.props.visible}
        onOk={this.onClose}
        closeable="esc,mask,close"
        onCancel={this.onClose}
        onClose={this.onClose}
        footer={false}
        title={this.props.title}
        style={{ maxWidth: '50%' }}
      >
        <div id="citizensImp" className="fileImport">
          <Container style={styles.container}>
            <Form field={this.field}>
              <Row wrap gutter={40}>
                <Col l="12">
                  <FormItem style={{ marginBottom: 0 }}>
                    <Upload
                      action={`${ajax.baseUrl}/citizens/upload`}
                      accept=".xls, .xlsx"
                      autoUpload={false}
                      ref={this.saveUploaderRef}
                      listType="text"
                      headers={{ 'X-Requested-With': null }}
                      beforeUpload={this.beforeUpload}
                      data={{ name: null, area_code: null, version: null, category: null }}
                      onSuccess={this.onSuccess}
                      withCredentials
                    >
                      <Button>人员导入</Button>
                    </Upload>


                    {/*<Upload.Dragger*/}
                      {/*action={`${ajax.baseUrl}/citizens/upload`}*/}
                      {/*accept=".xls, .xlsx"*/}
                      {/*autoUpload={false}*/}
                      {/*ref={this.saveUploaderRef}*/}
                      {/*limit={1}*/}
                      {/*listType="text"*/}
                      {/*headers={{ 'X-Requested-With': null }}*/}
                      {/*data={{ import_id: null, name: null, version: null, category: null }}*/}
                      {/*onDragOver={this.onDragOver}*/}
                      {/*onDrop={this.onDrop}*/}
                      {/*beforeUpload={this.beforeUpload}*/}
                      {/*onSuccess={this.onSuccess}*/}
                      {/*onRemove={this.onRemove}*/}
                      {/*withCredentials*/}
                      {/*multiple*/}
                    {/*>*/}
                      {/*<div className="next-upload-drag" style={styles.padding}>*/}
                        {/*<p className="next-upload-drag-icon">*/}
                          {/*<FontAwesomeIcon icon={faUpload} size="2x" />*/}
                        {/*</p>*/}
                        {/*<p className="next-upload-drag-text">点击或者拖动文件到虚线框内上传</p>*/}
                        {/*<p className="next-upload-drag-hint">*/}
                          {/*支持 .xls, .xlsx 等类型的文件*/}
                        {/*</p>*/}
                      {/*</div>*/}
                    {/*</Upload.Dragger>*/}
                  </FormItem>
                  <Container style={{ padding: 0, marginTop: '16px' }}>
                    <span>数据模板:</span>
                    <a style={{ marginLeft: '10px' }} href={`${ajax.baseUrl}/downloads/citizen-book`}>人员通讯录.xlsx</a>
                  </Container>
                </Col>
                <Col l="12">
                  <Row wrap gutter={40}>
                    <Col l="24">
                      <FormItem>
                        <span style={styles.caseNumber}>
                          <label style={styles.label}>
                            <span style={styles.title}>通讯录名称:</span>
                            <Input style={styles.input} {...init('name')} placeholder="请输入通讯录名称" />
                          </label>
                        </span>
                      </FormItem>
                    </Col>
                    <Col l="24">
                      <FormItem>
                        <span style={styles.caseNumber}>
                          <label style={styles.label}>
                            <span style={styles.title}>通讯录区号:</span>
                            <Input style={styles.input} {...init('area_code')} placeholder="请输入区号, 例如0577" />
                          </label>
                        </span>
                      </FormItem>
                    </Col>
                    <Col l="24">
                      <FormItem>
                        <span style={styles.caseNumber}>
                          <label style={styles.label}>
                            <span style={styles.title}>通讯录版本号:</span>
                            <Input style={styles.input} {...init('version')} placeholder="请输入通讯录版本号, 例如输入201108" />
                          </label>
                        </span>
                      </FormItem>
                    </Col>
                    <Col l="24">
                      <FormItem>
                        <span style={styles.caseNumber}>
                          <label style={styles.label}>
                            <span style={styles.title}>通讯录类型:</span>
                            <Select {...init('category')} style={styles.input}>
                              <Option value="g">g-国家公务人员</Option>
                              <Option value="b">b-企业人员</Option>
                              <Option value="j">j-国企人员</Option>
                              <Option value="z">z-一般人员</Option>
                            </Select>
                          </label>
                        </span>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div style={{ textAlign: 'right', marginTop: '25px' }}>
                <Button
                  type="primary"
                  style={styles.submitButton}
                  onClick={this.onSubmit}
                >
                  提 交
                </Button>
                <Button
                  type="secondary"
                  style={styles.submitButton2}
                  onClick={this.onClose}
                >
                  退 出
                </Button>
              </div>
            </Form>
          </Container>
          {/*<div style={styles.container}>*/}
            {/*<FilesTable afterUploadFun={this.props.afterUploadFun} uuid={this.props.uuid} />*/}
          {/*</div>*/}
        </div>
      </Dialog>
    );
  }
}

const styles = {
  padding: {
    padding: '10px',
  },
  container: {
    margin: '20px',
  },
  caseNumber: {
    display: 'inline-block',
    width: '100%',
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    // whiteSpace: 'nowrap',
    alignItems: 'center',
  },
  input: {
    width: '175px',
    margin: '0 4px',
  },
  title: {
    whiteSpace: 'nowrap',
    flex: '0 0 87px',
    textAlign: 'right',
  },
  submitButton2: {
    marginLeft: '15px'
  }
};

export default connect(
  state => ({
    Citizens: state.citizens,
    case: state.cases.case,
    pageSize: state.citizens.pageSize,
    isLoading: state.citizens.isLoading,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...citizensImportActions }, dispatch),
  }),
)(FilesImportComponent);
