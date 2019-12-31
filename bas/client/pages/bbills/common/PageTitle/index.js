import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, Icon} from '@alifd/next';


import TourAgent from '../../../common/TourAgent';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {tasMenuConfig, headerMenuConfig} from '../../../../menuConfig'
import {addFavorites, getFavoritesList, deleteFavorites} from '../../../../stores/menus/actions';
import {monthMissingAsZero} from '../../../../utils/timeframe';
import { mainRoutersContext } from '../../../../contexts/mainRoutes-context';


class PageTitle extends Component {
  static contextType = mainRoutersContext;

  constructor(props) {
    super(props);
    this.state = {
      favorite: null,
      mkey: null
    };
    this.openTours = this.openTours.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.favoritesList) {
      if (nextProps.favoritesList.indexOf(this.state.mkey) === -1) {
        this.setState({favorite: false});
        return
      }
      if (nextProps.favoritesList.indexOf(this.state.mkey) !== -1) {
        this.setState({favorite: true})
      }

    }
  }

  componentDidMount() {
    let mkey = null;
    tasMenuConfig.forEach(item => {
      if (item.name !== '工作台') {
        item.children.forEach(citem => {
          if (citem.name === this.props.title) {
            mkey = citem.mkey;
            this.setState({mkey: citem.mkey})
          }
        })
      }
    });
    headerMenuConfig.forEach(item => {
      if (item.name === this.props.title) {
        mkey = item.mkey;
        this.setState({mkey: item.mkey})
      }
    });

    if (this.props.favoritesList.indexOf(mkey) === -1) {
      this.setState({favorite: false});
      return
    }
    if (this.props.favoritesList.indexOf(mkey) !== -1) {
      this.setState({favorite: true})
    }
  }

  openTours() {
    const {openTour} = this.props;
    openTour(true)
  }

  addFavorites = () => {
    this.props.addFavorites(this.state.mkey, this.context.itemType).then(res => {
      this.props.getFavoritesList(this.context.itemType)
    })
  };
  deleteFavorites = () => {
    this.props.favoritesId.forEach(item => {
      if (item.mkey == this.state.mkey) {
        this.props.deleteFavorites(item.id).then(res => {
          this.props.getFavoritesList(this.context.itemType)
        })
      }
    })
  };

  render() {
    const {tour} = this.props;
    return (
      this.props.collapsed ? (
        <div style={styles.nav}>
          <h2 style={styles.breadcrumb}>
            {this.props.title}
            {
              tour ? <TourAgent page={tour.page}/> : null
            }
            {
              this.state.favorite ? <FontAwesomeIcon icon={faStar} title={'将此功能从收藏夹移除'} onClick={this.deleteFavorites} style={{
                  fontSize: '18px',
                  color: '#3080FE',
                  display: this.props.title === '我的工作台' ? 'none' : 'inline-block'
                }}/> :
                <FontAwesomeIcon icon={faStar} title={'将此功能添加到收藏夹'} onClick={this.addFavorites} style={{
                  fontSize: '18px',
                  display: this.props.title === '我的工作台' ? 'none' : 'inline-block'
                }} className="tourIcon"/>
            }
          </h2>
          <div style={{
            display: 'inline-block',
            padding: 0,
            position: 'absolute',
            width: '100%',
            textAlign: 'center',
            bottom: '3px'
          }}
          >
            <Icon type="prompt" size="small" style={{color: '#5485f7', marginRight: '5px'}}/>
            点击下拉展开搜索选项
          </div>
          <div>
            {
              this.props.button ? this.props.button : null
            }
          </div>
        </div>
      ) : (
        <div style={styles.nav} data-tut={tour ? 'tour_' + tour.page + '_step0' : null}>
          <h2 style={styles.breadcrumb}>
            {this.props.title}
            {
              tour ? <TourAgent page={tour.page}/> : null
            }
            {
              this.state.favorite ? <FontAwesomeIcon icon={faStar} style={{
                  fontSize: '18px',
                  color: '#3080FE',
                  display: this.props.title === '我的工作台' ? 'none' : 'inline-block'
                }}
                                                     onClick={this.deleteFavorites} title={'将此功能从收藏夹移除'}/> :
                <FontAwesomeIcon icon={faStar} style={{
                  fontSize: '18px',
                  display: this.props.title === '我的工作台' ? 'none' : 'inline-block'
                }} className="tourIcon"
                                 onClick={this.addFavorites} title={'将此功能添加到收藏夹'}/>
            }
          </h2>
          {
            this.props.buttons ? this.props.buttons : null
          }
        </div>
      )
    );
  }
}

{/*<div style={styles.nav}>*/
}
{/*<h2 style={styles.breadcrumb}>*/
}
{/*{this.props.title}*/
}
{/*{*/
}
{/*page ? <TourAgent page={page} /> : null*/
}
{/*}*/
}
{/*<i className="fa fa-camera-bell"></i>*/
}
{/*</h2>*/
}
{/*<div data-tut="reactour__relation" >*/
}
{/*{*/
}
{/*this.props.showBtn ? this.props.showBtn : null*/
}
{/*}*/
}
{/*</div>*/
}
{/*</div>*/
}

const styles = {
  nav: {
    position: 'relative',
    background: 'white',
    height: '72px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumb: {
    borderLeft: '5px solid #447eff',
    paddingLeft: '16px',
    margin: '0 0 0 20px',
  },
  container: {
    margin: '20px',
  },
};

const mapStateToProps = (state) => {
  return {
    case: state.cases.case,
    caseOverviews: state.caseOverviews,
    favoritesList: state.menus.favoritesList,
    favoritesId: state.menus.favoritesId,
  };
};

const mapDispatchToProps = {
  addFavorites,
  getFavoritesList,
  deleteFavorites
};

export default connect(mapStateToProps, mapDispatchToProps)(PageTitle);
