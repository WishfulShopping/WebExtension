import { SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem, useDataProvider, useResourceContext } from 'react-admin';
import { Card, CardContent } from '@mui/material';
import { LocalOffer } from '@mui/icons-material';
import { useMemo, useState } from 'react';

export const PostFilterSidebar = () => {
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const [filterItems, setFilterItem] = useState({});
    useMemo(()=>{
        if (resource) {
            dataProvider.getList(resource, {pagination:{page:1,perPage:1000}})
                        .then(({data}) => data.map(product=>product?.url?.match(/[^(?:http://|www.|https://)]([^/]+)/i)[0]).filter(id=>id))
                        .then((data)=>{
                            setFilterItem({
                                url:Object.groupBy(data, url => url),
                            });
                        })
        }
    }, [dataProvider, resource]);
    return (
        <Card sx={{ mb:6, mr:1, order: -1, width: "20%", display: { xs: "none", sm: "none", md :"block" }}}>
            <CardContent>
                <SavedQueriesList />
                <FilterLiveSearch source="title" />
                {Object.keys(filterItems).map((attributeCode, rowId) => {
                    return (<FilterList key={rowId} label={attributeCode} icon={<LocalOffer />}>
                         {Object.entries(filterItems[attributeCode]).map(([value, stats], filterRowId) => {
                            const valueObject = {};
                            valueObject[attributeCode] = value;
                            return (<FilterListItem value={valueObject} key={filterRowId} label={value + ` (${stats.length})`} /> )})
                }
                </FilterList>)})}
            </CardContent>
        </Card>
    );
}