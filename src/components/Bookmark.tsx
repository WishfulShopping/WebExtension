import type Types from "src/types";

export const Bookmark = (props: { bookmark: Types.Bookmark }) => {
    return (
      <div>
        Adding {props.bookmark.url} to the wishlist
      </div>
    );
}
