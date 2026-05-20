/* ================================================
   MAIN.JS - TỐI ƯU TOÀN BỘ CHỨC NĂNG
   ================================================ */

// -------------------- KHỞI TẠO --------------------
function onCreate() {
    ShowToast();
    checkip_address();
}

// -------------------- TOAST --------------------
function ShowToast() {
    const toast = document.getElementById("Toast");
    if (toast) {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3900);
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

    const currentString = typewriterText.substring(0, charIndex);
    contentElement.textContent = currentString;

    let typingSpeed = isDeleting ? 70 : 150;

    if (!isDeleting && charIndex < typewriterText.length) {
        charIndex++;
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
    } else {
        isDeleting = !isDeleting;
        typingSpeed = isDeleting ? 2000 : 500;
    }

    typewriterTimer = setTimeout(typeEffect, typingSpeed);
}

// -------------------- FPS COUNTER (throttled) --------------------
let fpsElement = null;
let fpsStart = 0;
let fpsFrame = 0;
let fpsRafId = null;

function fpsTick(now) {
    fpsFrame++;
    // Chỉ update DOM mỗi giây thay vì mỗi frame
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
const songList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
let lastSongIndex = -1;

function getRandomAudio() {
    let randomIndex;
    // Tránh lặp lại bài vừa phát
    do {
        randomIndex = Math.floor(Math.random() * songList.length);
    } while (randomIndex === lastSongIndex && songList.length > 1);
    lastSongIndex = randomIndex;
    return `music/${songList[randomIndex]}.mp3`;
}

function playMusic() {
    const audio = document.getElementById("myAudio");
    if (!audio) return;
    audio.src = getRandomAudio();
    audio.play().catch(e => console.log("Autoplay blocked:", e));
    audio.onended = playMusic;
}

function hideNotification() {
    const notif = document.getElementById("notification");
    if (notif) notif.style.display = "none";
    playMusic();
}

// -------------------- DATE CREATED (setInterval thay setTimeout đệ quy) --------------------
let dateInterval = null;

function updateDateCreated() {
    const momk = document.getElementById("momk");
    if (!momk) return;

    const birthDay = new Date("2023/08/06").getTime();

    // Cập nhật lần đầu ngay lập tức
    function tick() {
        const diff = Date.now() - birthDay;
        const seconds = Math.floor(diff / 1000);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        momk.textContent = `${days} ngày ${hours} giờ ${minutes} phút ${secs} giây`;
    }

    tick();
    // setInterval tránh memory leak từ setTimeout đệ quy chồng chất
    dateInterval = setInterval(tick, 1000);
}

// -------------------- IP & WEATHER (tích hợp) --------------------
let ipData = {
    ip: "Checking...", isp: "Checking...", location: "Checking...",
    city: "Checking...", lat: null, lon: null, ready: false
};
let ipViewState = 0; // 0:IP, 1:ISP, 2:Location
let ipFetching = false; // Ngăn fetch trùng lặp

function normalizeISP(isp) {
    if (!isp || isp === "Unknown ISP" || isp === "Network Hidden") return "Unknown ISP";
    let clean = isp.replace(/^AS\d+\s*/i, '').replace(/\s*AS\d+$/i, '').replace(/^ASN\s*/i, '').replace(/\s*\(AS\d+\)/i, '').replace(/^"|"$/g, '').trim();
    if (!clean) return "Unknown ISP";
    return clean.length > 25 ? clean.substring(0, 22) + "..." : clean;
}

function isValidIP(ip) {
    if (!ip || ip === "undefined" || ip === "null") return false;
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Pattern.test(ip)) return false;
    return ip.split('.').every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}

async function checkip_address() {
    // Ngăn gọi trùng lặp
    if (ipFetching) return;
    ipFetching = true;

    const sources = [
        {
            name: "ipinfo.io",
            url: "https://ipinfo.io/json",
            parse: (data) => {
                if (!isValidIP(data.ip)) throw new Error("Invalid IP");
                const loc = data.loc ? data.loc.split(',') : [null, null];
                return {
                    ip: data.ip,
                    isp: data.org || "Unknown ISP",
                    city: data.city || "Unknown",
                    location: `${data.city || "Unknown"}, ${data.country || "Unknown"}`,
                    lat: parseFloat(loc[0]) || null,
                    lon: parseFloat(loc[1]) || null
                };
            }
        },
        {
            name: "ipwho.is",
            url: "https://ipwho.is/",
            parse: (data) => {
                if (!data.success || !isValidIP(data.ip)) throw new Error("API not success");
                return {
                    ip: data.ip,
                    isp: data.connection?.isp || data.isp || "Unknown ISP",
                    city: data.city || "Unknown",
                    location: `${data.city || "Unknown"}, ${data.country || "Unknown"}`,
                    lat: data.latitude || null,
                    lon: data.longitude || null
                };
            }
        }
    ];

    for (const src of sources) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 4000);
            const res = await fetch(src.url, { signal: controller.signal });
            clearTimeout(timeout);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const parsed = src.parse(data);
            parsed.isp = normalizeISP(parsed.isp);
            ipData = { ...ipData, ...parsed, ready: true };
            ipFetching = false;
            rotateIPInfo();
            updateWeatherData(parsed.lat, parsed.lon, parsed.city);
            return;
        } catch (e) {
            console.warn(`${src.name} failed:`, e.message);
        }
    }

    // Fallback
    ipData = {
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        isp: "Local Network",
        city: "Local",
        location: "Local Network",
        lat: 21.0285,
        lon: 105.8542,
        ready: true
    };
    ipFetching = false;
    rotateIPInfo();
    updateWeatherData(21.0285, 105.8542, "Hanoi");
}

// Cache DOM element cho rotateIPInfo
let ipElement = null;
let ipRotateTimer = null;

function rotateIPInfo() {
    if (!ipData.ready) return;
    if (!ipElement) ipElement = document.getElementById("checkip_address");
    if (!ipElement) return;

    ipElement.style.opacity = 0;

    // Dùng biến đã clear để tránh overlap
    clearTimeout(ipRotateTimer);
    ipRotateTimer = setTimeout(() => {
        let icon, text, color;
        if (ipViewState === 0) {
            icon = '<i class="fas fa-globe" style="margin-right:6px;color:#00FFFF;"></i>';
            text = `<span style="color:#00FFFF;font-weight:bold;">${ipData.ip}</span>`;
            color = "#00FFFF";
            ipViewState = 1;
        } else if (ipViewState === 1) {
            icon = '<i class="fas fa-network-wired" style="margin-right:6px;color:#F1C40F;"></i>';
            text = `<span style="color:#F1C40F;font-weight:bold;">${ipData.isp}</span>`;
            color = "#F1C40F";
            ipViewState = 2;
        } else {
            icon = '<i class="fas fa-map-marker-alt" style="margin-right:6px;color:#2ECC71;"></i>';
            text = `<span style="color:#2ECC71;font-weight:bold;">${ipData.location}</span>`;
            color = "#2ECC71";
            ipViewState = 0;
        }
        ipElement.innerHTML = icon + text;
        ipElement.style.color = color;
        ipElement.title = `IP: ${ipData.ip}\nISP: ${ipData.isp}\nLocation: ${ipData.location}\nCity: ${ipData.city}`;
        ipElement.style.opacity = 1;
    }, 300);
}

// Weather
let wData = { city: "Loading...", temp: "--", rain_mm: 0, rain_prob: 0, aqi: "--", ready: false };
let viewState = 0;
let weatherFetching = false;

async function updateWeatherData(customLat, customLon, customCity) {
    if (weatherFetching) return;
    weatherFetching = true;

    const lat = customLat || ipData.lat || 21.0285;
    const lon = customLon || ipData.lon || 105.8542;
    const city = customCity || ipData.city || "Hanoi";
    wData.city = city;
    const locEl = document.getElementById('weather_loc');
    if (locEl) locEl.textContent = city;

    // Fetch weather và AQI song song thay vì tuần tự
    const weatherPromise = fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation&hourly=precipitation_probability&timezone=auto`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(wJson => {
            if (wJson.current) {
                wData.temp = Math.round(wJson.current.temperature_2m);
                wData.rain_mm = wJson.current.precipitation || 0;
                if (wJson.hourly?.precipitation_probability) {
                    const hour = new Date().getHours();
                    wData.rain_prob = wJson.hourly.precipitation_probability[hour] || 0;
                }
            }
        })
        .catch(e => console.warn("Weather fetch error:", e));

    const aqiPromise = fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(aqiJson => {
            if (aqiJson.current?.us_aqi !== undefined) wData.aqi = aqiJson.current.us_aqi;
        })
        .catch(e => console.warn("AQI fetch error:", e));

    await Promise.allSettled([weatherPromise, aqiPromise]);

    wData.ready = true;
    weatherFetching = false;

    if (!window.weatherInitialized) {
        rotateView();
        window.weatherInitialized = true;
    }
}

// Cache DOM elements cho rotateView
let weatherTempEl = null;
let weatherIconEl = null;
let weatherRotateTimer = null;

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
            if (weatherIconEl) {
                weatherIconEl.className = "fas fa-cloud-rain";
                weatherIconEl.style.color = "#3498db";
            }
            const rain = wData.rain_mm > 0 ? `${parseFloat(wData.rain_mm).toFixed(1)}mm (${Math.round(wData.rain_prob)}%)` : `${Math.round(wData.rain_prob)}%`;
            weatherTempEl.innerHTML = `<span style="font-weight:bold;">${rain}</span>`;
            viewState = 2;
        } else {
            if (weatherIconEl) {
                weatherIconEl.className = "fas fa-wind";
                let color = "#27ae60";
                if (wData.aqi > 50) color = "#f1c40f";
                if (wData.aqi > 100) color = "#e67e22";
                if (wData.aqi > 150) color = "#e74c3c";
                weatherIconEl.style.color = color;
            }
            weatherTempEl.innerHTML = `<span style="font-weight:bold;">AQI ${Math.round(wData.aqi)}</span>`;
            viewState = 0;
        }
        weatherTempEl.style.opacity = 1;
    }, 300);
}

// -------------------- SKILL BARS ANIMATION (IntersectionObserver + rAF) --------------------
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-per');
    if (!skillBars.length) return;

    function animateBar(bar) {
        const targetPer = parseInt(bar.getAttribute('per'), 10);
        if (isNaN(targetPer)) return;

        const duration = 3000;
        let startTime = null;

        function step(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            const percentage = Math.min((progress / duration) * targetPer, targetPer);
            const floored = Math.floor(percentage);

            // Batch write: chỉ update khi giá trị thực sự thay đổi
            bar.style.width = floored + '%';
            bar.setAttribute('per', floored + '%');

            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                bar.style.width = targetPer + '%';
                bar.setAttribute('per', targetPer + '%');
            }
        }

        requestAnimationFrame(step);
    }

    // Dùng IntersectionObserver: chỉ animate khi skill bars vào viewport
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => observer.observe(bar));
    } else {
        // Fallback cho trình duyệt cũ
        skillBars.forEach(bar => animateBar(bar));
    }
}

// -------------------- INTERVALS & LISTENERS --------------------
// Lưu trữ interval IDs để có thể cleanup
let intervalsIds = [];

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    contentElement = document.querySelector(".contentLetter");
    fpsElement = document.getElementById("fps");

    // Khởi tạo FPS counter
    fpsStart = performance.now();
    fpsFrame = 0;
    fpsRafId = requestAnimationFrame(fpsTick);

    // Khởi tạo IP + Toast (thay thế onCreate/onLoad)
    ShowToast();
    checkip_address();

    // Khởi tạo typewriter
    typeEffect();

    // Khởi tạo date counter
    updateDateCreated();

    // Khởi tạo skill bars
    initSkillBars();

    // Intervals - với tần suất hợp lý
    intervalsIds.push(setInterval(rotateIPInfo, 4000));
    intervalsIds.push(setInterval(rotateView, 4000));
    // Cập nhật weather mỗi 10 phút
    intervalsIds.push(setInterval(() => { if (ipData.ready) updateWeatherData(); }, 600000));
    // Retry IP nếu đang dùng fallback - mỗi 5 phút
    intervalsIds.push(setInterval(() => { if (ipData.ready && ipData.ip.startsWith("192.168.")) checkip_address(); }, 300000));
});

// Tạm dừng animations khi tab không active → tiết kiệm CPU/pin
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Dừng FPS counter khi tab ẩn
        if (fpsRafId) {
            cancelAnimationFrame(fpsRafId);
            fpsRafId = null;
        }
        // Dừng date counter
        if (dateInterval) {
            clearInterval(dateInterval);
            dateInterval = null;
        }
        // Dừng typewriter
        if (typewriterTimer) {
            clearTimeout(typewriterTimer);
            typewriterTimer = null;
        }
    } else {
        // Khôi phục khi quay lại tab
        fpsStart = performance.now();
        fpsFrame = 0;
        if (!fpsRafId) fpsRafId = requestAnimationFrame(fpsTick);

        if (!dateInterval) updateDateCreated();

        if (!typewriterTimer) typeEffect();
    }
});

// Refresh thủ công khi click vào IP
document.addEventListener('click', (e) => {
    if (e.target.closest('#checkip_address')) {
        if (ipFetching) return; // Đang fetch rồi thì bỏ qua
        ipData.ready = false;
        const ipEl = document.getElementById("checkip_address");
        if (ipEl) ipEl.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
        setTimeout(checkip_address, 500);
    }
});