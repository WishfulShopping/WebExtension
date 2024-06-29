import { SimpleForm, TextInput, PasswordInput, BooleanInput , FormDataConsumer} from 'react-admin';
import {
    useEditContext
} from 'ra-core';
import Tips from './form/Tips';
import { useLocation } from 'react-router-dom';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const WishlistForm = (props:any) => {

        const location = useLocation();
        const showSyncUrlOnImport = location && location.pathname== '/import';

        let record;
        try {
            const context = useEditContext(props);
            record = context.record;
        } catch {
            // eslint-disable-next-line  no-empty
        }
        const showSyncUrlOnEdit = record && record.id;

        const showSync = showSyncUrlOnImport || showSyncUrlOnEdit
        return (
            <SimpleForm {...props}>
                <TextInput source="name" label="Wishlist name" />
                { showSync && (<fieldset style={{backgroundColor: 'aliceblue', border: 'none'}} >
                    <label>Synchronisation setup </label>
                    <div>
                        <TextInput style={{display: 'inline', float: 'left'}} source="url" label="Url of a couchdb server to sync with" placeholder={"http://127.0.0.1:5984/my-database-1234-4567"}/>
                        { record && (<Tips record={record} />) }
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <BooleanInput source="need_authentification" />
                    <FormDataConsumer<{ need_authentification: boolean }>>
                    {({ formData }) => formData.need_authentification && (<>
                        <TextInput source="username" label="Username"/>
                        <PasswordInput source="password" label="Password"/>
                    </>)}
                    </FormDataConsumer>
                </fieldset>)}
            </SimpleForm>
    );
}