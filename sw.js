const staticCacheName = 'static-v1';

const assets = [
  '/',
  '/index.html',
  '/css/demo.css',
  '/css/header.css',
  '/css/index.css',
  '/css/mainstyle.css',
  '/css/respo.css',
  '/css/main.css',
  '/images/5.png',
  '/images/tech2.jpg',
  '/algorithms/FCFS.html',
  '/algorithms/hrrn.html',
  '/algorithms/ljf.html',
  '/algorithms/lrtf.html',
  '/algorithms/pr.html',
  '/algorithms/RR.html',
  '/algorithms/SJF.html',
  '/algorithms/srtf.html',
  '/js/fcfs.js',
  '/js/hrrn.js',
  '/js/jquery.js',
  '/js/ljf.js',
  '/js/lrtf.js',
  '/js/pr.js',
  '/js/priority-queue.js',
  '/js/RR.js',
  '/js/sjf.js',
  '/js/srtf.js',
  '/readmore/about_us.html',
  '/readmore/fcfsinfo.html',
  '/readmore/priority.html',
  '/readmore/rrinfo.html',
  '/readmore/sjfinfo.html',
  '/readmore/srtfinfo.html',
  '/readmore/hrrninfo.html',
  '/readmore/ljfinfo.html',
  '/readmore/lrtfinfo.html',
  'https://fonts.googleapis.com/css?family=Lato:300,400,700',
]

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets)
      .catch(err=>{
        console.error("Error adding files to cache");
      });
    })
  );
  console.info("sw installed");
  self.skipWaiting();
});

// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
  // return self.ClientRectList.claim();
});

// When we change the name we could have multiple cache, to avoid that we need to delet the old cache, so with this function we check the key that is our cache naming, if it is different from the actual naming we delete it, in this way we will always have only the last updated cache.
// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});