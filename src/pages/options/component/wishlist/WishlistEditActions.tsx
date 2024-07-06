// linking back to the list from the Edit view
import { TopToolbar, ShowButton, ShowContext, EditContext, EditButton } from 'react-admin';
import { useContext } from 'react';

export const WishlistEditActions = () => {
    const { record } = useContext(EditContext) ?? useContext(ShowContext);
    return (
    <TopToolbar>
        <ShowButton resource={record?record.id:'wishlist'}/>
        <EditButton/>
    </TopToolbar>
)};
