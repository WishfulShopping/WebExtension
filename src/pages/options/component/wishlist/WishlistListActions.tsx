
import { TopToolbar, CreateButton } from "react-admin";
import { ImportWishlistLink } from "./ImportWishlist";

export const WishlistListActions = () => (
<TopToolbar>
        <CreateButton label="Create a new wishlist" resource="wishlist"/>
        <ImportWishlistLink/>
</TopToolbar>
);
