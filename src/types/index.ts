namespace Types {
  export type Image = {
    area: number;
    src: string;
    naturalHeight: number; 
    naturalWidth: number; 
  };
  export type Message = {
    action: "getId";
  };

  export type Response = {
    id: string;
    updatedAt: Date;
    data?: Bookmark;
    error?: string;
  };

  export type Bookmark = {
    url: string;
    html: string;
    images: string[];
  }
};


export default Types;