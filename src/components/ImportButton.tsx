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
    <button onClick={handleClick} className="block p-2 mx-auto rounded border">
      Import wishlist present in this website
    </button>
  );
};
