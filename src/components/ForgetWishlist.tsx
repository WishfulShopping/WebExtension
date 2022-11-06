
export const ForgetWishlist = (props: { url: string }) => {

  const handleClick = () => {
    chrome.storage.local.get(["history"], (previous) => {
      const result = {...previous?.history};

      delete result[props.url];
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      chrome.storage.local.set({history: result}, ()=>{});
    });
  };

  return <button title="Forget Wishlist" onClick={handleClick} className="w-8 h-8  ml-4 rounded border  hover:bg-rose-600">
    x
  </button>;
};
