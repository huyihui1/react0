import React, { useState, useEffect } from 'react';

import PbSearchBox from './SearchBox'

export default function ComboBillsSearchBox(props) {
  return (
    <div>
      <PbSearchBox isShow={true} windowScroller={props.windowScroller}  />
    </div>
  )
}
