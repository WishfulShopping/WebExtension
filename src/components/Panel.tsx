import { useEffect, useState } from "react";
import { AddButton } from "src/components/AddButton";
import { ImportButton } from "src/components/ImportButton";
import { Listing } from "src/components/Listing";

export const Panel: React.VFC = () => {
  const [currentTab, setCurrentTab] = useState<number>();
 
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // current tab info
      const currentTab = tabs[0];
      const currentTabId = currentTab.id ?? 0;
      setCurrentTab(currentTabId);
    });
  }, []);

  if (!currentTab) return <div>Loading...</div>;

  return (
      <>
        <AddButton currentTab={currentTab} />
        <ImportButton currentTab={currentTab} />
        <Listing/>
      </>
  );
};
