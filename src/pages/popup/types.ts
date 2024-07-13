
export type Wishlist = { 
    id?: string,
    name: string,
    need_authentification: boolean,
    url: string,
    username: string,
    password: string,
};

export type BookmarkKeyValues = { 
    [x:string]:string
};

export type Bookmark = BookmarkKeyValues & { 
    images?:string[]
};