import React from "react";
import { Settings, Visibility } from '@mui/icons-material';
import { AddCurrentTab } from './component/AddCurrentTab';
import { DataProvider, GetListParams  } from 'react-admin';
import startDataProvider from './lib/ra-data-local-combined';
import { Wishlist } from "./types";

export default function Popup(): JSX.Element {
  const [wishlists, setWishlists] = React.useState<Wishlist[]>([]);
  const [dataProvider, setDataProvider] = React.useState<DataProvider>();

  React.useEffect(() => {
    if (typeof(dataProvider) == "undefined") {
      setDataProvider(startDataProvider());
    } else {
      const listParam:GetListParams = {filter:null, pagination:{page:1,perPage:1000}, sort:{field:"id", order:'DESC'}};
      dataProvider.getList("wishlist", listParam).then(result=>{
        if (result.data.length==0) {
          const defaultWishlist = {name:"Default", need_authentification: false, url:"", username:"", password:""};
          dataProvider.create("wishlist", {data: defaultWishlist});
          result.data.push(defaultWishlist);
        }
        return result;
      }).then(result=>setWishlists(result.data));
    }
  }, [dataProvider]);
  return (
    <div className="flex font-sans">
      <div className="flex-auto p-6">
        <div className="flex flex-wrap">
          <h1 className="flex-auto text-lg font-semibold text-slate-900">
            Wishful Shopping
          </h1>
          <div className="text-lg font-semibold text-slate-500">
            <a
              href="/options/index.html"
              target="_blank"
              rel="noopener noreferrer"
              title="View options"
              style={{ float: "right" }}
            >
              <Settings className="hover:text-gray-600" />
            </a>
          </div>
          <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2 p-1">
            <span>Bookmark this page into a wishlist</span>
          </div>
        </div>
        {wishlists.map(wishlist => <>
          <div className="flex space-x-1 mb-6 text-sm font-medium">
            <AddCurrentTab wishlist={wishlist} dataProvider={dataProvider}/>
            <div className="flex-col">
              <a
                href={`/options/index.html#/${wishlist.id}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View wishlist content"
              >
                <Visibility className="hover:text-gray-600" />
              </a>
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
}
