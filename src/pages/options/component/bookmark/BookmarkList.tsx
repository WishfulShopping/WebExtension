import React, { ReactElement } from 'react';
import { WithListContext, DeleteWithConfirmButton, Pagination, List } from 'react-admin';
import { Card, CardContent, Container, Typography, CardActionArea } from '@mui/material';
import { PostFilterSidebar } from './list/PostFilterSidebar';
const cardStyle = {
    width: "30%",
    minHeight: 300,
    margin: '0.5em',
    display: 'inline-block',
    verticalAlign: 'top'
};
export const BookmarkList  = ({
    title,
    filters,
    resource
}:{
    title:ReactElement,
    filters:ReactElement,
    resource:string}) => (
    <List 
        title={title}
        aside={<PostFilterSidebar resource={resource}/>}
        filters={filters}
        actions={<></>}
        exporter={false}
        perPage={9}
        pagination={<Pagination rowsPerPageOptions={[6, 9, 12, 15]} />
    }>
        <Container>
            <WithListContext render={({ isLoading, data }) => (
                    !isLoading && typeof(data) != "undefined" && (<>
                            {data.map(product => (
                                <Card key={product.id}  style={Object.assign({}, cardStyle)}>
                                    <CardContent style={{minHeight:cardStyle.minHeight, float:"left", width: "50%", backgroundImage: `url("${product.image ?? product["og:image"]}")`, backgroundSize: "cover", backgroundPosition:"center", backgroundRepeat:"no-repeat"}}>
                                    </CardContent>                                    
                                                                
                                    <CardActionArea href={product.url} style={{width: "50%", marginLeft:"51%"}}>
                                            <Typography style={{fontWeight:"bold", filter: "drop-shadow(1px 1px rgba(250, 250, 250, 0.5)) contrast(1)" , overflow: "hidden", height:"10em"}}>{product.title}</Typography>
                                            
                                            <CardContent >
                                            {product.price && Intl.NumberFormat(navigator.language??"en-US", {style: 'currency', currency: product.currency??"EUR"}).format(product.price)}
                                            </CardContent>
                                    </CardActionArea>
                                    <DeleteWithConfirmButton resource={resource} record={product}/>
                                </Card>
                            ))}
                            </>
                    )
                )} />
            <WithListContext render={({ isLoading, total }) => (
                !isLoading && <Typography>{total} results</Typography>
            )} />
            </Container>
    </List>
);