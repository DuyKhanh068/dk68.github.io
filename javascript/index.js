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
const text = "Hey brother, I'm a Developer.\nI like website design :3"; // Nội dung cần gõ chữ
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
            window.open('https://www.tiktok.com', 'ultimate')
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
            window.open('https://github.com/', 'ultimate')
        },
        100);
}

function Telegram() {
    setTimeout(function() {
            window.open('https://t.me/', 'ultimate')
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


// HOA ANH DAO
//▬▬▬▬▬▬▬▬▬▬
/*

var stop, staticx;
var img = new Image();
img.src = "https://i.imgur.com/R9XUjfF.png";

			function Sakura(x, y, s, r, fn) {
				this.x = x;
				this.y = y;
				this.s = s;
				this.r = r;
				this.fn = fn;
			}

			Sakura.prototype.draw = function(cxt) {
				cxt.save();
				var xc = 40 * this.s / 4;
				cxt.translate(this.x, this.y);
				cxt.rotate(this.r);
				cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s)
				cxt.restore();
			}

			Sakura.prototype.update = function() {
				this.x = this.fn.x(this.x, this.y);
				this.y = this.fn.y(this.y, this.y);
				this.r = this.fn.r(this.r);
				if(this.x > window.innerWidth ||
					this.x < 0 ||
					this.y > window.innerHeight ||
					this.y < 0
				) {
					this.r = getRandom('fnr');
					if(Math.random() > 0.4) {
						this.x = getRandom('x');
						this.y = 0;
						this.s = getRandom('s');
						this.r = getRandom('r');
					} else {
						this.x = window.innerWidth;
						this.y = getRandom('y');
						this.s = getRandom('s');
						this.r = getRandom('r');
					}
				}
			}

			SakuraList = function() {
				this.list = [];
			}
			SakuraList.prototype.push = function(sakura) {
				this.list.push(sakura);
			}
			SakuraList.prototype.update = function() {
				for(var i = 0, len = this.list.length; i < len; i++) {
					this.list[i].update();
				}
			}
			SakuraList.prototype.draw = function(cxt) {
				for(var i = 0, len = this.list.length; i < len; i++) {
					this.list[i].draw(cxt);
				}
			}
			SakuraList.prototype.get = function(i) {
				return this.list[i];
			}
			SakuraList.prototype.size = function() {
				return this.list.length;
			}

			function getRandom(option) {
				var ret, random;
				switch(option) {
					case 'x':
						ret = Math.random() * window.innerWidth;
						break;
					case 'y':
						ret = Math.random() * window.innerHeight;
						break;
					case 's':
						ret = Math.random();
						break;
					case 'r':
						ret = Math.random() * 5;
						break;
					case 'fnx':
						random = -0.5 + Math.random() * 1;
						ret = function(x, y) {
							return x + 0.5 * random - 1;
						};
						break;
					case 'fny':
						random = 0.5 + Math.random() * 0.5
						ret = function(x, y) {
							return y + random;
						};
						break;
					case 'fnr':
						random = Math.random() * 0.01;
						ret = function(r) {
							return r + random;
						};
						break;
				}
				return ret;
			}

			function startSakura() {

				requestAnimationFrame = window.requestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					window.oRequestAnimationFrame;
				var canvas = document.createElement('canvas'),
					cxt;
				staticx = true;
				canvas.height = window.innerHeight;
				canvas.width = window.innerWidth;
				canvas.setAttribute('style', 'position: fixed;left: 0;top: 0;pointer-events: none;');
				canvas.setAttribute('id', 'canvas_sakura');
				document.getElementsByTagName('body')[0].appendChild(canvas);
				cxt = canvas.getContext('2d');
				var sakuraList = new SakuraList();
				for(var i = 0; i < 50; i++) {
					var sakura, randomX, randomY, randomS, randomR, randomFnx, randomFny;
					randomX = getRandom('x');
					randomY = getRandom('y');
					randomR = getRandom('r');
					randomS = getRandom('s');
					randomFnx = getRandom('fnx');
					randomFny = getRandom('fny');
					randomFnR = getRandom('fnr');
					sakura = new Sakura(randomX, randomY, randomS, randomR, {
						x: randomFnx,
						y: randomFny,
						r: randomFnR
					});
					sakura.draw(cxt);
					sakuraList.push(sakura);
				}
				stop = requestAnimationFrame(function() {
					cxt.clearRect(0, 0, canvas.width, canvas.height);
					sakuraList.update();
					sakuraList.draw(cxt);
					stop = requestAnimationFrame(arguments.callee);
				})
			}

			window.onresize = function() {
				var canvasSnow = document.getElementById('canvas_snow');
				canvasSnow.width = window.innerWidth;
				canvasSnow.height = window.innerHeight;
			}

			img.onload = function() {
				startSakura();
			}

			function stopp() {
				if(staticx) {
					var child = document.getElementById("canvas_sakura");
					child.parentNode.removeChild(child);
					window.cancelAnimationFrame(stop);
					staticx = false;
				} else {
					startSakura();
				}
			}
		
	*/	

//////////////////////////////////////////////////////////////
