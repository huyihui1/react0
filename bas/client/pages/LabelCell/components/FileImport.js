import React, { Component } from 'react';
import { Dialog, Form, Upload, Table, Button, Message } from '@alifd/next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import IceContainer from '@icedesign/container';
import ajax from '../../../utils/ajax';


const FormItem = Form.Item;


class FileImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileData: [],
      isPreview: false,
      file: null,
    };
    this.onSuccess = this.onSuccess.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onFileClick = this.onFileClick.bind(this);
    this.onFileClose = this.onFileClose.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onSuccess(info) {
    this.setState({
      isPreview: true,
      fileData: info.response.data,
      file: info,
    });
  }

  onError(info) {
    console.log(info);
    Message.error('导入失败');
  }

  onRemove() {
    this.onFileClose(false);
  }

  beforeUpload(file) {
    console.log('beforeUpload : ', file);
  }

  onChange(info) {
    console.log('onChange : ', info);
  }

  onClose() {
    this.props.onClose();
    this.onFileClose(false);
  }

  async onFileClick() {
    const res = await ajax.post(`/cases/${this.props.caseId}/ct_labels/do-import`, {}, { withCredentials: true })
      .catch(err => {
        Message.error(err.message);
      });
    if (res && res.meta.success) {
      this.setState({
        isPreview: false,
        fileData: [],
      });
      this.props.onClose();
      this.props.afterFileImpFun();
    }
  }

  async onFileClose(bool = true) {
    if (this.state.file) {
      const res = await ajax.post(`/cases/${this.props.caseId}/ct_labels/abort-import`, {}, { withCredentials: true })
        .catch(err => {
          Message.error(err.message);
        });
      if (res.meta.success) {
        // this.uploaderRef.removeFile(this.state.file);
        this.setState({
          isPreview: false,
          fileData: [],
        });
      }
    }
    if (bool) {
      this.props.onClose();
    }
  }
  tableColumnRender(value, index, record) {
    return <FontAwesomeIcon icon={faMapMarkerAlt} style={{color: value}} />;
  }
  labelGroupsRender(value, index, record) {
    if (value) {
      let newVal = []
      value.forEach(item => {
        newVal.push(item);
      })
      return newVal.join(', ')
    } else {
      return value
    }
  }
  render() {
    return (
      <span>
        <Dialog
          visible={this.props.visible}
          onOk={this.onClose}
          closeable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          footer={false}
          title={this.props.title}
          style={{ minWidth: '50%' }}
        >
          <IceContainer style={styles.container}>
            <Form>
              <FormItem>
                <Upload
                  shape="card"
                  listType="text"
                  accept=".xls, .xlsx, .csv"
                  headers={{ 'X-Requested-With': null }}
                  action={`${this.props.url}/cases/${this.props.caseId}/ct_labels/upload`}
                  beforeUpload={this.beforeUpload}
                  onChange={this.onChange}
                  onSuccess={this.onSuccess}
                  onRemove={this.onRemove}
                  onError={this.onError}
                  multiple
                  limit={1}
                  // withCredentials={false}
                  ref={(ref) => {
                    if (ref) {
                      this.uploaderRef = ref.getInstance();
                    }
                  }}
                >
                  导入
                </Upload>
              </FormItem>
            </Form>
            <IceContainer style={{ padding: 0 }}>
              <span>数据模板:</span>
              <a style={{ marginLeft: '10px' }} href={`${ajax.baseUrl}/downloads/ct_labels`}>基站标注模板.xlsx</a>
            </IceContainer>
            {
              this.state.isPreview ? (
                <IceContainer style={{ padding: 0, margin: '20px 0' }}>
                  预览
                  <Table
                    dataSource={this.state.fileData}
                    primaryKey="ct_code"
                    style={styles.table}
                  >
                    <Table.Column align="center" title="基站代码" dataIndex="ct_code" style={{ width: '150px' }} />
                    <Table.Column align="center" title="图钉" dataIndex="marker_color" cell={this.tableColumnRender} width={80} />
                    <Table.Column align="center" title="标注名称" dataIndex="label" width={145} />
                    <Table.Column align="center" title="标签" dataIndex="label_groups" cell={this.labelGroupsRender} width={180} />
                    <Table.Column align="center" title="备注" dataIndex="memo" />
                  </Table>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      type="primary"
                      style={styles.submitButton}
                      onClick={this.onFileClick}
                    >
                      提 交
                    </Button>
                    <Button
                      type="secondary"
                      style={styles.submitButton2}
                      onClick={this.onFileClose}
                    >
                      取消
                    </Button>
                  </div>
                </IceContainer>
              ) : null
            }
          </IceContainer>
        </Dialog>
      </span>
    );
  }
}

const styles = {
  container: {
    marginBottom: 0,
  },
  table: {
    margin: '20px 0',
  },
  submitButton2: {
    marginLeft: '15px',
  },
};

export default FileImport;
