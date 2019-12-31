import React from 'react';

export let itemType =  ASSETS_TYPE;
export let subSystems =  '';

export const mainRoutersContext = React.createContext(
  {
    itemType,
    subSystems,
    toggleItemType: () => {
    },
  }
);
