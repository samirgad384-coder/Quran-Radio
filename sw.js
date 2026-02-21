const CACHE_NAME = 'quran-radio-v10';
// غيرنا الإصدار لـ v5

const ASSETS = [
    '/',
    '/index.html',
    '/important-stations.html',
    '/all-stations.html',
    '/styles.css',
    '/script.js',
    '/radio.png'
];

self.addEventListener('install', event => {
    // skipWaiting بتجبر الـ Service worker الجديد يشتغل فوراً بدل ما يستنى القديم يقفل
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', event => {
    // claim بتجبر الـ Service worker يتحكم في كل الصفحات المفتوحة حالاً
    event.waitUntil(self.clients.claim());

    // مسح أي كاش قديم (v1, v2, v3, v4) عشان ننظف المتصفح
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
});

self.addEventListener('fetch', event => {
    const url = event.request.url;
    
    // تجاهل حفظ البث المباشر (عشان ميستهلكش مساحة ونت)
    if (url.includes('stream') || url.includes('.mp3') || url.includes('mp3quran') || url.includes('qurango')) {
        return;
    }

    // استراتيجية (Network First) للملفات العادية
    // بيحاول يجيب من النت الأول عشان دايماً تشوف التعديلات، لو النت فاصل بيجيب من الكاش
    event.respondWith(
        fetch(event.request).then(response => {
            // لو الرد سليم، بنحفظ نسخة في الكاش
            if (response && response.status === 200 && response.type === 'basic') {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
        }).catch(() => {
            // لو فشل (مفيش نت)، بنرجع للملفات اللي محفوظة في الكاش
            return caches.match(event.request).then(cached => {
                if (cached) return cached;
                // لو الصفحة مش موجودة، بيرجع للصفحة الرئيسية
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});
