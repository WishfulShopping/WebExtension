import React from 'react';
import { AddButton } from './AddButton';
import { Wishlist } from '../types';


export function AddCurrentTab ({wishlist}:{wishlist:Wishlist}) {
  const [currentTab, setCurrentTab] = React.useState<number>();

  React.useEffect(() => {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // current tab info
      const currentTab = tabs[0];
      const currentTabId = currentTab.id ?? 0;
      setCurrentTab(currentTabId);
    });

  }, [currentTab]);

  return <AddButton wishlist={wishlist} currentTab={currentTab}/>;
}
