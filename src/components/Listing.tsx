import { useEffect, useState } from "react";

export const Listing = () => {
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
  
  
  return <> {list.map(([url, name], key) => { return <li key={key}>{url as string} {name as string}</li> })} </>;
}
