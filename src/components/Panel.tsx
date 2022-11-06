import { useEffect, useState } from "react";
import { ImportButton } from "src/components/ImportButton";
import { Listing } from "src/components/Listing";
import type Types from "src/types";

export const Panel: React.VFC = () => {
  const [currentTab, setCurrentTab] = useState<number>();
  const [hasImport, setHasImport] = useState<boolean>(false);
 
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // current tab info
      const currentTab = tabs[0];
      const currentTabId = currentTab.id ?? 0;
      setCurrentTab(currentTabId);
      // view mode
      chrome.tabs.sendMessage<Types.Message>(currentTabId, { action: "showImport" }, (res: Types.Response) => {
        setHasImport(res.data);
      });
    });
  }, []);

  if (!currentTab) return <div>Loading...</div>;

  return <>
    {hasImport && <ImportButton currentTab={currentTab} />}
    <Listing currentTab={currentTab} />
  </>;
};
