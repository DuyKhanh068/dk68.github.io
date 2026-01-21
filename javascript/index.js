/* =======================================================================
   PHẦN 1: KHỞI TẠO VÀ CÁC HIỆU ỨNG GIAO DIỆN (UI)
   ======================================================================= */

// Hàm chạy khi web tải xong
function onCreate() {
    ShowToast();
    updateWeatherData(); // Gọi hàm lấy dữ liệu thời tiết & AQI
    checkip_address();   // Gọi hàm hiển thị IP
}

// --- Hiệu ứng Toast (Thông báo nổi) ---
function ShowToast() {
    var x = document.getElementById("Toast");
    if (x) {
        x.className = "show";
        setTimeout(function() { x.className = x.className.replace("show", ""); }, 3900);
    }
}

// --- Hiệu ứng gõ chữ (Typewriter) ---
const text = "Hello everyone, I'm a Developer.\nI like website design :3";
const delay = 150;
const contentLetter = document.querySelector(".contentLetter");
let index = 0;
let isDeleting = false;

function typeEffect() {
    if (contentLetter) {
        if (index < text.length && !isDeleting) {
            if (text.charAt(index) === "\n") {
                contentLetter.innerHTML += "<br>";
            } else {
                contentLetter.innerHTML += text.charAt(index);
            }
            index++;
            setTimeout(typeEffect, delay);
        } else if (isDeleting) {
            contentLetter.innerHTML = contentLetter.innerHTML.slice(0, -1);
            if (contentLetter.innerHTML === "") {
                isDeleting = false;
                index = 0;
                setTimeout(typeEffect, delay);
            } else {
                setTimeout(typeEffect, delay / 1);
            }
        } else {
            isDeleting = true;
            setTimeout(typeEffect, delay);
        }
    }
}
typeEffect();

// --- Chế độ tối (Dark Mode) ---
function DarkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

/* =======================================================================
   PHẦN 2: CÁC TIỆN ÍCH HỆ THỐNG (FPS, LIÊN KẾT)
   ======================================================================= */

// --- Bộ đếm FPS ---
var fps = document.getElementById("fps");
var startTime = Date.now();
var frame = 0;

function tick() {
    var time = Date.now();
    frame++;
    if (time - startTime > 1000) {
        if (fps) {
            fps.innerHTML = (frame / ((time - startTime) / 1000)).toFixed(1);
        }
        startTime = time;
        frame = 0;
    }
    window.requestAnimationFrame(tick);
}
tick();

// --- Mở liên kết Mạng xã hội ---
function OpenUrl(url) {
    setTimeout(function() {
        window.open(url, '_blank');
    }, 100);
}

function TikTok() { OpenUrl('https://www.tiktok.com/@duy.khanh98'); }
function Facebook() { OpenUrl('https://www.facebook.com/profile.php?id=100084065153231'); }
function Instagram() { OpenUrl('https://github.com/DuyKhanh068'); }
function Telegram() { OpenUrl('https://youtube.com/@DuyyKhanh68'); }

/* =======================================================================
   PHẦN 3: XỬ LÝ NHẠC (AUDIO PLAYER)
   ======================================================================= */

// Danh sách bài hát random (Từ 1 đến 20)
const songList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; 

function getRandomAudio() {
    const randomIndex = Math.floor(Math.random() * songList.length);
    const songId = songList[randomIndex];
    return 'music/' + songId + '.mp3';
}

function playMusic() {
    var audio = document.getElementById("myAudio");
    if(audio) {
        audio.src = getRandomAudio();
        audio.play().catch(error => {
            console.log("Phát nhạc thất bại (Do trình duyệt chặn autoplay): " + error);
        });
        
        // Tự động chuyển bài khi hết
        audio.onended = function() {
            playMusic();
        };
    }
}

function hideNotification() {
    var notif = document.getElementById("notification");
    if(notif) {
        notif.style.display = "none";
        playMusic();
    }
}

/* =======================================================================
   PHẦN 4: HIỂN THỊ IP - NHÀ MẠNG - TỈNH (ĐÃ BỎ NGUỒN IPWHO)
   ======================================================================= */

// Biến lưu thông tin
let ipData = {
    ip: "Checking...",
    isp: "Checking...",
    location: "Checking...",
    ready: false
};

let ipViewState = 0; // 0: IP, 1: ISP, 2: Tỉnh

// --- Hàm chính: Tự động thử các nguồn ---
async function checkip_address() {
    console.log("Đang lấy IP (Đã bỏ nguồn ipwho)...");

    // DANH SÁCH CÁC API (Chỉ còn 2 nguồn)
    const sources = [
        {
            // Nguồn 1: ipapi.co (Ưu tiên số 1 - Lấy được tên Nhà mạng)
            url: "https://ipapi.co/json/",
            parse: (data) => ({
                ip: data.ip,
                isp: data.org || data.asn, // Lấy tên nhà mạng
                loc: `${data.city}, ${data.country_name}`
            })
        },
        {
            // Nguồn 2: db-ip.com (Dự phòng - Nhanh nhưng không hiện tên mạng)
            url: "https://api.db-ip.com/v2/free/self",
            parse: (data) => ({
                ip: data.ipAddress,
                isp: "Network Hidden", // Nguồn này không cung cấp tên mạng miễn phí
                loc: `${data.city}, ${data.countryName}`
            })
        }
    ];

    // Vòng lặp thử từng nguồn
    for (const source of sources) {
        try {
            const response = await fetch(source.url);
            if (!response.ok) throw new Error("Lỗi mạng");
            
            const data = await response.json();
            const parsed = source.parse(data);

            // Nếu thành công thì lưu và dừng lại
            ipData.ip = parsed.ip || "Unknown IP";
            ipData.isp = parsed.isp || "Unknown ISP";
            ipData.location = parsed.loc || "Unknown Loc";
            ipData.ready = true;
            
            console.log("Thành công từ:", source.url);
            rotateIPInfo(); // Cập nhật ngay
            return; 
            
        } catch (err) {
            console.log(`Nguồn ${source.url} lỗi, thử nguồn tiếp theo...`);
        }
    }

    // Nếu cả 2 nguồn đều lỗi
    ipData.ip = "Hidden";
    ipData.isp = "Hidden";
    ipData.location = "Hidden";
    ipData.ready = true;
    rotateIPInfo();
}

// --- Hàm hiển thị xoay vòng ---
function rotateIPInfo() {
    if (!ipData.ready) return;

    const el = document.getElementById("checkip_address");
    if (el) {
        // Hiệu ứng mờ
        el.style.transition = "opacity 0.3s";
        el.style.opacity = 0;

        setTimeout(() => {
            if (ipViewState === 0) {
                // HIỂN THỊ IP
                el.innerText = `IP: ${ipData.ip}`;
                el.style.color = "#00FFFF"; // Cyan
                ipViewState = 1;
            } 
            else if (ipViewState === 1) {
                // HIỂN THỊ NHÀ MẠNG
                el.innerText = `ISP: ${ipData.isp}`;
                el.style.color = "#F1C40F"; // Vàng
                ipViewState = 2;
            } 
            else {
                // HIỂN THỊ VỊ TRÍ
                el.innerText = `Loc: ${ipData.location}`;
                el.style.color = "#2ECC71"; // Xanh lá
                ipViewState = 0;
            }
            // Hiện lại
            el.style.opacity = 1;
        }, 300);
    }
}

// Kích hoạt
checkip_address();
setInterval(rotateIPInfo, 4000); // 3 giây đổi thông tin
/* =======================================================================
   PHẦN 5: THỜI TIẾT TỰ ĐỘNG XOAY VÒNG (TEMP -> RAIN -> AQI)
   ======================================================================= */

// Biến lưu trữ dữ liệu thời tiết
let wData = {
    city: "Vietnam",
    temp: "--",
    rain_mm: 0,     // Lượng mưa (mm)
    rain_prob: 0,   // Xác suất mưa (%)
    aqi: "--",      // Chỉ số AQI
    ready: false    // Đánh dấu đã tải xong
};

let viewState = 0; // 0: Nhiệt độ, 1: Mưa, 2: AQI

async function updateWeatherData() {
    let lat = 21.0285; // Mặc định Hà Nội
    let lon = 105.8542;

    // B1: Lấy tọa độ từ IP
    try {
        const locRes = await fetch('https://ipwho.is/');
        const locData = await locRes.json();
        if (locData.success) {
            lat = locData.latitude;
            lon = locData.longitude;
            wData.city = locData.city;
        }
    } catch (e) { console.log("Lỗi lấy vị trí"); }

    // B2: Lấy Thời tiết (Nhiệt độ, Lượng mưa, Xác suất mưa)
    try {
        // precipitation: Lượng mưa hiện tại
        // precipitation_probability: Xác suất mưa (hourly)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation&hourly=precipitation_probability&timezone=auto`;
        const wRes = await fetch(weatherUrl);
        const wJson = await wRes.json();
        
        if (wJson.current) {
            wData.temp = wJson.current.temperature_2m;
            wData.rain_mm = wJson.current.precipitation;
            
            // Lấy % mưa của giờ hiện tại
            if(wJson.hourly && wJson.hourly.precipitation_probability) {
                 const currentHour = new Date().getHours();
                 // API trả về mảng theo giờ, lấy index theo giờ hiện tại
                 wData.rain_prob = wJson.hourly.precipitation_probability[currentHour] || 0;
            }
        }
    } catch (e) { console.log("Lỗi lấy thời tiết"); }

    // B3: Lấy chỉ số AQI (Chất lượng không khí)
    try {
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;
        const aqiRes = await fetch(aqiUrl);
        const aqiJson = await aqiRes.json();
        if (aqiJson.current) {
            wData.aqi = aqiJson.current.us_aqi;
        }
    } catch (e) { console.log("Lỗi lấy AQI"); }

    wData.ready = true;
    
    // Cập nhật tên thành phố ngay lập tức
    const elLoc = document.getElementById('weather_loc');
    if(elLoc) elLoc.innerText = wData.city;
}

// Hàm xoay vòng hiển thị (Chạy mỗi 4 giây)
function rotateView() {
    if (!wData.ready) return; // Chưa có dữ liệu thì không chạy

    // Bạn cần đảm bảo HTML có các thẻ span id="weather_loc" và "weather_temp" (hoặc dynamic)
    // Ở đây ta tái sử dụng thẻ weather_temp để hiển thị nội dung động
    const elDynamic = document.getElementById('weather_temp');
    
    // Tìm thẻ icon (nếu có class fas fa-temperature-high trong HTML của bạn)
    // Để code chạy tốt với HTML cũ, ta sẽ tìm thẻ <i> nằm cùng cha với weather_temp
    let elIcon = null;
    if(elDynamic && elDynamic.parentElement) {
        elIcon = elDynamic.parentElement.querySelector('i');
    }

    if(elDynamic) {
        // Tạo hiệu ứng mờ dần (Reset animation)
        elDynamic.style.opacity = 0; 
        
        setTimeout(() => {
            if (viewState === 0) {
                // HIỂN THỊ NHIỆT ĐỘ
                if(elIcon) {
                    elIcon.className = "fas fa-temperature-high"; 
                    elIcon.style.color = "#f1c40f"; // Vàng
                }
                elDynamic.innerText = wData.temp + "°C";
                viewState = 1;
            } 
            else if (viewState === 1) {
                // HIỂN THỊ MƯA
                if(elIcon) {
                    elIcon.className = "fas fa-cloud-rain"; 
                    elIcon.style.color = "#3498db"; // Xanh dương
                }
                // Ví dụ: 0.5mm (20%)
                elDynamic.innerText = `${wData.rain_mm}mm (${wData.rain_prob}%)`;
                viewState = 2;
            } 
            else {
                // HIỂN THỊ AQI
                if(elIcon) {
                    elIcon.className = "fas fa-lungs"; 
                    // Đổi màu icon theo mức độ ô nhiễm
                    let color = "#2ecc71"; // Xanh (Tốt)
                    if (wData.aqi > 50) color = "#f1c40f"; // Vàng (Trung bình)
                    if (wData.aqi > 100) color = "#e74c3c"; // Đỏ (Kém)
                    elIcon.style.color = color;
                }
                elDynamic.innerText = "AQI " + wData.aqi;
                viewState = 0;
            }
            // Hiện lại
            elDynamic.style.opacity = 1;
        }, 200); // Đợi 200ms để hiệu ứng mờ hoạt động
    }
}

// Kích hoạt các timer
setInterval(updateWeatherData, 600000); // 10 phút cập nhật dữ liệu mới
setInterval(rotateView, 4000); // 4 giây đổi thông tin hiển thị 1 lần