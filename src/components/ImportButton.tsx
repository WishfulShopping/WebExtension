import { mdiTrayArrowUp } from '@mdi/js';
import Icon from '@mdi/react';
import type Types from "src/types";

export const ImportButton = (props: { currentTab: number }) => {
  const currentTab = props.currentTab;

  const handleClick = () => {
    // content script communication
    if (!currentTab) {
      return;
    }
    chrome.tabs.sendMessage<Types.Message>(currentTab, { action: "ImportWishlist" });

  };

  return (
    <button title="Import wishlist present in this website" onClick={handleClick} className="inline p-2 mx-auto rounded border">
      <Icon path={mdiTrayArrowUp} className="mx-auto w-12 h-12" />
    </button>
  );
};
