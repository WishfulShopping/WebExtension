import React from 'react';
import { Admin, Resource, ListGuesser, ShowGuesser, DataProvider, Create, Edit, GetListParams, CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";
import startDataProvider from '../popup/lib/ra-data-local-combined';

import { Settings } from '@mui/icons-material';
import { WishlistForm } from './component/wishlist/WishlistForm';
import { Wishlist } from '../popup/types';
import { BookmarkList } from './component/wishlist/bookmark/BookmarkList';
import { ImportWishlist } from './component/wishlist/ImportWishlist';
import { WishlistListActions } from './component/wishlist/WishlistListActions';

export default function Option(): JSX.Element {
  const [dataProvider, setDataProvider] = React.useState<DataProvider>();
  const [wishlists, setWishlists] = React.useState<Wishlist[]>([]);

  React.useEffect(() => {
    if (typeof(dataProvider) == "undefined") {
      setDataProvider(startDataProvider());
    } else {
      const listParam:GetListParams = {filter:null, pagination:{page:1,perPage:1000}, sort:{field:"id", order:'DESC'}};
      dataProvider.getList("wishlist", listParam).then(result=>setWishlists(result.data));
    }
  }, [dataProvider]);

  // hide the admin until the data provider is ready
  if (typeof (dataProvider) == "undefined") return <p>Loading...</p>;

  return <Admin dataProvider={dataProvider}>
    <Resource name="wishlist" icon={Settings} list={() => <ListGuesser actions={<WishlistListActions />} exporter={false} />} edit={() => <Edit><WishlistForm /></Edit>} show={ShowGuesser} create={() => <Create><WishlistForm /></Create>} />
    <CustomRoutes>
        <Route path="/import" element={<ImportWishlist />} />
    </CustomRoutes>
    {wishlists.map(wishlist => <Resource key={wishlist.id} options={{ label: `Wishlist ${wishlist.name}` }} name={wishlist.id} list={BookmarkList}/>)}
  </Admin>
}