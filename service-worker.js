const CACHE_NAME = "my-character-v1";

const CORE_FILES = [
    "./",

    "./index.html",

    "./manifest.json",

    "./css/style.css",
    "./css/layout.css",
    "./css/animation.css",

    "./src/config.js",
    "./src/main.js",

    "./src/managers/SceneManager.js",

    "./src/scenes/StartScene.js",
    "./src/scenes/HomeScene.js",
    "./src/scenes/MenuScene.js"
];

// Install

self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => cache.addAll(CORE_FILES))

    );

});

// Activate
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(keys =>

                Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            return caches.delete(key);

                        }

                    })

                )

            )

            .then(() => self.clients.claim())

    );

});

// ===============================
// Fetch
// ===============================

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request)

            .then(cacheResponse => {

                if (cacheResponse) {

                    return cacheResponse;

                }

                return fetch(event.request)

                    .then(networkResponse => {

                        if (
                            !networkResponse ||
                            networkResponse.status !== 200
                        ) {
                            return networkResponse;
                        }

                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(
                                    event.request,
                                    responseClone
                                );
                            });
                        return networkResponse;
                    });
            })
    );
});