import React from 'react';
import { Circle, CloudOff } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import { Wishlist } from '../types';
import { DataProvider } from 'react-admin';

export function Pouch ({wishlist, dataProvider}:{wishlist:Wishlist, dataProvider:DataProvider}) {
  const [status, setStatus] = React.useState<string[]>([]);
  const [color, setColor] = React.useState<string>("info");
  const setLastStatuses = (info:string) => info ? setStatus(status => [ `[${new Date().toLocaleTimeString()}]  ${info}`, ...status]) : [];

  React.useMemo(() => {
    try {
      console.log("starting")
      console.log(dataProvider.info(wishlist.id))
      dataProvider.info(wishlist.id).then(function () {
        setLastStatuses('Locally connected');
        setColor('success');
      }).catch((e)=>{
        setLastStatuses(e.message);
        setColor('error');
      })


      if (typeof(wishlist.url) == "undefined" || !wishlist.url) {
        setLastStatuses('Sync is not setup');
        setColor('success');
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
        console.log(syncJob);
        ["denied",  "error"].forEach(eventName=>syncJob.on(eventName, (info:{[x:string]:string})=>{
          setLastStatuses(JSON.stringify({eventName, ...info}));
          setColor('error');
        }));
        ["paused", "change", "active", "complete"].forEach(eventName=>syncJob.on(eventName, (info:{[x:string]:string})=>{
          setLastStatuses(JSON.stringify({eventName, ...info}));
          setColor('success');
        }));
        syncJob.then(function () {
          setLastStatuses('Sync completed');
          setColor('success');
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
      {wishlist.url ? <Circle  color={color}/> : <CloudOff  />}
    </Tooltip>
    </>;
}
