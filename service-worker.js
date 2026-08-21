const CACHE = 'ics-v6-test-v5';

const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'NW_001_Ich_darf_Mensch_sein.png',
  'NW_002_Ich_bin_richtig_wertvoll_und_liebevoll.png',
  'NW_003_Ich_darf_wachsen_und_lernen.png',
  'NW_004_Ich_wähle_mich_und_lebe_im_meiner_Wahrheit.png',
  'NW_005_Ich_bin_genau_richtig_so_wie_ich_bin.png',
  'NW_006_Erfolg_darf_leicht_erfüllt_und_im_Einklang_sein.png',
  'NW_007_Ich-entwickle_meine_Fähigkeiten_jeden_Tag_weiter.png',
  'NW_008__Ich_darf_mir_Hilfe_holen_und_gemeinsam_größer_wachsen.png',
  'NW_009_Ich_bin_wertvoll_genau_so_wie_ich_bin.png',
  'NW_010_Ich_nehme_mir_Zeit_für_mich_weil_ich_wichtig_bin.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  const alwaysFresh =
    url.pathname.endsWith('/styles.css') ||
    url.pathname.endsWith('/app.js') ||
    url.pathname.endsWith('/99-inner-codes.html');

  if (alwaysFresh) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();

          caches.open(CACHE).then(cache => {
            cache.put(event.request, copy);
          });

          return response;
        })
        .catch(() => caches.match(event.request))
    );

    return;
  }

  const isHtml =
    event.request.mode === 'navigate' ||
    event.request.destination === 'document';

  if (isHtml) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();

          caches.open(CACHE).then(cache => {
            cache.put(event.request, copy);
          });

          return response;
        })
        .catch(() =>
          caches.match(event.request)
            .then(cached => cached || caches.match('./'))
        )
    );

    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
