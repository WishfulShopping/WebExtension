import React from 'react';
import { AddButton } from './AddButton';


export function AddCurrentTab (props) {
  const [currentTab, setCurrentTab] = React.useState<number>();

  React.useEffect(() => {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // current tab info
      const currentTab = tabs[0];
      const currentTabId = currentTab.id ?? 0;
      setCurrentTab(currentTabId);
    });

  }, [currentTab]);

  if (typeof(currentTab) == "undefined") {
    return <></>;
  }

  return <AddButton currentTab={currentTab} {...props}/>;
}
