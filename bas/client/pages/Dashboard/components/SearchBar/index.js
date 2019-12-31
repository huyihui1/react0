import React, { Component } from 'react';
import { Input, Select, DatePicker, Button, Message} from '@alifd/next';
import IceContainer from '@icedesign/container';
const { Option } = Select;

export default class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state={
      advanced: false,
      conditions:[]
    }
    this.showAdvancedSearch = this.showAdvancedSearch.bind(this);
    this.addConditions = this.addConditions.bind(this);
  }
  handleClick = () => {
    Message.toast.success('未搜索到符合条件的数据');
  };

  showAdvancedSearch(){
    this.setState({
      advanced:!this.state.advanced
    })
  }

  addConditions(values){
    let conditions = []
    for(let key in values){
      values[key] && conditions.push([key,values[key]])
    }
    this.setState({
      conditions:conditions
    })
  }


  render() {
    const showAdvancedCondition = this.state.conditions.map((cond,index)=>(
      <span style={styles.caseNumber} key={index}>
        <label>
          {cond[0]}:{cond[1]}
        </label>
      </span>
    ))
    return (
      <IceContainer style={styles.container}>
        <div style={styles.container}>
          <div>
            <span style={styles.caseNumber}>
              <label>
                案号:
                <Input
                  style={{ ...styles.input, ...styles.shortInput }}

                />

              </label>
            </span>
            <span style={styles.caseNumber}>
              <label>
                名称:
                <Input
                  style={{ ...styles.input, ...styles.shortInput }}

                />

              </label>
            </span>
            <span style={styles.date}>
              <label>
                时间:
                <DatePicker
                  placeholder="Start"

                  style={styles.shortInput}
                />
              </label>
            </span>
            <span>
              <Button

                type="primary"
                style={styles.button}
                onClick={this.handleClick}
              >
                查询
              </Button>
            </span>
          </div>
        </div>
      </IceContainer>
    );
  }
}

const styles = {
  container: {
    margin: '0',
    letterSpacing: '2px',
  },
  other:{
    margin: "5px 0"
  },
  input: {
    margin: '0 4px',
  },
  select: {
    verticalAlign: 'middle',
    width: '200px',
  },
  shortInput: {
    width: '110px',
  },
  caseNumber: {
    marginRight: '16px',
  },
  date: {
    marginRight: '24px',
  },
  button: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
  buttonRight: {
    margin: '0 4px',
    letterSpacing: '2px',
  },
  search:{
    textAlign:"center",
    margin: "10px 0"
  }
};
