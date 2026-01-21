//////////////////////////////////////////////////////////////
function onCreate() {
    ShowToast();
}
//▬▬▬▬▬▬▬▬▬▬
// TOAST
//▬▬▬▬▬▬▬▬▬▬
function ShowToast() {
    var x = document.getElementById("Toast");
    x.className = "show";
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3900);
}

//▬▬▬▬▬▬▬▬▬▬
// TEXT
//▬▬▬▬▬▬▬▬▬▬
const text = "Hello everyone, I'm a Developer.\nI like website design :3"; // Nội dung cần gõ chữ
const delay = 150; // Thời gian trễ giữa các ký tự (milliseconds)

const contentLetter = document.querySelector(".contentLetter");
let index = 0;
let isDeleting = false;

function typeEffect() {
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

typeEffect();

//▬▬▬▬▬▬▬▬▬▬
// FPS WEBS
//▬▬▬▬▬▬▬▬▬▬
var fps = document.getElementById("fps");

var startTime = Date.now();

var frame = 0;

function tick() {

    var time = Date.now();

    frame++;

    if (time - startTime > 1000) {

        fps.innerHTML = (frame / ((time - startTime) / 1000)).toFixed(1);

        startTime = time;

        frame = 0;

    }
    window.requestAnimationFrame(tick);

}

tick();
//▬▬▬▬▬▬▬▬▬▬
// FPS
//▬▬▬▬▬▬▬▬▬▬


        var fps = document.getElementById("fps");
        var startTime = Date.now();
        var frame = 0;

        function tick() {
            var time = Date.now();
            frame++;
            if (time - startTime > 1000) {
                fps.innerHTML = (frame / ((time - startTime) / 1000)).toFixed(1);
                startTime = time;
                frame = 0;
            }
            window.requestAnimationFrame(tick);
        }
        tick();
//▬▬▬▬▬▬▬▬▬▬
// LINK
//▬▬▬▬▬▬▬▬▬▬

function TikTok() {
    setTimeout(function() {
            window.open('https://www.tiktok.com/@duy.khanh98', 'ultimate')
        },
        100);
}

function Facebook() {
    setTimeout(function() {
            window.open('https://www.facebook.com/profile.php?id=100084065153231&mibextid=ZbWKwL', 'ultimate')
        },
        100);
}

function Instagram() {
    setTimeout(function() {
            window.open('https://github.com/DuyKhanh068', 'ultimate')
        },
        100);
}

function Telegram() {
    setTimeout(function() {
            window.open('https://youtube.com/@DuyyKhanh68', 'ultimate')
        },
        100);
}

function DarkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}
//▬▬▬▬▬▬▬▬▬▬
// MUSIC
//▬▬▬▬▬▬▬▬▬▬
var all_down_sum = 0;
var run = false;
var checkIP = false;
var visibl = true;
var thread_down = [];
var lsat_all_down = 0;
var refresh_lay = 5e3;
async function start_thread(index) {
    try {
        const response = await fetch(testurl, {
            cache: "no-store",
            mode: "cors",
            referrerPolicy: "no-referrer"
        });
        const reader = response.body.getReader();
        while (true) {
            const {
                value,
                done
            } = await reader.read();
            if (done) {
                reader.cancel();
                start_thread(index);
                break;
            }
            if (!run) {
                reader.cancel();
                break;
            }
            thread_down[index] += value.length;
        }
    } catch (err) {
        console.log(err);
        if (run) start_thread(index);
    }
}
var gbip = ""; 
function checkip_address() {
    function ckip(ip_addr, tag) {
    }
    if (visibl) {
        fetch("https://api-ipv4.ip.sb/geoip", {
            referrerPolicy: "no-referrer"
        }).then(response => response.json()).then(data => {
            var tag = document.getElementById("checkip_address");
            tag.innerText = data.ip + " " + data.isp;
            if (data.ip !== gbip) {
                tag.style.color = "";
                ckip(data.ip, tag);
            }
            gbip = data.ip;
        });
    }
    setTimeout(checkip_address, 3000);
}
function noisong() {
    function ckip(ip_addr, tag) {
    }
    if (visibl) {
        fetch("https://api-ipv4.ip.sb/geoip", {
            referrerPolicy: "no-referrer"
        }).then(response => response.json()).then(data => {
            var tag = document.getElementById("checkip_address");
            tag.innerText = data.region + " " + data.country;
            if (data.ip !== gbip) {
                tag.style.color = "";
                ckip(data.ip, tag);
            }
            gbip = data.ip;
        });
    }
    setTimeout(noisong, 5000);
}
checkip_address();
noisong();


