import React, { Component, useState, useEffect } from 'react';
import IceLabel from '@icedesign/label';

import {formatBankName, formatCardType} from '../../../../utils/bbillsUtils';

import './BankCardSimple.scss';

export default function BankCardSimple(props) {
  const cardNum = props.card;
  const name = props.name;
  const card_num = props.num;
  const bank_acct = props.acct;
  const peer_bank_acct = (props.rowData || {}).peer_bank_acct;
  const peer_card_num = (props.rowData || {}).peer_card_num;
  const cardType = props.card_type ? formatCardType(props.card_type) : '';
  const bankIcon = formatBankName(props.bankCode);
  let t = {peer_bank_acct}
  if (peer_card_num) {
    t['peer_card_num'] = peer_card_num
  }
  return (
    <div className="cardBox">
      {
        props.bankCode ? (
          <div style={{marginRight: '2px'}}>
            <img src={bankIcon} alt="" style={{ width: '15px', verticalAlign: 'text-bottom' }} />
          </div>
        ) : <div style={{marginRight: '2px', width: '15px', height: '15px'}}>
        </div>
      }
     <div>
       {
         cardType ? (
           <span style={{marginRight: '2px'}}>{cardType}</span>
         ) : null
       }
       {
         cardNum ? (
           <span labeldata={JSON.stringify({ card_num, bank_acct, ...t})}>{`${cardNum.substr(0, 3)}***${cardNum.substr(cardNum.length - 4)}` }</span>
         ) : null
       }
       {
         typeof name === 'object' ? (
           <IceLabel inverse={false} style={{ fontSize: '12px', marginLeft: '5px', backgroundColor: name.label_bg_color, color: name.label_txt_color, padding: '2px' }}>{name.label}</IceLabel>
         ) : name ? (
           <span style={{marginLeft: '2px'}}>{name}</span>
         ) : null
       }
     </div>
    </div>
  );
}
