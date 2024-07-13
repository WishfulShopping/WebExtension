import React from 'react';
import { Admin, Resource, ListGuesser, ShowGuesser, DataProvider, Create, Edit, GetListParams, CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";
import startDataProvider from '../popup/lib/ra-data-local-combined';

import { Settings } from '@mui/icons-material';
import { WishlistForm } from './component/wishlist/WishlistForm';
import { Wishlist } from '../popup/types';
import { BookmarkList } from './component/bookmark/BookmarkList';
import { ImportWishlist } from './component/wishlist/ImportWishlist';
import { WishlistListActions } from './component/wishlist/WishlistListActions';
import { WishlistEditActions } from './component/wishlist/WishlistEditActions';
import { Pouch } from '../popup/component/Pouch';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Droppable } from './component/bookmark/Droppable';
import { Bookmark } from '@src/pages/popup/types';

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
  
  const dropProduct = (dropEvent:DragEndEvent) => {
    if (!dropEvent.active || !dropEvent.over || !dataProvider ) {
      return;
    }
    const current = dropEvent.active.data.current as Bookmark;
    const id = dropEvent.over.id as string;
    if (!current || !id) {
      return;
    }
    delete current._rev;
    dataProvider.create(id, {data:current});
  }

  // hide the admin until the data provider is ready
  if (typeof (dataProvider) == "undefined") return <p>Loading...</p>;

  return  <DndContext onDragEnd={dropProduct}>
      <Admin dataProvider={dataProvider}>
      <Resource name="wishlist" icon={Settings} list={() => <ListGuesser actions={<WishlistListActions />} exporter={false} />} edit={() => <Edit actions={<WishlistEditActions  />}><WishlistForm /></Edit>} show={(props)=><ShowGuesser actions={<WishlistEditActions  />} {...props}/>} create={() => <Create><WishlistForm /></Create>} />
      <CustomRoutes>
        <Route path="/import" element={<ImportWishlist />} />
      </CustomRoutes>
      {wishlists.map(wishlist => <Resource  icon={()=><Droppable id={wishlist.id} ><Pouch wishlist={wishlist} dataProvider={dataProvider} refresh={true}/></Droppable>} key={wishlist.id} options={{ label: `Wishlist ${wishlist.name}` }} name={wishlist.id} list={BookmarkList}/>)}
    </Admin>
  </DndContext>
}