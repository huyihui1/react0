import React, {useState, useEffect} from 'react'
import moment from 'moment'
import { Tab, Button } from '@alifd/next';
// import { useSelector } from 'react-redux';

export default function HistoryList(props) {
  // const historys = useSelector(state => state.historys)
  // console.log(historys);

  return (
    <div className="history">
      {/*{*/}
        {/*historys.map(item => {*/}
          {/*return (*/}
            {/*<div className='list-wrapper'>*/}
              {/*<div style={{overflow: 'hidden', marginBottom: '5px'}}>*/}
                {/*<div className="title">*/}
                  {/*{*/}
                    {/*item.code*/}
                  {/*}*/}
                {/*</div>*/}
                {/*<div className="datetime">{moment(item.date).format('YYYY-MM-DD HH:mm:ss')}</div>*/}
              {/*</div>*/}
              {/*<div className="addr">*/}
                {/*{item.addr}*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*)*/}
        {/*})*/}
      {/*}*/}
    </div>
  )
}
