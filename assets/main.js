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
const contentElement = document.querySelector(".contentLetter");

let charIndex = 0;
let isDeleting = false;

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

    setTimeout(typeEffect, typingSpeed);
}

document.addEventListener("DOMContentLoaded", typeEffect);

// -------------------- FPS COUNTER --------------------
const fpsElement = document.getElementById("fps");
let fpsStart = Date.now();
let fpsFrame = 0;
function fpsTick() {
    const now = Date.now();
    fpsFrame++;
    if (now - fpsStart > 1000) {
        if (fpsElement) {
            fpsElement.textContent = (fpsFrame / ((now - fpsStart) / 1000)).toFixed(1);
        }
        fpsStart = now;
        fpsFrame = 0;
    }
    requestAnimationFrame(fpsTick);
}
fpsTick();

// -------------------- MUSIC PLAYER --------------------
const songList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
function getRandomAudio() {
    const randomIndex = Math.floor(Math.random() * songList.length);
    return `music/${songList[randomIndex]}.mp3`;
}
function playMusic() {
    const audio = document.getElementById("myAudio");
    if (!audio) return;
    audio.src = getRandomAudio();
    audio.play().catch(e => console.log("Autoplay blocked:", e));
    audio.onended = () => playMusic();
}
function hideNotification() {
    const notif = document.getElementById("notification");
    if (notif) notif.style.display = "none";
    playMusic();
}

// -------------------- DATE CREATED (time‑activated) --------------------
function updateDateCreated() {
    const momk = document.getElementById("momk");
    if (!momk) return;
    const birthDay = new Date("2023/08/06");
    const today = new Date();
    const diff = today - birthDay;
    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    momk.textContent = `${days} ngày ${hours} giờ ${minutes} phút ${secs} giây`;
    setTimeout(updateDateCreated, 1000);
}
updateDateCreated();

// -------------------- IP & WEATHER (tích hợp) --------------------
let ipData = {
    ip: "Checking...", isp: "Checking...", location: "Checking...",
    city: "Checking...", lat: null, lon: null, ready: false
};
let ipViewState = 0; // 0:IP, 1:ISP, 2:Location

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
            name: "ip-api.com",
            url: "http://ip-api.com/json/?fields=status,message,country,city,lat,lon,query,org",
            parse: (data) => {
                if (data.status !== "success" || !isValidIP(data.query)) throw new Error("API error");
                return {
                    ip: data.query,
                    isp: data.org || "Unknown ISP",
                    city: data.city || "Unknown",
                    location: `${data.city || "Unknown"}, ${data.country || "Unknown"}`,
                    lat: data.lat || null,
                    lon: data.lon || null
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
            rotateIPInfo();
            updateWeatherData(parsed.lat, parsed.lon, parsed.city);
            return;
        } catch (e) {
            console.warn(`${src.name} failed:`, e.message);
        }
    }
    // Fallback
    ipData = {
        ip: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        isp: "Local Network",
        city: "Local",
        location: "Local Network",
        lat: 21.0285,
        lon: 105.8542,
        ready: true
    };
    rotateIPInfo();
    updateWeatherData(21.0285, 105.8542, "Hanoi");
}

function rotateIPInfo() {
    if (!ipData.ready) return;
    const el = document.getElementById("checkip_address");
    if (!el) return;
    el.style.transition = "opacity 0.3s";
    el.style.opacity = 0;
    setTimeout(() => {
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
        el.innerHTML = icon + text;
        el.style.color = color;
        el.title = `IP: ${ipData.ip}\nISP: ${ipData.isp}\nLocation: ${ipData.location}\nCity: ${ipData.city}`;
        el.style.opacity = 1;
    }, 300);
}

// Weather
let wData = { city: "Loading...", temp: "--", rain_mm: 0, rain_prob: 0, aqi: "--", ready: false };
let viewState = 0;

async function updateWeatherData(customLat, customLon, customCity) {
    const lat = customLat || ipData.lat || 21.0285;
    const lon = customLon || ipData.lon || 105.8542;
    const city = customCity || ipData.city || "Hanoi";
    wData.city = city;
    const locEl = document.getElementById('weather_loc');
    if (locEl) locEl.textContent = city;

    try {
        const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation&hourly=precipitation_probability&timezone=auto`);
        if (wRes.ok) {
            const wJson = await wRes.json();
            if (wJson.current) {
                wData.temp = Math.round(wJson.current.temperature_2m);
                wData.rain_mm = wJson.current.precipitation || 0;
                if (wJson.hourly?.precipitation_probability) {
                    const hour = new Date().getHours();
                    wData.rain_prob = wJson.hourly.precipitation_probability[hour] || 0;
                }
            }
        }
    } catch (e) { console.warn("Weather fetch error:", e); }

    try {
        const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`);
        if (aqiRes.ok) {
            const aqiJson = await aqiRes.json();
            if (aqiJson.current?.us_aqi !== undefined) wData.aqi = aqiJson.current.us_aqi;
        }
    } catch (e) { console.warn("AQI fetch error:", e); }

    wData.ready = true;
    if (!window.weatherInitialized) {
        rotateView();
        window.weatherInitialized = true;
    }
}

function rotateView() {
    if (!wData.ready) return;
    const el = document.getElementById('weather_temp');
    const icon = el?.parentElement?.querySelector('i');
    if (!el) return;
    el.style.transition = "opacity 0.3s";
    el.style.opacity = 0;
    setTimeout(() => {
        if (viewState === 0) {
            if (icon) {
                icon.className = "fas fa-temperature-high";
                icon.style.color = wData.temp > 30 ? "#e74c3c" : wData.temp > 25 ? "#f39c12" : "#3498db";
            }
            el.innerHTML = `<span style="font-weight:bold;">${Math.round(wData.temp)}°C</span>`;
            viewState = 1;
        } else if (viewState === 1) {
            if (icon) {
                icon.className = "fas fa-cloud-rain";
                icon.style.color = "#3498db";
            }
            const rain = wData.rain_mm > 0 ? `${parseFloat(wData.rain_mm).toFixed(1)}mm (${Math.round(wData.rain_prob)}%)` : `${Math.round(wData.rain_prob)}%`;
            el.innerHTML = `<span style="font-weight:bold;">${rain}</span>`;
            viewState = 2;
        } else {
            if (icon) {
                icon.className = "fas fa-wind";
                let color = "#27ae60";
                if (wData.aqi > 50) color = "#f1c40f";
                if (wData.aqi > 100) color = "#e67e22";
                if (wData.aqi > 150) color = "#e74c3c";
                icon.style.color = color;
            }
            el.innerHTML = `<span style="font-weight:bold;">AQI ${Math.round(wData.aqi)}</span>`;
            viewState = 0;
        }
        el.style.opacity = 1;
    }, 300);
}

// -------------------- SKILL BARS ANIMATION (Vanilla JS) --------------------
document.addEventListener("DOMContentLoaded", () => {
    const skillBars = document.querySelectorAll('.skill-per');

    skillBars.forEach(bar => {
        // Lấy con số % đích đến từ thuộc tính 'per'
        const targetPer = parseInt(bar.getAttribute('per'), 10);
        const duration = 3000; // Thời gian chạy hiệu ứng (3000ms = 3 giây)
        let startTime = null;

        function animateSkill(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            
            // Tính toán phần trăm hiện tại dựa trên thời gian trôi qua
            const percentage = Math.min((progress / duration) * targetPer, targetPer);

            // Cập nhật giao diện
            bar.style.width = Math.floor(percentage) + '%';
            bar.setAttribute('per', Math.floor(percentage) + '%');

            if (progress < duration) {
                // Tiếp tục gọi animation frame tiếp theo nếu chưa hết thời gian
                requestAnimationFrame(animateSkill);
            } else {
                // Đảm bảo số cuối cùng chính xác khi kết thúc
                bar.style.width = targetPer + '%';
                bar.setAttribute('per', targetPer + '%');
            }
        }

        // Bắt đầu hiệu ứng
        requestAnimationFrame(animateSkill);
    });
});

// -------------------- INTERVALS & LISTENERS --------------------
document.addEventListener('DOMContentLoaded', () => {
    setInterval(rotateIPInfo, 4000);
    setInterval(rotateView, 4000);
    setInterval(() => { if (ipData.ready) updateWeatherData(); }, 600000);
    setInterval(() => { if (ipData.ready && ipData.ip.startsWith("192.168.")) checkip_address(); }, 300000);
});

// Refresh thủ công khi click vào IP
document.addEventListener('click', (e) => {
    if (e.target.closest('#checkip_address')) {
        ipData.ready = false;
        const ipEl = document.getElementById("checkip_address");
        if (ipEl) ipEl.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
        setTimeout(checkip_address, 500);
    }
});