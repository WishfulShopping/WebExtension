import Types from "src/types";

// You may need to use relative path import.
// import { } from "../constants";

// eslint-disable-next-line no-console
console.log("content script");

// If you want to get the DOM of the open page, you can do it here.
// document.querySelector("#some-id");

// wait sendMessage
chrome.runtime.onMessage.addListener((request: Types.Message, sender, sendResponse: (data: Types.Response) => void) => {
  const website = window.location.toString();
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


    sendResponse({ id: document.title, website: website, updatedAt: new Date(), data: body });
  } else if (request.action === "ImportWishlist") {
    const localStorageKey = "history";
    const history = JSON.parse(localStorage.getItem(localStorageKey) ?? "{}");
    chrome.storage.local.get([localStorageKey], (previous) => {
        // eslint-disable-next-line no-console
      const result = {...previous?.history};

      Object.entries(history).map(([key, value]) => { result[website.split('/list')[0] + key] = value });
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      chrome.storage.local.set({history: result}, ()=>{});
    });
    sendResponse({ id: "Wishlists", website: website, updatedAt: new Date() , data:  history});
  } else {
    sendResponse({ id: "No Action", website: website, updatedAt: new Date() });
  }
});

export {};
