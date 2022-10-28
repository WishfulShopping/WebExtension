import { useEffect, useState } from "react";
import { Bookmark } from "src/components/Bookmark";
import type Types from "src/types";

export const Button: React.VFC = () => {
  const [currentTab, setCurrentTab] = useState<number>();
  const [bookmark, setBookmark] = useState<Types.Bookmark>();
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const origin = 'https://wishlist.netpascal.site/api/url/add/cc2d98ec63dde1c2cb805a4a647cc53b';

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
    
    const perm = {
      permissions: ['tabs'],
      origins: [origin]
    };

    chrome.permissions.contains(perm, (result) => {
      if (result) {
        // The extension has the permissions.
        setIsGranted(true);
      } else {
        chrome.permissions.request(perm, (granted) => {
          // The callback argument will be true if the user granted the permissions.
          if (granted) {
            setIsGranted(true);
          }
        });
      }
    });
  };

  if (!currentTab) return <div>Loading...</div>;
  if (!bookmark || !isGranted) return (
    <button onClick={handleClick} className="block p-2 mx-auto rounded border">
      Click Me!
    </button>
  );

  return (
    <Bookmark bookmark={bookmark} origin={origin} />
  );
};
