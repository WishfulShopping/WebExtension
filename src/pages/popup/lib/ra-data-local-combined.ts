
import storageDataProvider from './ra-data-local-sync-storage';
import pouchDataProvider from './ra-data-local-pouch';

import { combineDataProviders, withLifecycleCallbacks, DataProvider  } from 'react-admin';

export default (): DataProvider => {

    const pouchProvider = pouchDataProvider();
    const storageProvider = storageDataProvider();


    return {
            ...withLifecycleCallbacks(combineDataProviders((resource) => {
            switch (resource) {
                case 'wishlist':
                    return storageProvider;
                default:
                    return pouchProvider;
            }
        }), [
            {
                resource: 'wishlist',
                afterDelete: async (params) => {
                    await pouchProvider.destroy(params.data.id);
                    return params;
                },
            },
        ]),
        info: pouchProvider.info.bind(pouchProvider),
        sync: pouchProvider.sync.bind(pouchProvider),
    };
}
