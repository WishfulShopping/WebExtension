import rules from './action/add';

// wait sendMessage and apply all extraction rules
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "wishfullshopping.add") {
    const pairs = rules.reduce(
      (current, rule:(current: {x:string}[][]) => {x:string}[][]) => {
      try { 
        current.push(rule(current)); 
      } catch (e) {
        console.error(e)} return current;
      } , 
      []).flat();
      sendResponse(Object.fromEntries(pairs));
    }
});
