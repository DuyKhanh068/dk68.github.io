/* ================================================
   MAIN.JS - TỐI ƯU CHO MỌI THIẾT BỊ (kể cả yếu)
   ================================================ */

// -------------------- PHÁT HIỆN THIẾT BỊ YẾU --------------------
const isLowEnd = (
    navigator.hardwareConcurrency <= 2 ||
    (navigator.deviceMemory !== undefined && navigator.deviceMemory < 2) ||
    /Android [1-6]\./.test(navigator.userAgent)
);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

// -------------------- TOAST --------------------
function ShowToast() {
    const toast = document.getElementById("Toast");
    if (toast) {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3800);
    }
}

// -------------------- TYPEWRITER EFFECT --------------------
const typewriterText = "Hello everyone, I'm a Developer.\nI like website design :3";
let contentElement = null;
let charIndex = 0;
let isDeleting = false;
let typewriterTimer = null;

function typeEffect() {
    if (!contentElement) return;
    contentElement.textContent = typewriterText.substring(0, charIndex);

    let speed = isDeleting ? 80 : 160;

    if (!isDeleting && charIndex < typewriterText.length) {
        charIndex++;
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
    } else {
        isDeleting = !isDeleting;
        speed = isDeleting ? 2200 : 500;
    }

    typewriterTimer = setTimeout(typeEffect, speed);
}

// -------------------- FPS COUNTER --------------------
// Tắt FPS counter trên thiết bị yếu/mobile để tiết kiệm CPU
let fpsElement = null;
let fpsStart = 0;
let fpsFrame = 0;
let fpsRafId = null;

function fpsTick(now) {
    fpsFrame++;
    if (now - fpsStart > 1000) {
        if (fpsElement) {
            fpsElement.textContent = (fpsFrame * 1000 / (now - fpsStart)).toFixed(1);
        }
        fpsStart = now;
        fpsFrame = 0;
    }
    fpsRafId = requestAnimationFrame(fpsTick);
}

// -------------------- MUSIC PLAYER --------------------
const songList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
let lastSongIndex = -1;

function getRandomAudio() {
    let idx;
    do { idx = Math.floor(Math.random() * songList.length); }
    while (idx === lastSongIndex && songList.length > 1);
    lastSongIndex = idx;
    return `music/${songList[idx]}.mp3`;
}

function playMusic() {
    const audio = document.getElementById("myAudio");
    if (!audio) return;
    audio.src = getRandomAudio();
    audio.play().catch(() => {});
    audio.onended = playMusic;
}

function hideNotification() {
    const notif = document.getElementById("notification");
    if (notif) notif.style.display = "none";
    playMusic();
}

// -------------------- DATE CREATED --------------------
let dateInterval = null;

function updateDateCreated() {
    const momk = document.getElementById("momk");
    if (!momk) return;
    const birthDay = new Date("2023/08/06").getTime();

    function tick() {
        const diff = Date.now() - birthDay;
        const s = Math.floor(diff / 1000);
        const days = Math.floor(s / 86400);
        const hours = Math.floor((s % 86400) / 3600);
        const mins  = Math.floor((s % 3600) / 60);
        const secs  = s % 60;
        momk.textContent = `${days} ngày ${hours} giờ ${mins} phút ${secs} giây`;
    }

    tick();
    dateInterval = setInterval(tick, 1000);
}

// -------------------- IP & WEATHER --------------------
let ipData = { ip:"...", isp:"...", location:"...", city:"...", lat:null, lon:null, ready:false };
let ipViewState = 0;
let ipFetching = false;
let ipElement = null;
let ipRotateTimer = null;

function normalizeISP(isp) {
    if (!isp || isp === "Unknown ISP" || isp === "Network Hidden") return "Unknown ISP";
    let c = isp.replace(/^AS\d+\s*/i,'').replace(/\s*AS\d+$/i,'').replace(/^"|"$/g,'').trim();
    return c.length > 25 ? c.substring(0,22)+"..." : (c || "Unknown ISP");
}

function isValidIP(ip) {
    if (!ip || ip === "undefined" || ip === "null") return false;
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return false;
    return ip.split('.').every(p => { const n=parseInt(p,10); return n>=0&&n<=255; });
}

async function checkip_address() {
    if (ipFetching) return;
    ipFetching = true;

    const sources = [
        {
            url: "https://ipinfo.io/json",
            parse: d => {
                if (!isValidIP(d.ip)) throw new Error("Invalid IP");
                const loc = d.loc ? d.loc.split(',') : [null,null];
                return { ip:d.ip, isp:d.org||"Unknown ISP", city:d.city||"Unknown",
                         location:`${d.city||"Unknown"}, ${d.country||"Unknown"}`,
                         lat:parseFloat(loc[0])||null, lon:parseFloat(loc[1])||null };
            }
        },
        {
            url: "https://ipwho.is/",
            parse: d => {
                if (!d.success || !isValidIP(d.ip)) throw new Error("Not success");
                return { ip:d.ip, isp:d.connection?.isp||d.isp||"Unknown ISP",
                         city:d.city||"Unknown", location:`${d.city||"Unknown"}, ${d.country||"Unknown"}`,
                         lat:d.latitude||null, lon:d.longitude||null };
            }
        }
    ];

    for (const src of sources) {
        try {
            const ctrl = new AbortController();
            const t = setTimeout(() => ctrl.abort(), 5000);
            const res = await fetch(src.url, { signal: ctrl.signal });
            clearTimeout(t);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const parsed = src.parse(data);
            parsed.isp = normalizeISP(parsed.isp);
            ipData = { ...ipData, ...parsed, ready:true };
            ipFetching = false;
            rotateIPInfo();
            updateWeatherData(parsed.lat, parsed.lon, parsed.city);
            return;
        } catch(e) {}
    }

    // Fallback
    ipData = {
        ip: `192.168.${Math.floor(Math.random()*254)+1}.${Math.floor(Math.random()*254)+1}`,
        isp:"Local Network", city:"Local", location:"Local Network",
        lat:21.0285, lon:105.8542, ready:true
    };
    ipFetching = false;
    rotateIPInfo();
    updateWeatherData(21.0285, 105.8542, "Hanoi");
}

function rotateIPInfo() {
    if (!ipData.ready) return;
    if (!ipElement) ipElement = document.getElementById("checkip_address");
    if (!ipElement) return;

    ipElement.style.opacity = 0;
    clearTimeout(ipRotateTimer);
    ipRotateTimer = setTimeout(() => {
        let icon, text;
        if (ipViewState === 0) {
            icon = '<i class="fas fa-globe" style="margin-right:5px;color:#00FFFF;"></i>';
            text = `<span style="color:#00FFFF;font-weight:bold;">${ipData.ip}</span>`;
            ipViewState = 1;
        } else if (ipViewState === 1) {
            icon = '<i class="fas fa-network-wired" style="margin-right:5px;color:#F1C40F;"></i>';
            text = `<span style="color:#F1C40F;font-weight:bold;">${ipData.isp}</span>`;
            ipViewState = 2;
        } else {
            icon = '<i class="fas fa-map-marker-alt" style="margin-right:5px;color:#2ECC71;"></i>';
            text = `<span style="color:#2ECC71;font-weight:bold;">${ipData.location}</span>`;
            ipViewState = 0;
        }
        ipElement.innerHTML = icon + text;
        ipElement.title = `IP: ${ipData.ip}\nISP: ${ipData.isp}\nLocation: ${ipData.location}`;
        ipElement.style.opacity = 1;
    }, 280);
}

// Weather
let wData = { city:"...", temp:"--", rain_mm:0, rain_prob:0, aqi:"--", ready:false };
let viewState = 0;
let weatherFetching = false;
let weatherTempEl = null;
let weatherIconEl = null;
let weatherRotateTimer = null;

async function updateWeatherData(customLat, customLon, customCity) {
    if (weatherFetching) return;
    weatherFetching = true;

    const lat  = customLat  || ipData.lat  || 21.0285;
    const lon  = customLon  || ipData.lon  || 105.8542;
    const city = customCity || ipData.city || "Hanoi";
    wData.city = city;

    const locEl = document.getElementById('weather_loc');
    if (locEl) locEl.textContent = city;

    const wPromise = fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation&hourly=precipitation_probability&timezone=auto`
    ).then(r => r.json()).then(j => {
        if (j.current) {
            wData.temp     = Math.round(j.current.temperature_2m);
            wData.rain_mm  = j.current.precipitation || 0;
            if (j.hourly?.precipitation_probability) {
                wData.rain_prob = j.hourly.precipitation_probability[new Date().getHours()] || 0;
            }
        }
    }).catch(() => {});

    // Bỏ AQI fetch trên thiết bị yếu để giảm request
    const aqiPromise = isLowEnd ? Promise.resolve() :
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`)
        .then(r => r.json()).then(j => { if (j.current?.us_aqi !== undefined) wData.aqi = j.current.us_aqi; })
        .catch(() => {});

    await Promise.allSettled([wPromise, aqiPromise]);

    wData.ready = true;
    weatherFetching = false;

    if (!window.weatherInitialized) {
        rotateView();
        window.weatherInitialized = true;
    }
}

function rotateView() {
    if (!wData.ready) return;
    if (!weatherTempEl) weatherTempEl = document.getElementById('weather_temp');
    if (!weatherTempEl) return;
    if (!weatherIconEl) weatherIconEl = weatherTempEl.parentElement?.querySelector('i');

    weatherTempEl.style.opacity = 0;
    clearTimeout(weatherRotateTimer);
    weatherRotateTimer = setTimeout(() => {
        if (viewState === 0) {
            if (weatherIconEl) {
                weatherIconEl.className = "fas fa-temperature-high";
                weatherIconEl.style.color = wData.temp > 30 ? "#e74c3c" : wData.temp > 25 ? "#f39c12" : "#3498db";
            }
            weatherTempEl.innerHTML = `<span style="font-weight:bold;">${Math.round(wData.temp)}°C</span>`;
            viewState = 1;
        } else if (viewState === 1) {
            if (weatherIconEl) { weatherIconEl.className="fas fa-cloud-rain"; weatherIconEl.style.color="#3498db"; }
            const rain = wData.rain_mm > 0
                ? `${parseFloat(wData.rain_mm).toFixed(1)}mm (${Math.round(wData.rain_prob)}%)`
                : `${Math.round(wData.rain_prob)}%`;
            weatherTempEl.innerHTML = `<span style="font-weight:bold;">${rain}</span>`;
            viewState = 2;
        } else {
            if (weatherIconEl) {
                weatherIconEl.className = "fas fa-wind";
                let color = "#27ae60";
                if (wData.aqi > 50)  color="#f1c40f";
                if (wData.aqi > 100) color="#e67e22";
                if (wData.aqi > 150) color="#e74c3c";
                weatherIconEl.style.color = color;
            }
            weatherTempEl.innerHTML = `<span style="font-weight:bold;">AQI ${Math.round(wData.aqi)}</span>`;
            viewState = 0;
        }
        weatherTempEl.style.opacity = 1;
    }, 280);
}

// -------------------- SKILL BARS --------------------
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-per');
    if (!bars.length) return;

    function animateBar(bar) {
        const target = parseInt(bar.getAttribute('per'), 10);
        if (isNaN(target)) return;

        // Thiết bị yếu: set ngay không animate
        if (isLowEnd || prefersReducedMotion) {
            bar.style.width = target + '%';
            bar.setAttribute('per', target + '%');
            return;
        }

        bar.style.willChange = 'width';
        const duration = 2500;
        let startTime = null;

        function step(now) {
            if (!startTime) startTime = now;
            const progress = now - startTime;
            const pct = Math.min((progress / duration) * target, target);
            bar.style.width = Math.floor(pct) + '%';
            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                bar.style.width = target + '%';
                bar.setAttribute('per', target + '%');
                bar.style.willChange = 'auto'; // giải phóng GPU layer
            }
        }
        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { animateBar(e.target); obs.unobserve(e.target); }
            });
        }, { threshold: 0.2 });
        bars.forEach(b => obs.observe(b));
    } else {
        bars.forEach(b => animateBar(b));
    }
}

// -------------------- INIT --------------------
document.addEventListener('DOMContentLoaded', () => {
    contentElement = document.querySelector(".contentLetter");
    fpsElement = document.getElementById("fps");

    // FPS counter: tắt trên mobile/thiết bị yếu
    if (!isLowEnd && !isMobile) {
        fpsStart = performance.now();
        fpsRafId = requestAnimationFrame(fpsTick);
    } else if (fpsElement) {
        fpsElement.parentElement.style.display = 'none';
    }

    // Các tác vụ quan trọng: chạy ngay
    checkip_address();
    initSkillBars();

    // Các tác vụ không khẩn: dùng requestIdleCallback — chạy khi browser rảnh
    const idleFn = typeof requestIdleCallback === 'function'
        ? requestIdleCallback
        : fn => setTimeout(fn, 200);

    idleFn(() => {
        ShowToast();
        setTimeout(typeEffect, 300);
        updateDateCreated();

        // Intervals: tần suất thấp hơn trên thiết bị yếu
        const rotateInterval = isLowEnd ? 6000 : 4000;
        setInterval(rotateIPInfo, rotateInterval);
        setInterval(rotateView, rotateInterval);
        setInterval(() => { if (ipData.ready) updateWeatherData(); }, 900000);
        setInterval(() => {
            if (ipData.ready && ipData.ip.startsWith("192.168.")) checkip_address();
        }, 300000);
    });
});

// -------------------- VISIBILITY: Tiết kiệm CPU khi tab ẩn --------------------
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (fpsRafId) { cancelAnimationFrame(fpsRafId); fpsRafId = null; }
        if (dateInterval) { clearInterval(dateInterval); dateInterval = null; }
        if (typewriterTimer) { clearTimeout(typewriterTimer); typewriterTimer = null; }
    } else {
        fpsStart = performance.now();
        fpsFrame = 0;
        if (!fpsRafId && !isLowEnd && !isMobile) fpsRafId = requestAnimationFrame(fpsTick);
        if (!dateInterval) updateDateCreated();
        if (!typewriterTimer) typeEffect();
    }
});

// -------------------- CLICK: Refresh IP --------------------
// { passive: true } cho touch events — không block scroll thread
document.addEventListener('click', e => {
    if (e.target.closest('#checkip_address')) {
        if (ipFetching) return;
        ipData.ready = false;
        const el = document.getElementById("checkip_address");
        if (el) el.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
        setTimeout(checkip_address, 400);
    }
}, { passive: true });

// Passive listeners cho scroll/touch — tránh block main thread khi scroll
document.addEventListener('touchstart', () => {}, { passive: true });
document.addEventListener('touchmove',  () => {}, { passive: true });
document.addEventListener('wheel',      () => {}, { passive: true });