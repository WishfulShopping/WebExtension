import { mdiEye,mdiGiftOpenOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useEffect, useState } from "react";
import { AddButton } from "src/components/AddButton";
import { ForgetWishlist } from "src/components/ForgetWishlist";

export const Listing = (props: { currentTab: number }) => {
  const [list, setList] = useState<[string, unknown][]>([]);
  const localStorageKey = "history";
  
  useEffect(() => {
    chrome.storage.local.get([localStorageKey], (result) => {
      if (result && result["history"])
        setList(Object.entries(result["history"]));
    });
  }, []);

  chrome.storage.onChanged.addListener((changes) => {
        if (changes["history"]) {
          setList(Object.entries(changes["history"].newValue));
      }
  });

  if (!list.length) return <a href="https://wishlist.netpascal.site/">First Create</a>
  
  
  return <table> {list.map(([url, name], key) => {
    return <tr key={key}>
      <td colSpan={2}>
        <AddButton currentTab={props.currentTab} url={url}>
          <>
            {name && `Name: ${name as string}`.substring(0, 18)}
            {name && <br/>}
            ID: {url.split('list/').pop()?.substring(0,12)}
          </>
          </AddButton>
      </td>
      <td><AddButton currentTab={props.currentTab} url={url}><Icon path={mdiGiftOpenOutline} className="w-8 h-8 mx-2 mt-2 rounded border hover:bg-green-300"/></AddButton></td>
      <td>
        <a href={url} rel="noreferrer" target="_blank" title="View wishlist content">
          <Icon path={mdiEye} className="w-8 h-8  mx-2  rounded border hover:bg-blue-300" />
        </a>
      </td>
      <td><ForgetWishlist url={url}  /></td>
      </tr>
  })} </table>;
}
