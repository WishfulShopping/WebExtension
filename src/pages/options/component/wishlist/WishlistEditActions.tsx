// linking back to the list from the Edit view
import { TopToolbar, ShowButton, ShowContext, EditContext, EditButton, Button } from 'react-admin';
import { useContext } from 'react';
import { Share } from '@mui/icons-material';

export const WishlistEditActions = () => {
    const { record } = useContext(EditContext) ?? useContext(ShowContext);
    const share = () => {
        const url = new URL(record.url);
        let optionalPassword = "";
        if (record.need_authentification) {
            optionalPassword = `${record.username}:${record.password}@`
        }
        const share = `https://wishfulshopping.github.io/WebExtension/?url=${url.protocol}//${optionalPassword}${url.hostname}${url.pathname}#/import`;
        window.location.href = `mailto:?body=Have a look at <a href="${share}">My wishlist ${record.name}</a>`;
    }
    return (
    <TopToolbar>
        <ShowButton resource={record?record.id:'wishlist'}/>
        <EditButton/>
        <Button onClick={share}><><Share/> Share</></Button>
    </TopToolbar>
)};
