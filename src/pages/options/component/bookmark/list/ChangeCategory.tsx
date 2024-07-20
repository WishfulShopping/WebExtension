import { useDataProvider, useResourceContext, useRefresh } from 'react-admin';
import {  Chip } from '@mui/material';
import { Bookmark } from '@src/pages/popup/types';
import React, { useState } from 'react';

export const ChangeCategory  = ({
    record
}:{record:Bookmark}) => {
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const doRefresh = useRefresh();
    const swapCategory = async (value:string) => {
        value = value.replace(/[^a-zA-Z0-9]/g, "").substring(0,14);
        if (value == record.category) {
            return;
        }

        record.category = value;
        
        await dataProvider.update(resource, {id: record.id, data: record, previousData: null});
        doRefresh();
    }
    return (
        <div className={`change-category-chip${record.category}`}><Chip label={<form onSubmit={(e)=> {e.preventDefault(); swapCategory(e.target[0].value);}} ><input onBlur={({target:{value}})=> swapCategory(value) } type="text" name="category" defaultValue={record.category}  style={{background:'transparent', border:'none', color: 'rgb(25, 118, 210)', width:'100%', textAlign: 'center', fontWeight:'bold', filter: "drop-shadow(1px 1px rgba(250, 250, 250, 0.5)) contrast(1)" }}/></form>}></Chip></div>
    );
}