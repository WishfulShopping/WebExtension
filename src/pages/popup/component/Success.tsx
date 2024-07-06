import { DataProvider } from "react-admin";
import { Bookmark, Wishlist } from "../types";
import { useEffect, useState } from "react";
import { Pouch } from "./Pouch";

export const Success = ({bookmark, dataProvider, wishlist}:{bookmark:Bookmark, dataProvider:DataProvider, wishlist:Wishlist}) => {

  const [response, setResponse] = useState<{status:string, title?:string}>();

  useEffect(() => {
    dataProvider.create(wishlist.id as string, {data:bookmark}).then(() => {
      setResponse({status:"Done"})
     }).catch((e) => {
       setResponse({ title: e.message, status: "Error" })
    })
  }, [bookmark]);
  
  if (!response) {
    return (
      <div className="bg-gray-300 w-52 h-16 font-semibold rounded-md  text-white">
        <span className="text-center align-bottom">
        Adding {bookmark.url} to the wishlist {wishlist.name}
        </span>
      </div>
    );
  }
  
  return <div className="bg-gray-300 w-52 h-16 font-semibold rounded-md  text-white">
    <span className="text-center align-bottom">
      { response.status } { response.title }
    </span>
    <Pouch wishlist={wishlist} dataProvider={dataProvider} refresh={false}/>
  </div>;
}
