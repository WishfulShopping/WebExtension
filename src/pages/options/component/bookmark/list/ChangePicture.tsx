import { Button, useDataProvider, useResourceContext, useRefresh } from 'react-admin';
import { Refresh } from '@mui/icons-material'; 
import { Bookmark } from '@src/pages/popup/types';

export const ChangePicture  = ({
    record
}:{record:Bookmark}) => {
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const doRefresh = useRefresh();
    const swapPicture = async () => {
        if (!record.images) {
            return;
        }

        record.image = record.images.shift();
        record.images.push(record.image)
        delete record._rev;
        
        await dataProvider.update(resource, {id: record.id, data: record, previousData: null});
        doRefresh();
    }
    return (
        <Button onClick={swapPicture} style={{float:"right", margin: "-2em -2em 0em 0em", minWidth:"1em"}} ><Refresh titleAccess="Swap with another picture" /></Button>
    );
}