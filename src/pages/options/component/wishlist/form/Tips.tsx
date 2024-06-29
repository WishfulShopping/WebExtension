import { Button} from 'react-admin';
import { useFormContext } from "react-hook-form";
import { TipsAndUpdates } from '@mui/icons-material';
import { Wishlist } from "../../../../popup/types";

export default function Tips({record}:{record:Wishlist}) {
    const form = useFormContext();
    return <Button title="Suggest a database name" onClick={()=>form.setValue("url", "http://127.0.0.1:5984/" + record.id)}><TipsAndUpdates/></Button>
}