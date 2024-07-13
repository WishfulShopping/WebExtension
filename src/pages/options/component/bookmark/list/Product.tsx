import { DeleteWithConfirmButton} from 'react-admin';
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { WavingHand } from '@mui/icons-material';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import { Bookmark } from '@src/pages/popup/types';
import { ChangePicture } from './ChangePicture';

const cardStyle = {
    width: "30%",
    minHeight: 300,
    margin: '0.5em',
    display: 'inline-block',
    verticalAlign: 'top'
};
export const Product  = ({
    product,
    resource
}:{product:Bookmark, resource:string}) => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: product.id,
        data:product
    });
    return (
        <Card style={Object.assign({transform: CSS.Translate.toString(transform)}, cardStyle)}>
            <CardContent style={{minHeight:cardStyle.minHeight, float:"left", width: "50%", backgroundImage: `url("${product.image ?? product["og:image"]}")`, backgroundSize: "cover", backgroundPosition:"center", backgroundRepeat:"no-repeat"}}>
                <div style={{cursor:'grab', margin: "-1em 0em 0em -1em", textAlign:"right"}} ref={setNodeRef} {...listeners} {...attributes} ><WavingHand titleAccess="Drag to another wishlist" style={{height:"0.6em", color:"rgb(25, 118, 210)"}} /></div>
                <ChangePicture record={product}/>
            </CardContent>                                    
                                        
            <CardActionArea href={product.url} style={{width: "50%", marginLeft:"51%"}}>
                    <Typography style={{fontWeight:"bold", filter: "drop-shadow(1px 1px rgba(250, 250, 250, 0.5)) contrast(1)" , overflow: "hidden", height:"10em"}}>{product.title}</Typography>
                    
                    <CardContent >
                    {product.price && Intl.NumberFormat(navigator.language??"en-US", {style: 'currency', currency: product.currency??"EUR"}).format(product.price)}
                    </CardContent>
            </CardActionArea>
            <DeleteWithConfirmButton resource={resource} record={product}/>
        </Card>
                           
    );
}