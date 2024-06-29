import { Bookmark } from "../types";

export const Success = ({bookmark}:{bookmark:Bookmark}) => {
 
  
  return <div className="bg-gray-300 w-52 h-16 font-semibold rounded-md  text-white">
    <pre className="text-center align-bottom">
      {JSON.stringify(bookmark, null,  4)}
    </pre>
  </div>;
}
