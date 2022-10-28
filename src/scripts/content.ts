import Types from "src/types";

// You may need to use relative path import.
// import { } from "../constants";

// eslint-disable-next-line no-console
console.log("content script");

// If you want to get the DOM of the open page, you can do it here.
// document.querySelector("#some-id");

// wait sendMessage
chrome.runtime.onMessage.addListener((request: Types.Message, sender, sendResponse: (data: Types.Response)=>void) => {
  if (request.action === "getId") {
    // eslint-disable-next-line no-console
    console.log("onMessage: ", request, sender, sendResponse);
    
    const body = {} as Types.Bookmark;
    body.url = window.location.toString();
    body.html = document.documentElement.outerHTML;
    body.images = [];
    [].slice.call(document.images).map( (img: Types.Image) =>{
        img.area = img.naturalHeight*img.naturalWidth;
        return img;
    }).filter(img=>{
        return img.area>10000;
    }).sort((a:Types.Image, b:Types.Image)=>{
        return b.area - a.area;
    }).slice(
        0, 20
    ).map(img=>{
        return img.src;
    }).forEach((e) => body.images.push(e));


    sendResponse({ id: document.title, updatedAt: new Date(), data: body });
  } else {
    sendResponse({ id: "No Action", updatedAt: new Date() });
  }
});

export {};
