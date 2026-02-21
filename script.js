/**
 * ========================================================
 * 📻 RADIO QURAN — FINAL ENGINE v5.0
 * Zero FOUC | Full i18n | Dynamic Translation | PWA
 * ========================================================
 */

'use strict';

// ========================
// 1. GLOBAL STATE
// ========================
const AppState = {
    currentLang: localStorage.getItem('lang') || 'ar',
    theme: localStorage.getItem('theme') || 'dark',
    sleepTimer: null,
    sleepSeconds: 0,
    currentlyPlaying: null,
    customPlayers: [],
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]')
};

// ========================
// 2. FULL DICTIONARY
// ========================
const Dictionary = {
    // Navigation
    "إذاعات القرآن": "Quran Radios",
    "الرئيسية": "Home",
    "أهم الإذاعات": "Top Stations",
    "جميع الاذاعات": "All Stations",
    "المفضلة": "Favorites",

    // Hero
    "إذاعة القرآن الكريم من القاهرة مباشر": "Cairo Quran Radio — Live",
    "إذاعة القرآن الكريم من القاهرة": "Cairo Quran Radio",
    "راديو القرآن الكريم استماع أون لاين من القاهرة إذاعة القرآن الكريم في مصر MP3 حيث بإمكانك أن تستمع للقرآن الكريم ليلا نهارا.":
        "Listen online to the Holy Quran Radio from Cairo, Egypt. Available day and night.",

    // Pages
    "جميع إذاعات القرآن الكريم": "All Quran Radio Stations",
    "أهم إذاعات القرآن الكريم في العالم": "Top Quran Radio Stations Worldwide",
    "الإذاعات المفضلة": "Favorite Stations",
    "قائمتك المفضلة فارغة حالياً": "Your favorites list is empty",
    "تصفح جميع الإذاعات": "Browse All Stations",
    "ابحث عن الإذاعة...": "Search for a station...",
    "ابحث في مفضلتك...": "Search your favorites...",

    // Player
    "اضغط للتشغيل": "Click to Play",
    "جارٍ البث...": "Playing Live...",
    "فشل التحميل — اضغط للمحاولة": "Failed — Click to Retry",
    "متصفحك لا يدعم مشغل الصوت": "Browser does not support audio.",

    // Timer & Settings
    "مؤقت النوم": "Sleep Timer",
    "تغيير اللغة": "Change Language",
    "تغيير الثيم": "Change Theme",
    "إلغاء المؤقت": "Cancel Timer",
    "15 دقيقة": "15 Min",
    "30 دقيقة": "30 Min",
    "45 دقيقة": "45 Min",
    "60 دقيقة": "60 Min",

    // Footer
    "إذاعات القرآن الكريم": "Quran Radio Stations",
    "تواصل عبر تيليجرام": "Contact on Telegram",
    "راسلني بالبريد": "Email Me",
    "جميع الحقوق محفوظة": "All Rights Reserved",
    "سمير جاد": "Samir Gad",
    "تم تطوير هذا الموقع بـ": "Developed with",
    "لخدمة القرآن الكريم": "to serve the Holy Quran",

    // Toasts
    "تمت الإضافة للمفضلة ❤️": "Added to Favorites ❤️",
    "تمت الإزالة من المفضلة 💔": "Removed from Favorites 💔",
    "تم تفعيل المؤقت ⏰": "Timer Activated ⏰",
    "انتهى المؤقت، تم إيقاف البث 🛑": "Timer Ended — Broadcast Stopped 🛑",

    // ===== أسماء الإذاعات (API + Static) =====
    "إذاعة القاهرة": "Cairo Radio",
    "السعودية مكة": "Makkah — Saudi Arabia",
    "الجزائر": "Algeria Quran",
    "الرقية الشرعية": "Ruqyah Radio",

    "إذاعة إبراهيم الأخضر": "Radio Ibrahim Al-Akhdar",
    "إذاعة شيخ أبو بكر الشاطري": "Radio Abu Bakr Al-Shatri",
    "إذاعة أحمد المجمي": "Radio Ahmed Al-Mojammi",
    "إذاعة أحمد الحواشي": "Radio Ahmed Al-Hawashi",
    "إذاعة أحمد صابر": "Radio Ahmed Saber",
    "إذاعة أحمد نعينع": "Radio Ahmed Naina",
    "إذاعة أكرم العلاقمي": "Radio Akram Al-Alaqmi",
    "إذاعة إدريس أبكر": "Radio Idris Abkar",
    "إذاعة الزين محمد أحمد": "Radio Alzain Mohammad Ahmad",
    "إذاعة القارئ ياسين": "Radio Yassin",
    "إذاعة العيون الكوشي": "Radio Al-Oyoun Al-Koshi",
    "إذاعة توفيق الصايغ": "Radio Tawfiq As-Sayegh",
    "إذاعة جمال شاكر عبدالله": "Radio Jamal Shaker Abdullah",
    "إذاعة خالد القحطاني": "Radio Khaled Al-Qahtani",
    "إذاعة خالد عبدالكافي": "Radio Khaled Abdulkafi",
    "إذاعة خليفة الطنيجي": "Radio Khalifa Al-Tunaiji",
    "إذاعة زكي داغستاني": "Radio Zaki Daghistani",
    "إذاعة سعد الغامدي": "Radio Saad Al-Ghamdi",
    "إذاعة سعود الشريم": "Radio Saud Al-Shuraim",
    "إذاعة سهل ياسين": "Radio Sahl Yassin",
    "إذاعة سيد رمضان": "Radio Sayed Ramadan",
    "إذاعة شيرزاد عبدالرحمن طاهر": "Radio Sherzad Abdulrahman Taher",
    "إذاعة صابر عبدالحكم": "Radio Saber Abdulhakam",
    "إذاعة صلاح البدير": "Radio Salah Al-Budair",
    "إذاعة صلاح الهاشم": "Radio Salah Al-Hashem",
    "إذاعة صلاح بو خاطر": "Radio Salah Bukhatir",
    "إذاعة طارق عبدالغني دعوب": "Radio Tariq Abdulghani Dawood",
    "إذاعة عادل الكلباني": "Radio Adel Al-Kalbani",
    "إذاعة عادل ريان": "Radio Adel Rayan",
    "إذاعة عبدالبارئ الثبيتي": "Radio Abdulbari Ath-Thubaity",
    "إذاعة عبدالبارئ محمد": "Radio Abdulbari Mohammed",
    "إذاعة عبدالباسط عبدالصمد": "Radio Abdulbasit Abdulsamad",
    "إذاعة عبدالباسط عبدالصمد - المصحف المجود": "Radio Abdulbasit Abdulsamad — Mujawwad",
    "إذاعة عبدالباسط عبدالصمد - ورش عن نافع": "Radio Abdulbasit Abdulsamad — Warsh",
    "إذاعة عبدالرحمن السديس": "Radio Abdulrahman Al-Sudais",
    "إذاعة عبدالعزيز الأحمد": "Radio Abdulaziz Al-Ahmad",
    "إذاعة عبدالله الخياط": "Radio Abdullah Al-Khayyat",
    "إذاعة عبدالله المطرود": "Radio Abdullah Al-Matrood",
    "إذاعة عبدالله بصفر": "Radio Abdullah Basfar",
    "إذاعة عبدالله عواد الجهني": "Radio Abdullah Awad Al-Juhany",
    "إذاعة عبدالمحسن الحارثي": "Radio Abdulmohsen Al-Harthy",
    "إذاعة عبدالمحسن العبيكان": "Radio Abdulmohsen Al-Obaikan",
    "إذاعة عبدالمحسن القاسم": "Radio Abdulmohsen Al-Qasim",
    "إذاعة عبدالهادي أحمد كناكري": "Radio Abdulhadi Ahmed Kanakri",
    "إذاعة عبد الودود حنيف": "Radio Abdulwadud Haneef",
    "إذاعة علي بن عبدالرحمن الحذيفي": "Radio Ali Al-Hudhaify",
    "إذاعة علي جابر": "Radio Ali Jaber",
    "إذاعة علي حجاج السويسي": "Radio Ali Hajjaj Al-Souisi",
    "إذاعة عماد زهير حافظ": "Radio Emad Zuhair Hafez",
    "إذاعة عمر القزابري": "Radio Omar Al-Qazabri",
    "إذاعة فارس عباد": "Radio Fares Abbad",
    "إذاعة ماجد الزامل": "Radio Majid Al-Zamil",
    "إذاعة ماهر المعيقلي": "Radio Maher Al-Muaiqly",
    "إذاعة محمد أيوب": "Radio Muhammad Ayyub",
    "إذاعة محمد البراك": "Radio Muhammad Al-Barrak",
    "إذاعة محمد الطبلاوي": "Radio Muhammad Al-Tablawi",
    "إذاعة محمد اللحيدان": "Radio Muhammad Al-Luhaidan",
    "إذاعة محمد المحيسني": "Radio Muhammad Al-Mohaisany",
    "إذاعة محمد جبريل": "Radio Muhammad Jibreel",
    "إذاعة محمد حسان": "Radio Muhammad Hassan",
    "إذاعة محمد عبدالكريم": "Radio Muhammad Abdulkarim",
    "إذاعة محمد محمود الطبلاوي": "Radio Muhammad Mahmoud Al-Tablawi",
    "إذاعة محمود خليل الحصري": "Radio Mahmoud Khalil Al-Husary",
    "إذاعة محمود خليل الحصري - المصحف المجود": "Radio Mahmoud Khalil Al-Husary — Mujawwad",
    "إذاعة محمود خليل الحصري - ورش عن نافع": "Radio Mahmoud Khalil Al-Husary — Warsh",
    "إذاعة محمود علي البنا": "Radio Mahmoud Ali Al-Banna",
    "إذاعة محمود علي البنا - المصحف المجود": "Radio Mahmoud Ali Al-Banna — Mujawwad",
    "إذاعة مشاري العفاسي": "Radio Mishary Al-Afasy",
    "إذاعة مصطفى إسماعيل": "Radio Mustafa Ismail",
    "إذاعة مصطفى اللاهوني": "Radio Mustafa Al-Lahoni",
    "إذاعة مصطفى رعد العزاوي": "Radio Mustafa Raad Al-Azzawi",
    "إذاعة مفتاح السلطني": "Radio Muftah Al-Sultany",
    "إذاعة موسى بلال": "Radio Musa Bilal",
    "إذاعة ناصر القطامي": "Radio Nasser Al-Qatami",
    "إذاعة نبيل الرفاعي": "Radio Nabil Al-Rifai",
    "إذاعة نعمة الحسان": "Radio Nima Al-Hassan",
    "إذاعة هاني الرفاعي": "Radio Hani Al-Rifai",
    "إذاعة وليد الدليمي": "Radio Walid Al-Dulaimi",
    "إذاعة ياسر الدوسري": "Radio Yasser Al-Dosari",
    "إذاعة ياسر القرشي": "Radio Yasser Al-Qurashi",
    "إذاعة ياسر المزروعي": "Radio Yasser Al-Mazroui",
    "إذاعة يحيى حوا": "Radio Yahya Hawa",
    "إذاعة يوسف الشويعي": "Radio Youssef Al-Shouaey",
    "إذاعة السعودية": "Saudi Arabia Radio",
    "إذاعة مكة المكرمة": "Radio Makkah Al-Mukarramah",
    "إذاعة المدينة المنورة": "Radio Al-Madinah Al-Munawwarah",
    "إذاعة القرآن الكريم من المدينة": "Radio Quran — Madinah",
    "إذاعة تلاوات مختارة": "Selected Recitations Radio",
    "إذاعة تراتيل": "Tarateel Radio",
    "إذاعة الأطفال": "Children's Quran Radio",
    "إذاعة التجويد": "Tajweed Radio"
};

// ========================
// 3. TRANSLATION ENGINE
// ========================

// ترجمة نص ثابت من القاموس
const _t = (text) => {
    if (!text) return text;
    if (AppState.currentLang === 'en') {
        return Dictionary[text.trim()] || text;
    }
    return text;
};

// ترجمة أسماء الإذاعات الديناميكية
const translateName = (name) => {
    if (!name) return name;
    if (AppState.currentLang === 'ar') return name;

    // لو في القاموس، هاته منه
    if (Dictionary[name.trim()]) return Dictionary[name.trim()];

    // لو مش في القاموس، ترجم الكلمات الشائعة وسيب اسم المقرئ
    return name
        .replace(/^إذاعة /, 'Radio ')
        .replace(/^القارئ /, 'Reciter ')
        .replace(/^الشيخ /, 'Sheikh ')
        .replace(/^شيخ /, 'Sheikh ');
};

// ترجمة كل نصوص الصفحة الثابتة
const updateUILanguage = () => {
    document.documentElement.dir = AppState.currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = AppState.currentLang;

    // زر اللغة
    const langBtn = document.getElementById('langText');
    if (langBtn) langBtn.textContent = AppState.currentLang === 'ar' ? 'EN' : 'عربي';

    // Placeholders
    const si = document.getElementById('searchInput');
    if (si) si.placeholder = _t("ابحث عن الإذاعة...");
    const fi = document.getElementById('favSearchInput');
    if (fi) fi.placeholder = _t("ابحث في مفضلتك...");

    // Titles
    const timerBtn = document.getElementById('timerBtn');
    if (timerBtn) timerBtn.title = _t("مؤقت النوم");
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.title = _t("تغيير الثيم");
    const langToggleBtn = document.getElementById('langToggle');
    if (langToggleBtn) langToggleBtn.title = _t("تغيير اللغة");

    // ترجمة كل النصوص العادية في الصفحة
    const walker = document.createTreeWalker(
        document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                const tag = node.parentElement?.tagName;
                if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
                if (node.nodeValue.trim().length === 0) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let node;
    while (node = walker.nextNode()) {
        const raw = node.nodeValue.trim();
        if (!node._original) {
            if (Dictionary[raw]) node._original = raw;
        }
        if (node._original) {
            node.nodeValue = node.nodeValue.replace(
                raw,
                AppState.currentLang === 'en' ? Dictionary[node._original] : node._original
            );
        }
    }

    // ترجمة أسماء الإذاعات في الكروت (data-ar)
    document.querySelectorAll('[data-ar]').forEach(el => {
        el.textContent = translateName(el.getAttribute('data-ar'));
    });
};

// ========================
// 4. TOAST NOTIFICATIONS
// ========================
const showToast = (message, duration = 3000) => {
    document.querySelector('.quran-toast')?.remove();

    const toast = document.createElement('div');
    toast.className = 'quran-toast';
    toast.textContent = _t(message);

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%) translateY(80px)',
        background: AppState.theme === 'dark' ? 'rgba(5,15,30,0.92)' : 'rgba(255,255,255,0.96)',
        color: AppState.theme === 'dark' ? '#c9a84c' : '#2563eb',
        padding: '12px 28px',
        borderRadius: '50px',
        border: '1px solid rgba(201,168,76,0.3)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px)',
        zIndex: '9999',
        fontFamily: '"Tajawal", sans-serif',
        fontWeight: '700',
        fontSize: '1rem',
        opacity: '0',
        transition: 'all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55)',
        whiteSpace: 'nowrap'
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(80px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 450);
    }, duration);
};

// ========================
// 5. THEME
// ========================
const applyTheme = () => {
    // تطبيق على الـ body
    document.body.classList.toggle('light-mode', AppState.theme === 'light');
    // تطبيق على الـ html (للحماية من الرمشة)
    document.documentElement.classList.toggle('light-mode', AppState.theme === 'light');
    
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = AppState.theme === 'light'
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
};

// ========================
// 6. NAVBAR
// ========================

// تأثير الـ scroll على النافبار
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const scrolled = window.scrollY > 50;
    nav.style.top = scrolled ? '10px' : '20px';
    nav.style.padding = scrolled ? '0.4rem 1rem' : '0.6rem 1.2rem';
    nav.style.background = scrolled
        ? (AppState.theme === 'dark' ? 'rgba(2,8,18,0.9)' : 'rgba(255,255,255,0.98)')
        : (AppState.theme === 'dark' ? 'rgba(5,15,30,0.6)' : 'rgba(255,255,255,0.8)');
}, { passive: true });

const setupMobileMenu = () => {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        menuBtn.innerHTML = open
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
};

// ========================
// 7. SMART AUDIO PLAYER
// ========================
class SmartAudioPlayer {
    constructor(element) {
        this.el = element;
        this.src = element.dataset.src;
        this.audio = new Audio();
        this.audio.preload = 'none';

        this.playBtn = element.querySelector('.play-pause-btn');
        this.muteBtn = element.querySelector('.mute-btn');
        this.statusEl = element.querySelector('.status');

        this.isPlaying = false;
        this.hasError = false;

        this._bindEvents();
    }

    _eqHTML() {
        return `<div style="display:flex;gap:3px;height:16px;align-items:flex-end">
            <span style="width:3px;background:currentColor;border-radius:2px;animation:eq 0.9s ease-in-out infinite alternate"></span>
            <span style="width:3px;background:currentColor;border-radius:2px;animation:eq 0.7s ease-in-out infinite alternate 0.2s"></span>
            <span style="width:3px;background:currentColor;border-radius:2px;animation:eq 1.1s ease-in-out infinite alternate 0.4s"></span>
        </div>
        <style>@keyframes eq{0%{height:3px}100%{height:16px}}</style>`;
    }

    _bindEvents() {
        this.playBtn.addEventListener('click', () => this.toggle());

        if (this.muteBtn) {
            this.muteBtn.addEventListener('click', () => {
                this.audio.muted = !this.audio.muted;
                this.muteBtn.innerHTML = this.audio.muted
                    ? '<i class="fas fa-volume-mute"></i>'
                    : '<i class="fas fa-volume-up"></i>';
                this.muteBtn.classList.toggle('muted', this.audio.muted);
            });
        }

        this.audio.addEventListener('play',    () => this._setUI('playing'));
        this.audio.addEventListener('pause',   () => this._setUI('paused'));
        this.audio.addEventListener('waiting', () => this._setUI('loading'));
        this.audio.addEventListener('playing', () => this._setUI('playing'));
        this.audio.addEventListener('error',   () => this._setUI('error'));
    }

    toggle() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            // إيقاف أي مشغل شغال
            AppState.customPlayers.forEach(p => {
                if (p !== this && p.isPlaying) p.audio.pause();
            });

            if (this.hasError) {
                this.audio.src = '';
                this.hasError = false;
            }

            this.audio.src = this.src;
            this._setUI('loading');
            this.audio.play().catch(() => this._setUI('error'));
        }
    }

    _setUI(state) {
        switch (state) {
            case 'playing':
                this.isPlaying = true;
                this.playBtn.innerHTML = this._eqHTML();
                this.playBtn.classList.remove('loading');
                if (this.statusEl) this.statusEl.textContent = _t('جارٍ البث...');
                AppState.currentlyPlaying = this.audio;
                break;
            case 'paused':
                this.isPlaying = false;
                this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.playBtn.classList.remove('loading');
                if (this.statusEl) this.statusEl.textContent = _t('اضغط للتشغيل');
                if (AppState.currentlyPlaying === this.audio) AppState.currentlyPlaying = null;
                break;
            case 'loading':
                this.playBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                this.playBtn.classList.add('loading');
                break;
            case 'error':
                this.isPlaying = false;
                this.hasError = true;
                this.playBtn.innerHTML = '<i class="fas fa-redo"></i>';
                this.playBtn.classList.remove('loading');
                if (this.statusEl) this.statusEl.textContent = _t('فشل التحميل — اضغط للمحاولة');
                break;
        }
    }
}

// ========================
// 8. FAVORITES
// ========================
const toggleFavorite = (btn, name, src) => {
    const idx = AppState.favorites.findIndex(f => f.src === src);
    if (idx === -1) {
        AppState.favorites.push({ name, src });
        btn.classList.add('active');
        showToast("تمت الإضافة للمفضلة ❤️");
    } else {
        AppState.favorites.splice(idx, 1);
        btn.classList.remove('active');
        showToast("تمت الإزالة من المفضلة 💔");
    }
    localStorage.setItem('favorites', JSON.stringify(AppState.favorites));
};

const initFavBtns = (container = document) => {
    container.querySelectorAll('.fav-btn').forEach(btn => {
        const src = btn.dataset.src;
        if (AppState.favorites.some(f => f.src === src)) btn.classList.add('active');
        btn.onclick = () => toggleFavorite(btn, btn.dataset.name, src);
    });
};

// ========================
// 9. API STATIONS RENDERER
// ========================
const renderStations = async () => {
    const grid = document.getElementById('allStationsGrid');
    if (!grid) return;

    // Loading spinner
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--accent-cyan)">
        <i class="fas fa-spinner fa-spin" style="font-size:2.5rem"></i>
    </div>`;

    try {
        const res  = await fetch('https://mp3quran.net/api/v3/radios');
        const data = await res.json();

        grid.innerHTML = '';
        const frag = document.createDocumentFragment();

        data.radios.forEach(station => {
            const isFav = AppState.favorites.some(f => f.src === station.url);
            // 🔥 نترجم الاسم قبل ما يتكتب في الـ HTML
            const displayName = translateName(station.name);

            const card = document.createElement('div');
            card.className = 'station-card';
            card.innerHTML = `
                <div class="card-header">
                    <h3 data-ar="${station.name}">${displayName}</h3>
                    <button class="fav-btn ${isFav ? 'active' : ''}"
                            data-name="${station.name}" data-src="${station.url}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="custom-audio-player" data-src="${station.url}">
                    <button class="play-pause-btn"><i class="fas fa-play"></i></button>
                    <div class="station-info">
                        <span class="station-name" data-ar="${station.name}">${displayName}</span>
                        <span class="status">${_t('اضغط للتشغيل')}</span>
                    </div>
                    <button class="mute-btn"><i class="fas fa-volume-up"></i></button>
                </div>`;

            frag.appendChild(card);
        });

        grid.appendChild(frag);

        // تهيئة المشغلات
        grid.querySelectorAll('.custom-audio-player').forEach(el =>
            AppState.customPlayers.push(new SmartAudioPlayer(el))
        );

        // تهيئة أزرار المفضلة
        initFavBtns(grid);

        // البحث (يبحث في الاسم العربي والإنجليزي معاً)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const term = searchInput.value.toLowerCase();
                grid.querySelectorAll('.station-card').forEach(card => {
                    const h3 = card.querySelector('h3');
                    const en = h3.textContent.toLowerCase();
                    const ar = h3.getAttribute('data-ar').toLowerCase();
                    card.style.display = (en.includes(term) || ar.includes(term)) ? '' : 'none';
                });
            });
        }

    } catch (err) {
        console.error('Stations error:', err);
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#ef4444;font-size:1.1rem">
            <i class="fas fa-exclamation-triangle"></i> ${_t('فشل التحميل — اضغط للمحاولة')}
        </p>`;
    }
};

// ========================
// 10. SLEEP TIMER
// ========================
const _updateTimerDisplay = () => {
    const display = document.getElementById('timerDisplay');
    const btn     = document.getElementById('timerBtn');
    if (AppState.sleepSeconds > 0) {
        const m = String(Math.floor(AppState.sleepSeconds / 60)).padStart(2, '0');
        const s = String(AppState.sleepSeconds % 60).padStart(2, '0');
        if (display) display.textContent = `${m}:${s}`;
        btn?.classList.add('timer-running');
    } else {
        if (display) display.textContent = '';
        btn?.classList.remove('timer-running');
    }
};

window.startSleepTimer = (minutes) => {
    clearInterval(AppState.sleepTimer);
    AppState.sleepSeconds = minutes * 60;
    _updateTimerDisplay();
    showToast("تم تفعيل المؤقت ⏰");

    AppState.sleepTimer = setInterval(() => {
        AppState.sleepSeconds--;
        _updateTimerDisplay();
        if (AppState.sleepSeconds <= 0) {
            clearInterval(AppState.sleepTimer);
            AppState.currentlyPlaying?.pause();
            showToast("انتهى المؤقت، تم إيقاف البث 🛑", 5000);
        }
    }, 1000);

    document.getElementById('timerModal')?.classList.remove('active');
};

window.clearSleepTimer = () => {
    clearInterval(AppState.sleepTimer);
    AppState.sleepSeconds = 0;
    _updateTimerDisplay();
};

window.closeTimerModal = () =>
    document.getElementById('timerModal')?.classList.remove('active');

// ========================
// 11. INIT (ZERO FOUC)
// ========================
document.addEventListener('DOMContentLoaded', () => {

    // 🔥 إخفاء الصفحة قبل الترجمة عشان مشوفش العربي خالص
    document.body.style.visibility = 'hidden';

    applyTheme();
    updateUILanguage();

    // 🔥 إظهارها بعد الترجمة مباشرةً
    requestAnimationFrame(() => {
        document.body.style.visibility = 'visible';
    });

    // Theme Toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', AppState.theme);
        applyTheme();
            // تفعيل الـ transition بعد التحميل عشان مفيش رمشة في أول ظهور
    setTimeout(() => {
        document.body.classList.add('transitions-ready');
    }, 100);

    });

    // Language Toggle
    document.getElementById('langToggle')?.addEventListener('click', () => {
        AppState.currentLang = AppState.currentLang === 'ar' ? 'en' : 'ar';
        localStorage.setItem('lang', AppState.currentLang);
        updateUILanguage();
    });

    // Timer Modal
    document.getElementById('timerBtn')?.addEventListener('click', () =>
        document.getElementById('timerModal')?.classList.toggle('active')
    );

    // تهيئة المشغلات الثابتة في الصفحة
    document.querySelectorAll('.custom-audio-player').forEach(el =>
        AppState.customPlayers.push(new SmartAudioPlayer(el))
    );

    // تهيئة أزرار المفضلة الثابتة
    initFavBtns();

    // تحميل الإذاعات من الـ API
    renderStations();

    // القائمة الجانبية
    setupMobileMenu();

    // سنة الفوتر
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ========================
// 12. SERVICE WORKER
// ========================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            reg.update();
            reg.onupdatefound = () => {
                const worker = reg.installing;
                worker.onstatechange = () => {
                    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                        caches.keys()
                            .then(keys => Promise.all(keys.map(k => caches.delete(k))))
                            .then(() => window.location.reload());
                    }
                };
            };
        }).catch(err => console.warn('SW Error:', err));
    });
}
