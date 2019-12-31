import React, {Component} from 'react';
import {Dialog, Form, Upload, Table, Button, Message} from '@alifd/next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import IceContainer from '@icedesign/container';
import ajax from '../../../../../utils/ajax';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actions} from '../../../../../bbStores/Bins';


const FormItem = Form.Item;


class ImportBins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
    };
  }


  componentWillReceiveProps(nextProps) {
  }

  formChange = () => {
  };

  onSuccess = (file, value) => {
    if (file.response && file.response.meta.success) {
      Message.success('导入成功!');
      this.props.onClose();
      this.props.actions.fetchBins({case_id: this.props.caseId}, {
        query: {
          page: 1,
          pagesize: this.props.bins.pageSize
        }
      });
      this.props.resetCurrent();
    } else {
      Message.error("导入失败!");
      this.props.onClose();
    }
  };

  onError = () => {

  };

  render() {
    return (
      <span>
        <Dialog
          visible={this.props.visible}
          onOk={this.props.onClose}
          closeable="esc,mask,close"
          onCancel={this.props.onClose}
          onClose={this.props.onClose}
          footer={false}
          title='银行卡信息导入'
          style={{minWidth: '50%'}}
        >
          <IceContainer style={styles.container}>
            <Form>
              <FormItem>
                <Upload
                  shape="card"
                  listType="text"
                  accept=".xls, .xlsx, .csv"
                  headers={{'X-Requested-With': null}}
                  action={`${ajax.baseUrl}/cases/${this.props.caseId}/bins/import`}
                  // beforeUpload={this.beforeUpload}
                  // onChange={this.onChange}
                  onSuccess={this.onSuccess}
                  // onRemove={this.onRemove}
                  onError={this.onError}
                  multiple
                  limit={1}
                  // withCredentials={false}
                  // ref={(ref) => {
                  //   if (ref) {
                  //     this.uploaderRef = ref.getInstance();
                  //   }
                  // }}
                >
                  导入
                </Upload>
              </FormItem>
            </Form>
            <IceContainer style={{padding: 0}}>
              <span>数据模板:</span>
              <a style={{marginLeft: '10px'}} href={`${ajax.baseUrl}/downloads/bins`}>银行卡标识模板.xlsx</a>
              {/*<a style={{marginLeft: '10px'}}>银行卡标识模板.xlsx</a>*/}
            </IceContainer>
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


export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
    bins: state.bins
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(ImportBins);
// export default ImportBins;
