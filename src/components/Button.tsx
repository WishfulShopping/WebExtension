import { useEffect, useState } from "react";
import { Bookmark } from "src/components/Bookmark";
import type Types from "src/types";

export const Button: React.VFC = () => {
  const [currentTab, setCurrentTab] = useState<number>();
  const [bookmark, setBookmark] = useState<Types.Bookmark>();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // current tab info
    const currentTab = tabs[0];
      const currentTabId = currentTab.id ?? 0;
      setCurrentTab(currentTabId);
    });
  }, []);

  const handleClick = () => {
    // content script communication
    if (!currentTab) {
      return;
    }
    chrome.tabs.sendMessage<Types.Message>(currentTab, { action: "getId" }, (res: Types.Response) => {
        setBookmark(res.data);
    });
  };

  if (!currentTab) return <div>Loading...</div>;
  if (!bookmark) return (
    <button onClick={handleClick} className="block p-2 mx-auto rounded border">
      Click Me!
    </button>
  );

  return (
    <Bookmark bookmark={bookmark}/>
  );
};
