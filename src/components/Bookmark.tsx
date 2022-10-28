import { useEffect, useState } from "react";
import type Types from "src/types";

export const Bookmark = (props: { bookmark: Types.Bookmark, origin: string }) => {
  const [response, setResponse] = useState<any>();
  const bookmark = props.bookmark;

  useEffect(() => {
    const body = new FormData();
    body.append('url', bookmark.url);
    body.append('html', bookmark.html);
    bookmark.images.forEach(e => { return body.append('images', e) });

    fetch(props.origin, {
        method: 'POST',
        body
    })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json()
    }).then((response) => {
      response.status = "Done";
      setResponse(response)
     }).catch((e) => {
       setResponse({ title: e.message, status: "Error" })
    })
  }, [bookmark, props.origin]);
  
  if (!response) {
    return (
      <div>
        Adding {bookmark.url} to the wishlist
      </div>
    );
  }
  
  return <div>{ response.status }<p>{ response.title }</p></div>;
}
