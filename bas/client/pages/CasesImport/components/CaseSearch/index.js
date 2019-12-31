import React, { Component } from 'react';
import { Input, Select, DatePicker, Button, Message } from '@alifd/next';

const { Option } = Select;

export default class CaseSearch extends Component {
  handleClick = () => {
    Message.toast.success('未搜索到符合条件的数据');
  };

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.right}>
          <span style={styles.caseNumber}>
            <Input
              style={{ ...styles.input, ...styles.shortInput }}

            />
            <span>
              <Button

                type="primary"
                style={styles.button}
                onClick={this.handleClick}
              >
                搜索
              </Button>
            </span>
          </span>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: '0 0 20px 0',
    letterSpacing: '2px',
  },
  input: {
    margin: '0 4px',
  },
  select: {
    verticalAlign: 'middle',
    width: '200px',
  },

  right:{
    textAlign: "right"
  },
  shortInput: {
    width: '130px',
  },
  caseNumber: {

  },
  date: {
    marginRight: '24px',
  },
  button: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
};
