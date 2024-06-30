import { useCreate, Button } from 'react-admin';
import { useRedirect } from 'react-admin';
import { WishlistForm } from './WishlistForm';
import {
    FieldValues
} from 'react-hook-form';
import { Upload } from '@mui/icons-material';

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
            create('wishlist', {data:data})
            redirect('/');
        } catch (e:{message:string}) {
            return Promise.reject(e.message);
        }
        
    };
    return (
        <WishlistForm onSubmit={createWishlist}/>
    );
};