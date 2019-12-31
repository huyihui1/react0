import React, {Component} from 'react';
import {Select} from '@alifd/next';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../../../bbStores/bbSearchStore/index';

const {Option, OptionGroup} = Select;

const span = {
  display: 'inline-block',
  width: '20px',
  height: '20px',
  textAlign: 'center',
  lineHeight: '20px',
  backgroundColor: 'skyblue',
  marginRight: '5px'
};
//<div><span style={span}>A</span><span>对方号码</span></div>

const titles = [
  {
    key: 'A',
    title: 'A-对方账户',
    children: ['对方账户', '对方账户vs金额种类', '对方账户vs交易时段', '对方账户vs交易时段(小时)'],
  },
  {
    key: 'B',
    title: <div><span>B-网</span><span style={{marginLeft: '30px'}}>点</span></div>,
    children: ['机构号', '柜员号', '机构号vs交易时段', '机构号vs交易时段(小时)', '柜员号vs交易时段', '柜员号vs交易时段(小时)'],
  },
  {
    key: 'C',
    title: 'C-本方账户',
    children: ['本方账户', '本方账户vs金额种类', '本方账户vs交易时段', '本方账户vs交易时段(小时)'],
  },
  {
    key: 'F',
    title: 'F-交易概述',
    children: ['交易类型', '金额种类', '交易摘要', '交易渠道'],
  },
  {
    key: 'G',
    title: 'G-交易时段',
    children: ['交易时段', '交易时段(小时)', '交易时段vs金额种类'],
  },
  {
    key: 'H',
    title: 'H-交易日期',
    children: ['一周分布', '交易日期', '日期vs交易时段', '日期vs对方卡号', '日期vs网点'],
  },

];


class BBAllChartTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectArr: [],
      chartView: [],
      activeTitle: 'A-对方账户',
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleActiveTitle = this.handleActiveTitle.bind(this);
  }

  onSelectChange(value) {
    const chartView = [];
    value.map(item => {
      chartView.push(item.value);
    });
    this.props.actions.setChartViewBbSearch(chartView);
    this.setState({
      selectArr: chartView,
    });
  }

  handleSelect(value) {
    const temp = [...this.state.selectArr];
    if (temp.indexOf(value) > -1) {
      temp.splice(temp.indexOf(value), 1);
    } else {
      temp.push(value);
    }
    this.setState({
      selectArr: temp,
    });
    this.props.actions.setChartViewBbSearch(temp);
  }

  formatSelectData(data) {
    const newData = [];
    data.map(item => {
      newData.push({label: item, value: item});
    });

    return newData;
  }

  handleActiveTitle(title) {
    this.setState({
      activeTitle: title
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search && nextProps.search.chartView) {
      if (this.state.selectArr !== nextProps.search.chartView) {
        this.setState({
          selectArr: nextProps.search.chartView,
        })
      }
    }
  }

  componentDidMount() {
    this.props.onChartInptRef && this.props.onChartInptRef(this)
  }

  clearVal = () => {
    this.setState({
      selectArr: [],
      chartView: [],
    });
  }

  render() {
    const popupContent =
      (<div style={styles.selectOptions}>
        <div className="report-left">
          <ul className="next-menu" style={{border: 'none'}}>
            {
              titles.map(item => {
                return (
                  <li key={item.title} style={{fontSize: '16px', letterSpacing: item.title.length === 2 ? '30px' : 0}}
                      className={this.state.activeTitle === item.title ? 'next-menu-item activeTitle' : 'next-menu-item'}
                      onClick={() => this.handleActiveTitle(item.title)}>{item.title}</li>
                )
              })
            }
          </ul>
        </div>
        <div style={{width: '70%'}}>
          {
            titles.map(items => {
              if (items.title === this.state.activeTitle) {
                return (
                  <div key={items.title}>
                    <ul className="next-menu" style={{border: 'none'}}>
                      {
                        items.children.map((item, index) => {
                          return (
                            <li key={item} className="next-menu-item"
                                onClick={this.handleSelect.bind(this, `${items.key}${index + 1}-${item}`)}>
                              <div className="next-menu-item-inner" style={{lineHeight: '32px'}}>
                                {
                                  this.state.selectArr.indexOf(`${items.key}${index + 1}-${item}`) > -1 ? (
                                    <i className="next-icon next-icon-select next-medium next-menu-icon-selected"
                                       style={{color: '#3080fe'}}/>
                                  ) : null
                                }
                                <span className="next-menu-item-text">{`${items.key}${index + 1}-${item}`}</span>
                              </div>
                            </li>
                          );
                        })
                      }
                    </ul>
                  </div>
                );
              } else {
                return null
              }
            })
          }
        </div>

      </div>);

    return (
      <span style={styles.caseNumber}>
        <label style={styles.label}>
          <span style={{...styles.lableValue, whiteSpace: 'nowrap'}}>报表类型:</span>
          <Select
            mode="multiple"
            popupContent={popupContent}
            style={{...styles.input, ...styles.longInput}}
            value={this.formatSelectData(this.state.selectArr)}
            onChange={this.onSelectChange}
          />
        </label>
      </span>
    );
  }
}

const styles = {
  caseNumber: {
    marginTop: '10px',
    marginRight: '16px',
    display: 'inline-block',
    width: '100%',
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    // whiteSpace: 'nowrap',
    alignItems: 'center',
  },
  lableValue: {
    flex: '0 0 85px',
    width: '85px',
    textAlign: 'right',
  },
  input: {
    width: '100%',
    margin: '0 4px',
  },
  selectOptions: {
    width: '100%',
    height: '250px',
    overflowY: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    background: '#fff',
    border: '1px solid #eee',
    padding: '8px 15px',
    fontSize: '14px',
  },
};


export default connect(
  // mapStateToProps
  state => ({
    caseId: state.cases.case.id,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch),
  }),
)(BBAllChartTitle);
