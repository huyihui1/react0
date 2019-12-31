import React, { Component, useState } from 'react';

import {formatBankName, formatCardTypeFull} from '../../../../utils/bbillsUtils';

import './BankCardFull.scss'




export default function BankCardFull(props) {//
  const cardNum = props.card.replace(/(\d{4})/g,'$1 ');
  const cardType = formatCardTypeFull(props.card_type);
  const bankIcon = formatBankName(props.bankCode);
  console.log(cardNum);
  return (
    <div className="rccs">
      <div className="rccs__card rccs__card--unionpay">
        <div className="rccs__card--front">
          <div className="rccs__issuer"></div>
          <div className="rccs__number   rccs--filled">{cardNum}</div>
          <div className="rccs__name  rccs--filled">{props.userName}</div>
          <div className="rccs__expiry  rccs--filled">
            <div className="rccs__expiry__value">{cardType}</div>
          </div>
          <div className="rccs__chip"></div>
          <div className="rccs_bank_name">
            <div>
              <img src={bankIcon} alt=""/>
            </div>
            {props.bankName}
          </div>
        </div>
        <div className="rccs__card--back">
          <div className="rccs__card__background"></div>
          <div className="rccs__stripe"></div>
          <div className="rccs__signature"></div>
          <div className="rccs__cvc">737</div>
          <div className="rccs__issuer"></div>
        </div>
      </div>
    </div>
  )
}
