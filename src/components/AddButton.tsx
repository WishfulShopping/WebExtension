import type { ReactNode} from "react";
import { useState } from "react";
import { Bookmark } from "src/components/Bookmark";
import type Types from "src/types";

export const AddButton = (props: { currentTab: number, url: string, children?:ReactNode }) => {
  const currentTab = props.currentTab;
  const [bookmark, setBookmark] = useState<Types.Bookmark>();
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const origin = props.url.replace('/list', '/api/url/add').replace('//api', '/api');


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

  if (!bookmark || !isGranted) return (
    <button title="Add this page as wish" onClick={handleClick} onKeyDown={handleClick} >
       {props.children}
    </button>
  );

  return (
    <Bookmark bookmark={bookmark} origin={origin} />
  );
};
