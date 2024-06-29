
export type Wishlist = { 
    id?: string,
    name: string,
    need_authentification: boolean,
    url: string,
    username: string,
    password: string,
};

export type Bookmark = { 
    [x:string]:string
};