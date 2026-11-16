self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{
  let d={};try{d=e.data.json();}catch(_){d={title:'משלוחים',body:e.data?e.data.text():''};}
  e.waitUntil(self.registration.showNotification(d.title||'משלוחים',{
    body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:d.tag,renotify:true,
    requireInteraction:!!d.urgent,vibrate:d.urgent?[500,200,500,200,500,200,500]:[200,100,200],
    dir:'rtl',lang:'he',data:{url:d.url}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||self.registration.scope;
  e.waitUntil((async()=>{
    const cs=await clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of cs){if('focus' in c){await c.focus();try{if(c.url!==url)await c.navigate(url);}catch(_){}return;}}
    await clients.openWindow(url);
  })());
});
