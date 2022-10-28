namespace Types {
  export type Image = {
    area: number;
    src: string;
    naturalHeight: number; 
    naturalWidth: number; 
  };
  export type Message = {
    action: string;
  };

  export type Response = {
    id: string;
    website: string;
    updatedAt: Date;
    data?: Bookmark|Wishlist;
    error?: string;
  };

  export type Bookmark = {
    url: string;
    html: string;
    images: string[];
  }

  export type Wishlist = any;
};


export default Types;