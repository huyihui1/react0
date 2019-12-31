import React, {Component} from 'react';
import { Loading } from '@alifd/next';
import appConfig from '../../appConfig'

export default class Reload extends Component {
  render() {
    return (
      <Loading tip={appConfig.LOADING_TEXT} style={{width: '100%', height: document.documentElement.offsetHeight || document.body.offsetHeight}} >

      </Loading>
    )
  }
}
