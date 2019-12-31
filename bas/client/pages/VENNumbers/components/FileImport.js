import React, { Component } from 'react';
import { Dialog, Form, Upload, Table, Button, Message } from '@alifd/next';
import IceContainer from '@icedesign/container';
import ajax from '../../../utils/ajax';
import { isWindows } from '../../../utils/utils';
import appConfig from '../../../appConfig';

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
    const res = await ajax.post(`/cases/${this.props.caseId}/ven_numbers/do-import`, {}, { withCredentials: true })
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
      const res = await ajax.post(`/cases/${this.props.caseId}/ven_numbers/abort-import`, {}, { withCredentials: true })
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
                  action={`${this.props.url}/cases/${this.props.caseId}/ven_numbers/upload`}
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
              <a style={{ marginLeft: '10px' }} href={`${ajax.baseUrl}/downloads/ven_numbers`}>虚拟网模板.csv</a>
            </IceContainer>
            {
              this.state.isPreview ? (
                <IceContainer style={{ padding: 0, margin: '20px 0' }}>
                  预览
                  <Table
                    dataSource={this.state.fileData}
                    primaryKey="short_num"
                    style={styles.table}
                  >
                    <Table.Column align="center" title="短号" dataIndex="short_num" />
                    <Table.Column align="center" title="长号" dataIndex="num" />
                    <Table.Column align="center" title="号码标注" dataIndex="label" />
                    <Table.Column align="center" title="虚拟网名称" dataIndex="network" />
                    <Table.Column align="center" title="产生途径" dataIndex="status" />
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
