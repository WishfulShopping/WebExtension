import React from 'react';
import { Admin, Resource, ListGuesser, ShowGuesser, DataProvider, Create, Edit, GetListParams } from 'react-admin';
import startDataProvider from '../popup/lib/ra-data-local-combined';

import { Settings } from '@mui/icons-material';
import { WishlistForm } from './component/wishlist/WishlistForm';
import { Wishlist } from '../popup/types';

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
    <Resource name="wishlist" icon={Settings} list={() => <ListGuesser exporter={false} />} edit={() => <Edit><WishlistForm /></Edit>} show={ShowGuesser} create={() => <Create><WishlistForm /></Create>} />
    {wishlists.map(wishlist => <Resource key={wishlist.id} options={{ label: `Wishlist ${wishlist.name}` }} name={wishlist.id} list={ListGuesser}/>)}
  </Admin>
}