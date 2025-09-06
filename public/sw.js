if (!self.define) {
  let e,
    s = {};
  const i = (i, n) => (
    (i = new URL(i + '.js', n).href),
    s[i] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = i), (e.onload = s), document.head.appendChild(e);
        } else (e = i), importScripts(i), s();
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, a) => {
    const c =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (s[c]) return;
    let t = {};
    const u = (e) => i(e, c),
      r = { module: { uri: c }, exports: t, require: u };
    s[c] = Promise.all(n.map((e) => r[e] || u(e))).then((e) => (a(...e), t));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/app-build-manifest.json',
          revision: 'd28ce0dbd6fdd6cc3841bd64ee682369',
        },
        {
          url: '/_next/static/7uTTqO7oin3hpyYlMuAWU/_buildManifest.js',
          revision: '0ea7e7088aabf697ba3d8aa8c7b54a89',
        },
        {
          url: '/_next/static/7uTTqO7oin3hpyYlMuAWU/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/081ca426-a32f2611f425a309.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/0e762574-dbbf8d676a8bcc32.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/1029.8ceeac27fd6788c7.js',
          revision: '8ceeac27fd6788c7',
        },
        {
          url: '/_next/static/chunks/1170.600d726cddf544bf.js',
          revision: '600d726cddf544bf',
        },
        {
          url: '/_next/static/chunks/1311.11f668fe0e91f44d.js',
          revision: '11f668fe0e91f44d',
        },
        {
          url: '/_next/static/chunks/139.7cb4d5c38c06c40c.js',
          revision: '7cb4d5c38c06c40c',
        },
        {
          url: '/_next/static/chunks/1422.457d50998bead819.js',
          revision: '457d50998bead819',
        },
        {
          url: '/_next/static/chunks/1729.d661a966d03afb66.js',
          revision: 'd661a966d03afb66',
        },
        {
          url: '/_next/static/chunks/2117-43ce96203b91ead8.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/2281-b5c494477870c161.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/2690-4414c4163170a35b.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/2697-9987cee32c1d035a.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/2772.1a82208c89f7d939.js',
          revision: '1a82208c89f7d939',
        },
        {
          url: '/_next/static/chunks/27d0ae69.f6b2039c282429d2.js',
          revision: 'f6b2039c282429d2',
        },
        {
          url: '/_next/static/chunks/30a37ab2.d2cd53096115d3ef.js',
          revision: 'd2cd53096115d3ef',
        },
        {
          url: '/_next/static/chunks/3145-455522d07d6eefcb.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/3557.73518d1a4d5c6c8f.js',
          revision: '73518d1a4d5c6c8f',
        },
        {
          url: '/_next/static/chunks/385cb88d-f26e9e9596dcb1c7.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/3d47b92a.a0ec8b1d0cfabdb2.js',
          revision: 'a0ec8b1d0cfabdb2',
        },
        {
          url: '/_next/static/chunks/4083.deb848c4a3851e0a.js',
          revision: 'deb848c4a3851e0a',
        },
        {
          url: '/_next/static/chunks/411.65c88c008839230f.js',
          revision: '65c88c008839230f',
        },
        {
          url: '/_next/static/chunks/4398-f7a53db1d92e1a9e.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/5010-8eeab657b48730f7.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/5185.8b73c3b2e67bf2a7.js',
          revision: '8b73c3b2e67bf2a7',
        },
        {
          url: '/_next/static/chunks/5257.2a95f13822dc8cb7.js',
          revision: '2a95f13822dc8cb7',
        },
        {
          url: '/_next/static/chunks/53c13509-1cf48a204d5b45c0.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/5709.406e990a376443f1.js',
          revision: '406e990a376443f1',
        },
        {
          url: '/_next/static/chunks/59650de3.d3a7d140b1550f0c.js',
          revision: 'd3a7d140b1550f0c',
        },
        {
          url: '/_next/static/chunks/5977-6af3f9addce0dad5.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/5e22fd23-781ff56155ee65b9.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/5e621ef1.41fb17250d7f2ca8.js',
          revision: '41fb17250d7f2ca8',
        },
        {
          url: '/_next/static/chunks/605-88948b79fa9f0cd8.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/6196.8fc5c9312d183cc8.js',
          revision: '8fc5c9312d183cc8',
        },
        {
          url: '/_next/static/chunks/619edb50-a8ff57c71c02d804.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/633.3dbf76f52daf49f5.js',
          revision: '3dbf76f52daf49f5',
        },
        {
          url: '/_next/static/chunks/6663-8d1914017509006d.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/7420.293310162d4d38da.js',
          revision: '293310162d4d38da',
        },
        {
          url: '/_next/static/chunks/7583.bbba4495977f07a9.js',
          revision: 'bbba4495977f07a9',
        },
        {
          url: '/_next/static/chunks/7648-18f9766f865bb080.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/7691.178fe0cc4947ad7d.js',
          revision: '178fe0cc4947ad7d',
        },
        {
          url: '/_next/static/chunks/7812.28f3fa275ecd2ff1.js',
          revision: '28f3fa275ecd2ff1',
        },
        {
          url: '/_next/static/chunks/795d4814-1c8f8a70289a4a7b.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/8118.d52f77903b16cc22.js',
          revision: 'd52f77903b16cc22',
        },
        {
          url: '/_next/static/chunks/8138-09ff0bcce6ff6484.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/8265-06b42cf5411299b7.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/8369.403f930608059098.js',
          revision: '403f930608059098',
        },
        {
          url: '/_next/static/chunks/8537.1a7c27d5a25ae833.js',
          revision: '1a7c27d5a25ae833',
        },
        {
          url: '/_next/static/chunks/868.b48fbb744f8159b2.js',
          revision: 'b48fbb744f8159b2',
        },
        {
          url: '/_next/static/chunks/86b50d72.960e2ea13b982ca1.js',
          revision: '960e2ea13b982ca1',
        },
        {
          url: '/_next/static/chunks/8853-f605545ab6fb19c7.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/8e1d74a4-6bf3eef9e6fdc376.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/9253.fe8bae435b1ab402.js',
          revision: 'fe8bae435b1ab402',
        },
        {
          url: '/_next/static/chunks/9371-e0829064753404bf.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/9399.cad9925a6cd67b66.js',
          revision: 'cad9925a6cd67b66',
        },
        {
          url: '/_next/static/chunks/9491-46b8f85db59e2a3a.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/9531-fce3d41ce7e3350d.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/9771-79a55ed932f3ef24.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/9c4e2130-fbde9de74dddab7f.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/a0f462e1.25b971ace86879ef.js',
          revision: '25b971ace86879ef',
        },
        {
          url: '/_next/static/chunks/a71774c8.f42173573ed07e49.js',
          revision: 'f42173573ed07e49',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-21c9c9a34ab3aa38.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/categories/%5Bid%5D/page-f981bb761082902c.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/contactUs/byEmail/page-f4095045c1439731.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/contactUs/page-c493b6f90266afbc.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/editPost/%5Bid%5D/page-acf8e02ce91a7deb.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/favorite/page-81fea1fc450bac48.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/layout-4a3ef19935095926.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/loading-0f6cabe04ecea524.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/login/page-31d91ee9409198f3.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/myPosts/page-23e8a107e8297e27.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/newPost/page-9617d6eec9283fce.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/not-found-be3aaddbccfe6203.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/page-920da52c4b6a4497.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/post/%5Bid%5D/page-8015ab64db0d80ec.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/profile/page-2ca04cb31cea5f85.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/register/page-c4a9569ac6a719d4.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/search/%5BcategoryId%5D/page-de567d02509529ea.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/search/layout-ee9480e684f49d7e.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/search/loading-0a6f4ff3a60587fa.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/search/page-e6fb16e2115b9920.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/app/users/page-a080d787041b621b.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/b563f954.e10dd03b24329bf3.js',
          revision: 'e10dd03b24329bf3',
        },
        {
          url: '/_next/static/chunks/c916193b.44b5d7b972c377ac.js',
          revision: '44b5d7b972c377ac',
        },
        {
          url: '/_next/static/chunks/d0deef33-cbec4048868e02fb.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/ee560e2c-2e593e76fea2787f.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/f7333993-19175ca4eaad2314.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/f8025e75-b9df534da3e5abd4.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/f97e080b-b41b4ece60f1d74f.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/fc2f6fa8.f5e78aec750fda04.js',
          revision: 'f5e78aec750fda04',
        },
        {
          url: '/_next/static/chunks/fd9d1056-3378abdbff6e1469.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/framework-a63c59c368572696.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/main-app-5d51fd55a4227824.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/main-db3c488c31e55fc5.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/pages/_app-78ddf957b9a9b996.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/pages/_error-7ce03bcf1df914ce.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-b509d693ba2cb1df.js',
          revision: '7uTTqO7oin3hpyYlMuAWU',
        },
        {
          url: '/_next/static/css/3472e80e98f3dad4.css',
          revision: '3472e80e98f3dad4',
        },
        {
          url: '/_next/static/css/857aa62baa17c894.css',
          revision: '857aa62baa17c894',
        },
        {
          url: '/_next/static/css/a2ab42cc7cf23ee7.css',
          revision: 'a2ab42cc7cf23ee7',
        },
        {
          url: '/_next/static/css/ea7d800c8a680295.css',
          revision: 'ea7d800c8a680295',
        },
        {
          url: '/_next/static/media/0596140cb8d9223a-s.woff2',
          revision: 'ddd5de66d4a7c56eeac6e0b10c5d8521',
        },
        {
          url: '/_next/static/media/1a4dd1d7cd3232ea-s.woff2',
          revision: '91c6fe4b62b5ebda5ccee3c4aa1eb33d',
        },
        {
          url: '/_next/static/media/341baa6ce7a16e81-s.woff2',
          revision: '0c7b4bd9156673a090be9999002eaab1',
        },
        {
          url: '/_next/static/media/356abdd51b933898-s.woff2',
          revision: '4ed5a85b9b460c31a44ba541e277bcc0',
        },
        {
          url: '/_next/static/media/c22ccc5eb58b83e1-s.p.woff2',
          revision: '8a051a2b61e4a766fff21bb106142860',
        },
        {
          url: '/_next/static/media/d70c23d6fe66d464-s.woff2',
          revision: '7abbd25026a8e3994d885bd8704b9588',
        },
        {
          url: '/_next/static/media/layers-2x.9859cd12.png',
          revision: '9859cd12',
        },
        {
          url: '/_next/static/media/layers.ef6db872.png',
          revision: 'ef6db872',
        },
        {
          url: '/_next/static/media/marker-icon.d577052a.png',
          revision: 'd577052a',
        },
        {
          url: '/fonts/Raleway-light.ttf',
          revision: '029b34594de6218e9aaa8b95854f30fe',
        },
        {
          url: '/fonts/vanguardcf-heavy.otf',
          revision: 'e7e63b07f8a2cc29ebbeeb0400e262e9',
        },
        {
          url: '/fonts/vanguardcf-thin.otf',
          revision: '6501aeabff4703147ebab199fc0bd2b6',
        },
        { url: '/google.png', revision: 'b75aecaf9e70a9b1760497e33bcd6db1' },
        {
          url: '/images/image (1).jpg',
          revision: '2ab4177a176ca8d9082efc2d2669fe9a',
        },
        {
          url: '/images/image (2).jpg',
          revision: '51d113262aa731d13a7d1bdf69929fe0',
        },
        {
          url: '/images/image (3).jpg',
          revision: 'b727257ac1c338ac83ebae5eb650fcc5',
        },
        {
          url: '/images/image (4).jpg',
          revision: 'dd19910fcb5a2e5462c974518ba4cee0',
        },
        {
          url: '/images/image (5).jpg',
          revision: '065ebeed1242a2090f0d8f67d98ad594',
        },
        {
          url: '/images/image (6).jpg',
          revision: '9c3194ad87ccc470ac80c2161e837285',
        },
        {
          url: '/images/image (7).jpg',
          revision: '824b956c3440cde180aaaf576b1ae97a',
        },
        {
          url: '/images/image (8).jpg',
          revision: '2d51d268a49248ae1d71bbf2ab76fcd9',
        },
        {
          url: '/images/image (9).jpg',
          revision: 'eabc6b493e0fb457b662c227b45efc15',
        },
        { url: '/logo1.png', revision: '730f4a4a1260c70f7ea725769ea0184e' },
        {
          url: '/placeholder.png',
          revision: '71188384f2f7efcb4ef00c7bd0677b57',
        },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: i,
              state: n,
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET'
    );
});
