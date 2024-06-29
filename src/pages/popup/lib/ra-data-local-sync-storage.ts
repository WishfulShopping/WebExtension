import {
    CreateParams,
    DataProvider,
    GetListParams,
    GetOneParams,
    GetListResult,
    GetManyParams,
    UpdateResult,
    GetManyReferenceParams,
    DeleteManyResult,
    DeleteParams,
    RaRecord,
    DeleteResult,
    UpdateParams,
    UpdateManyParams,
    DeleteManyParams,
    CreateResult
} from 'ra-core';
import { v4 as generateUid } from 'uuid';


/**
 * 
 * 
 * Based on implementation of official react-admin data queries using a localForage for storage.
 *
 * But use one indexed db per resource
 *
 */
export default (): DataProvider => {
    const storage = ((typeof browser !== 'undefined' && browser.storage) || (typeof chrome !== 'undefined' && chrome.storage)).local;

    /* eslint-disable @typescript-eslint/no-explicit-any */ 
    const DataProvider:DataProvider = {
        getList: <RecordType extends RaRecord = any>(
            resource: string,
            params: GetListParams
        ) => {
            const result: GetListResult<RecordType> = { data: [], total: 0 };
            return storage.get(resource).then((value: any) => {
                if (value && typeof(value[resource])!="undefined") {
                    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
                    result.data = Object.entries(value[resource]).map(([_, value]:[string, RecordType])=>value);
                    result.total = result.data.length;
                }
            }).then(()=>result);
        },
        getOne: (
            resource: string,
            params: GetOneParams<any>
        ) => storage.get(resource).then((value: any) => {
            if (value && typeof(value[resource])!="undefined"&&typeof(value[resource][params.id])!="undefined") {
                return {data:value[resource][params.id]};
            }
        }),
        getMany: function(
            resource: string,
            params: GetManyParams
        ) {
            const listParam:GetListParams = {filter:null, pagination:{page:1,perPage:1000}, sort:{field:"id", order:'DESC'}, ...params};
            return this.getList(resource, listParam);
        },
        getManyReference: function(
            resource: string,
            params: GetManyReferenceParams
        ) {
            const listParam:GetListParams = {...params};
            return this.getList(resource, listParam).then((result)=>{
                result.data = result.data.filter(row=>row[params.target] == params.id);
                result.total = result.data.length;
                return result;
            });
        },
        // update methods need to persist changes in localForage
        update: function<RecordType extends RaRecord = any>(
            resource: string,
            params: UpdateParams<RecordType>
        ) { 
            const paramsMany: UpdateManyParams<any> = {ids: [params.id], ...params};
            const result:UpdateResult = {data:{id:params.id, ...params.data}};
            return this.updateMany(resource, paramsMany)
                       .then(()=>{
                            return result
                        })
        },
        updateMany: (resource: string, params: UpdateManyParams<any>) => storage.get(resource).then((value: any) => {
            if (!value || typeof(value[resource])=="undefined") {
                value[resource] = {};
            }
            params.ids.map((id)=>{
                if (params.data._deleted) {
                    delete value[resource][id];
                    return;
                }
                if (typeof(value[resource][id])=="undefined") {
                    value[resource][id] = {id:id};
                }
                value[resource][id] = {...value[resource][id], ...params.data };
            });
            return storage.set(value).then(()=>{
                return {data: params.ids};
            })
        }),
        create: function (
            resource: string,
            params: CreateParams<RaRecord>
        ) {
            const id = params.data.id??`w${generateUid().substring(1)}`;
            const result:CreateResult = {data:{id:id, ...params.data}};
            const paramsMany: UpdateManyParams<any> = {ids: [id], data:params.data};
            return this.updateMany(resource, paramsMany)
                       .then(()=>{
                            return result
                        })
        },
        delete: function<RecordType extends RaRecord = any>(
            resource: string,
            params: DeleteParams<RecordType>
        ) { 
            const paramsMany: UpdateManyParams<any> = {data:{_deleted:true}, ids:[params.id], ...params};
            const result:DeleteResult = {data:{id:params.id}};
            return this.updateMany(resource, paramsMany)
                       .then(()=>{
                            return result
                        })
        },
        deleteMany: function (resource: string, params: DeleteManyParams<any>) { 
            const paramsMany: UpdateManyParams<any> = {data:{_deleted:true}, ...params};
            const result:DeleteManyResult = {data:params.ids};
            return this.updateMany(resource, paramsMany)
                       .then(()=>{
                            return result
                        })
        },
    };

    return DataProvider;
};

