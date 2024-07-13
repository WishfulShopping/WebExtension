import React, { ReactElement } from 'react';
import { WithListContext, Pagination, List } from 'react-admin';
import { Container, Typography } from '@mui/material';
import { PostFilterSidebar } from './list/PostFilterSidebar';
import { Product } from './list/Product';

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
                                <Product  key={product.id} product={product} resource={resource} />
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