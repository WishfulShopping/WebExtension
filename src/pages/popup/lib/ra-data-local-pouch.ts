import {
    CreateParams,
    DataProvider,
    GetListParams,
    GetOneParams,
    GetManyParams,
    GetManyResult,
    UpdateResult,
    GetManyReferenceResult,
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
import PouchDB from 'pouchdb';
import PouchdbFind from 'pouchdb-find';
import { v4 as generateUid } from 'uuid';


/**
 * Respond to react-admin data queries using pouchdb for storage.
 *
 * Pouchdb uses the browser local indexdb.
 * 
 * This data can also be sync properly to a couchdb remote server.
 */
export default (): DataProvider => {
    const connection: { [key: string]: PouchDB.Database } = {};
    PouchDB.prefix = '';
    PouchDB.plugin(PouchdbFind);
    const getStoreByName = (resource:string, options?: PouchDB.Configuration.DatabaseConfiguration) => {
        if (typeof(connection[resource]) == "undefined") {
            connection[resource] = new PouchDB(resource, options);
        }
        return connection[resource];
    };

    /* eslint-disable @typescript-eslint/no-explicit-any */ 
    return {
        getList: (
            resource: string,
            params: GetListParams
        ) => {
            const page = (params.pagination && params.pagination.page != null) ? params.pagination.page : 1
            const perPage = (params.pagination && params.pagination.perPage != null) ? params.pagination.perPage : 10
            let field = (params.sort && params.sort.field != null) ? params.sort.field : "_id"
            const query = {};
            const order = (params.sort && params.sort.order != null) ? params.sort.order : "ASC"

            if (field === 'id') field = '_id'
            if(params.filter) {
                for (const [key, value] of Object.entries(params.filter)) {
                    if (typeof( query.selector) == "undefined") {
                        query.selector = {};
                    }
                    if (value) {
                        query.selector[key] = { $regex: value }
                    }
                }
            }
            
            let search;
            if (typeof (query.selector) != "undefined") {
                    search = getStoreByName(resource).find({
                        ...query,
                        sort: [{[field]: (order.toLowerCase())}],
                    }).then(manyResp=>{return {
                        total : manyResp.docs.length,
                        data : manyResp.docs.slice((page - 1) * perPage, page * perPage)
                    }});
            } else {
                search = getStoreByName(resource).allDocs({
                    include_docs: true, limit: perPage, skip: ((page - 1) * perPage)}).then((manyResp)=>{
                        return {total:manyResp.total_rows, data:manyResp.rows.filter(row=>row.doc!=null&&typeof(row.doc)!="undefined").map(row=>row.doc)};
                    })
            }
            return search;
        },
        getOne: <RecordType extends RaRecord = any> (
            resource: string,
            params: GetOneParams<any>
        ) => getStoreByName(resource)
                    .get<RecordType>(params.id)
                    .then(data=>{
                        if (data==null)
                            throw "ID not found";
                        return {data:data};
                    }),
        getMany: <RecordType extends RaRecord = any>(
            resource: string,
            params: GetManyParams
        ) => {
            const result: GetManyResult<RecordType> = { data: [] };
            return getStoreByName(resource).allDocs({
                include_docs: true,
                keys: params.ids.map(id=>`${id}`)}).then((manyResp)=>{
                    result.data = manyResp.rows.filter(row=>row.doc!=null&&typeof(row.doc)!="undefined").map(row=>row.doc);
                    return result;
                });
        },
        getManyReference: (
            resource: string,
            params: GetManyReferenceParams
        ) => {
            return getStoreByName(resource).find({
                selector: {[params.target]: params.id}
            }).then(manyRefResp=>{
                const result: GetManyReferenceResult = { data: manyRefResp.docs};
                return result;
            });
        },
        // update methods need to persist changes in localForage
        update: (
            resource: string,
            params: UpdateParams<any>
        ) => getStoreByName(resource)
                .get<RaRecord>(params.id)
                .then(doc=>getStoreByName(resource).put({...doc, ...params.data}).then(()=>doc))
                .then((doc)=>{
                    const result:UpdateResult = {data:doc};
                    return result;
                })
        ,
        updateMany: (resource: string, params: UpdateManyParams<any>) => Promise.all(params.ids.map(async (id) => {
                const doc = await getStoreByName(resource).get<RaRecord>(`${id}`);
                await getStoreByName(resource).put({...doc, ...params.data});
                return id;
            })).then(()=>{
                return {data: params.ids};
            }
        ),
        create: (
            resource: string,
            params: CreateParams<RaRecord>
        ) => {
            const uid = generateUid();
            if (!params.data.id) {
                params.data.id = uid
            }
            params.data._id = params.data.id
            const result:CreateResult = {data:{_id:generateUid(), ...params.data}};
            return getStoreByName(resource)
                    .put(params.data)
                    .then(()=>{return result;})
        },
        delete: <RecordType extends RaRecord = any>(
            resource: string,
            params: DeleteParams<RecordType>
        ) => getStoreByName(resource)
                .get<RaRecord>(`${params.id}`)
                .then(doc=>getStoreByName(resource).remove(doc))
                .then(()=>{
                    const result:DeleteResult = {data:{id:params.id}};
                    return result;
        }),
        deleteMany: (resource: string, params: DeleteManyParams<any>) => Promise.all(
                params.ids.map((id: any) => getStoreByName(resource)
                    .get<RaRecord>(`${id}`)
                    .then(doc=>getStoreByName(resource).remove(doc))
            )).then(()=>{
                const result:DeleteManyResult = {data:params.ids};
                return result;
            }),
        destroy: (resource: string) =>getStoreByName(resource).destroy(),
        info: (resource: string, options?: PouchDB.Configuration.DatabaseConfiguration) => getStoreByName(resource, options).info(),
        sync: (localResource: string, remoteResource: string, options?: PouchDB.Configuration.DatabaseConfiguration) => {
            return getStoreByName(localResource).sync(getStoreByName(remoteResource, options), {live: true})
        }
    };
};

export interface LocalForageDataProviderParams {
    defaultData?: any;
    prefixLocalForageKey?: string;
    loggingEnabled?: boolean;
}
