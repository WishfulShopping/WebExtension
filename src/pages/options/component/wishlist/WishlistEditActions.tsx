// linking back to the list from the Edit view
import { TopToolbar, ShowButton, useEditContext } from 'react-admin';

export const WishlistEditActions = (props) => {

    const { record } = useEditContext(props);
    return (
    <TopToolbar>
        <ShowButton resource={record?record.id:'wishlist'}/>
    </TopToolbar>
)};
