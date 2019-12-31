import React, { Component } from 'react';
import { Select } from '@alifd/next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../../stores/SearchStore/index';

const { Option, OptionGroup } = Select;

const span = {
  display:'inline-block',
  width:'20px',
  height: '20px',
  textAlign:'center',
  lineHeight: '20px',
  backgroundColor:'skyblue',
  marginRight: '5px'
};
//<div><span style={span}>A</span><span>对方号码</span></div>

const titles = [
  {
    title: 'A-对方号码',
    children: ['A1-对方号码', 'A2-对方号码vs时长类型', 'A3-对方号码vs通话时段', 'A4-对方号码vs通话时段(详细)', 'A5-对方号码vs通话时段(小时)'],
  },
  {
    title: <div><span>B-基</span><span style={{marginLeft:'30px'}}>站</span></div>,
    children: ['B1-基站CI(图)', 'B2-基站vs通话时段(图)', 'B3-基站vs通话时段(详细)(图)', 'B4-基站vs通话时段(小时)(图)', 'B5-基站LAC', 'B6-基站vs通话时长', 'B7-基站vs本方号码(图)'],
  },
  {
    title: 'C-本方号码',
    children: ['C1-本方号码', 'C2-本方号码vs时长类型', 'C3-本方号码vs通话时段', 'C4-本方号码vs通话时段(详细)', 'C5-本方号码vs通话时段(小时)'],
  },
  {
    title: 'F-通话概述',
    children: ['F1-计费类型', 'F2-联系类型', 'F3-通话类型', 'F4-本方通话地', 'F5-对方通话地(图)'],
  },
  {
    title: 'G-通话时段',
    children: ['G1-时长段', 'G2-通话时段', 'G3-通话时段(详细)', 'G4-通话时段(小时)', 'G5-通话时长VS通话时段', 'G6-通话时段(详细)vs通话时长'],
  },
  {
    title: 'H-通话日期',
    children: ['H1-一周分布', 'H2-通话日期(图)', 'H3-日期vs通话时段', 'H4-日期vs通话时段(详细)', 'H5-日期vs对方号码', 'H6-日期vs基站'],
  },

];


class AllChartTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectArr: [],
      chartView: [],
      activeTitle: 'A-对方号码',
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
    this.props.actions.setChartViewSearch(chartView);
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
    this.props.actions.setChartViewSearch(temp);
  }

  formatSelectData(data) {
    const newData = [];
    data.map(item => {
      newData.push({ label: item, value: item });
    });

    return newData;
  }
  handleActiveTitle(title) {
    this.setState({
      activeTitle: title
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.selectArr !== nextProps.search.chartView) {
      this.setState({
        selectArr: nextProps.search.chartView,
      })
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
          <ul className="next-menu" style={{ border: 'none' }}>
            {
              titles.map(item => {
                return (
                  <li key={item.title} style={{fontSize: '16px', letterSpacing: item.title.length === 2 ? '30px' : 0}} className={this.state.activeTitle === item.title ? 'next-menu-item activeTitle' : 'next-menu-item'} onClick={() => this.handleActiveTitle(item.title)}>{item.title}</li>
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
                    <ul className="next-menu" style={{ border: 'none' }}>
                      {
                        items.children.map(item => {
                          return (
                            <li key={item} className="next-menu-item" onClick={this.handleSelect.bind(this, item)}>
                              <div className="next-menu-item-inner" style={{ lineHeight: '32px' }}>
                                {
                                  this.state.selectArr.indexOf(item) > -1 ? (
                                    <i className="next-icon next-icon-select next-medium next-menu-icon-selected" style={{ color: '#3080fe' }} />
                                  ) : null
                                }
                                <span className="next-menu-item-text">{item}</span>
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
          <span style={{ whiteSpace: 'nowrap' }}>报表类型:</span>
          <Select
            mode="multiple"
            popupContent={popupContent}
            style={{ ...styles.input, ...styles.longInput }}
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
    search: state.search,
  }),
  // mapDispatchToProps
  dispatch => ({
    actions: bindActionCreators({ ...actions }, dispatch),
  }),
)(AllChartTitle);
