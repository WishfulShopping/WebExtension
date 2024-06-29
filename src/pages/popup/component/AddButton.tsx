import React from "react";
import { useState } from "react";
import { Success } from "./Success";
import { Wishlist } from "../types";
import { DataProvider } from "react-admin";

export const AddButton = ({currentTab, wishlist, dataProvider} : {currentTab: number, wishlist: Wishlist, dataProvider:DataProvider}) => {
  const [bookmark, setBookmark] = useState();


  const handleClick = () => {
    // content script communication
    if (!currentTab) {
      return <>No tab detected</>;
    }
    chrome.tabs.sendMessage(currentTab, { action: "wishfullshopping.add" }, (res) => {
        setBookmark(res);
    });
   
  };

  if (!bookmark) return (
    <button className="hover:bg-gray-600 bg-gray-500 w-52 h-16 font-semibold rounded-md text-white"  title="Add this page as wish" onClick={handleClick} onKeyDown={handleClick} >
       Add to {wishlist.name}
    </button>

  );

  return (
    <Success  wishlist={wishlist} bookmark={bookmark} dataProvider={dataProvider}/>
  );
};
