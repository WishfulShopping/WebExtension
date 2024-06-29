import React from 'react';
import { Admin, Resource, ListGuesser, ShowGuesser, DataProvider, Create, Edit } from 'react-admin';
import startDataProvider from '../popup/lib/ra-data-local-sync-storage';

import { Settings } from '@mui/icons-material';
import { WishlistForm } from './component/wishlist/WishlistForm';

export default function Option(): JSX.Element {
  const [dataProvider, setDataProvider] = React.useState<DataProvider>();

  React.useEffect(() => {
    if (typeof(dataProvider) == "undefined") {
      setDataProvider(startDataProvider());
    }
  }, [dataProvider]);

  // hide the admin until the data provider is ready
  if (typeof (dataProvider) == "undefined") return <p>Loading...</p>;

  return <Admin dataProvider={dataProvider}>
    <Resource name="wishlist" icon={Settings} list={() => <ListGuesser exporter={false} />} edit={() => <Edit><WishlistForm /></Edit>} show={ShowGuesser} create={() => <Create><WishlistForm /></Create>} />
  </Admin>
}