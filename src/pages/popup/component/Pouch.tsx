import React from 'react';
import { Circle, CloudOff } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress'; 
import Tooltip from '@mui/material/Tooltip';
import { Wishlist } from '../types';
import { DataProvider, useRefresh } from 'react-admin';

export function Pouch ({wishlist, dataProvider, refresh}:{wishlist:Wishlist, dataProvider:DataProvider, refresh:boolean}) {
  const [status, setStatus] = React.useState<string[]>([]);
  const [color, setColor] = React.useState<string>("");
  const setLastStatuses = (info:string) => info ? setStatus(status => [ `[${new Date().toLocaleTimeString()}]  ${info}`, ...status]) : [];

  // eslint-disable-next-line  @typescript-eslint/no-empty-function
  let doRefresh = ()=>{};
  if (refresh) {
    doRefresh = useRefresh();
  }
  React.useMemo(() => {
    try {
      dataProvider.info(wishlist.id).then(function () {
        setLastStatuses('Locally connected');
      }).catch((e)=>{
        setLastStatuses(e.message);
        setColor('error');
      })


      if (typeof(wishlist.url) == "undefined" || !wishlist.url) {
        setLastStatuses('Sync is not setup');
        return;
      }

      setTimeout(() => {

        const options:{auth?:{username:string, password:string}} = {};
        if (wishlist.need_authentification) {
          options.auth = {username:wishlist.username, password:wishlist.password};
        }
        

        dataProvider.info(wishlist.url, options).then(function () {
          setLastStatuses('Remotely connected');
          setColor('success');
        }).catch((e)=>{
          setLastStatuses(e.message);
          setColor('error');
        })
        const syncJob = dataProvider.sync(wishlist.id, wishlist.url, options);
        setColor("");
        ["denied",  "error"].forEach(eventName=>syncJob.on(eventName, (info:{[x:string]:string})=>{
          setLastStatuses(JSON.stringify({eventName, ...info}));
          setColor('error');
        }));
        ["paused", "change", "active", "complete"].forEach(eventName=>syncJob.on(eventName, (info:{[x:string]:string})=>{
          setLastStatuses(JSON.stringify({eventName, ...info}));
        }));
        syncJob.then(function () {
          setLastStatuses('Sync completed');
          setColor('success');
          doRefresh();
        }).catch((e:{message:string})=>{
          setLastStatuses(e.message);
          setColor('error');
        })
      }, 3000);



  } catch (e:{message:string}) {
    setLastStatuses(e.message);
    setColor( 'error');
  }
  }, [wishlist]);


  return <>
    <Tooltip title={<pre>{status.join('\n')}</pre>}>
    {wishlist.url ? (color ? <Circle  color={color}/> : <CircularProgress style={{width:"1.2em", height:"1.2em"}}/>) : <CloudOff  />}
    </Tooltip>
    </>;
}
