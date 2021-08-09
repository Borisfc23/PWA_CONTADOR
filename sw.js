const CACHE_ELEMENTS = [
    "./", //cachear la pagina de inicio
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./Components/Contador.js",
    "./style.css"
]

const CACHE_NAME = "v1_cache_contador_react"
//Nota el self es similar al this

/*=========== Instalar el Service worker  ============*/
self.addEventListener("install",(e)=>{
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>{
            cache.addAll(CACHE_ELEMENTS).then(()=>{
                self.skipWaiting()
            }).catch(err=>console.log(err))
        })
    )
});

/*=========== Activar el Service Worker  ============*/
self.addEventListener('activate',(e)=>{
    const cacheWhiteList = [CACHE_NAME]
    e.waitUntil(
        caches.keys().then((cacheNames)=>{
            return Promise.all(cacheNames.map((cacheName)=>{
                /*=========== Elimina caches repetidas  ============*/
                return(                                 //los && transformar el operador ternario en solo valor positico osea solo si cumple
                    cacheWhiteList.indexOf(cacheName)===-1 && caches.delete(cacheName)
                )
            }))
        }).then(()=>self.clients.claim())
    )
});


self.addEventListener("fetch",(e)=>{    
    e.respondWith(
        caches.match(e.request).then((res)=>{
            if(res){
                return res
            }else{
                return fetch(e.request);
            }
        })
    )
});