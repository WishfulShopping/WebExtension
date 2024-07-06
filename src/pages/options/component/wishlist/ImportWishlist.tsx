import { useCreate, Button } from 'react-admin';
import { useRedirect } from 'react-admin';

import { WishlistForm } from './WishlistForm';
import {
    FieldValues
} from 'react-hook-form';
import { Upload } from '@mui/icons-material';
import { useEffect } from 'react';

export const ImportWishlistLink = () => {
    return (<Button label="Import a wishlist from the web" href="#/import"><Upload/></Button>);
}

export const ImportWishlist = () => {
    const [create] = useCreate();
    const redirect = useRedirect();
    const createWishlist = (data:FieldValues) => {
        try {
            const url = new URL(data.url);
            data.id = url.pathname.replace(/^\/|\/$/g, '');
            if (!data.id) {
                throw "Database name is required in uri"
            }
            if (!data.name) {
                data.name = data.id;
            }
            create('wishlist', {data:data});
            redirect('/');
        } catch (e:{message:string}) {
            return Promise.reject(e.message);
        }
        
    };
    useEffect(()=>{
        const params = new URLSearchParams(document.location.search);
        if (create && params.has('url')) {
            try {
                const name = params.get('name') ?? "Imported";
                const url = new URL(params.get('url') as string);
                let result = create('wishlist', {
                    data:
                    {
                        name:name,
                        url:url.origin + url.pathname,
                        username:url.username,
                        password:url.password
                    }
                }, {returnPromise:true});
                if (!result || !result.then) {
                    result = Promise.resolve(false);
                }
                result.then((data)=>{
                    let hash = "#/wishlist";
                    if (data && data.id) {
                        hash = "#/" + data.id; 
                    }
                    document.location = document.location.origin + document.location.pathname + hash;
                })
            } catch (e) {
                console.error(e)
            }
        }
    }, [create]);
    return (
        <WishlistForm onSubmit={createWishlist}/>
    );
};