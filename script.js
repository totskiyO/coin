function wakeup() {
    try {
        fetch("https://coin-server-q0w4.onrender.com");
    } catch (e) {}
}

wakeup();
const SERVER = 'https://coin-server-q0w4.onrender.com';
const socket = io(SERVER);

var is_2x = false;
var is_inited = false;
var is_blocked = false;
var is_chilled = false;

var tg = window.Telegram.WebApp;
var user = tg.initDataUnsafe.user;
if (user) {
    var id = tg.initDataUnsafe.user.id;
} else {
    var id = 0;
}

function popup(msg) {
    var popup = document.createElement('div');
    popup.className = 'popup';
    var content = document.createElement('p');
    content.textContent = msg;
    content.className = 'popup-content';
    popup.appendChild(content);
    is_blocked = true;

    document.body.appendChild(popup);
    setTimeout(function() {
        popup.remove();
        is_blocked = false;
    }, 5500);
}

function sendJson(data) {
    socket.emit('message', JSON.stringify(data));
    console.log("Sent: " + JSON.stringify(data));
}

function send_balance() {
    if (is_inited && !is_chilled && !is_blocked) {
        var counter = document.getElementById("counter");
        const to_send = { 'action': 'set_balance', 'id': id, 'coins': parseInt(counter.textContent) };
        sendJson(to_send);
    }
    if (is_chilled) {
        is_chilled = false;
    }
}

window.onload = function() {
    var image = document.getElementById("image");
    var counter = document.getElementById("counter");
    var sound1000 = new Audio('sounds/x2.mp3');
    var menu_button = document.getElementById("menu_button");
    var back_button = document.getElementById("back_button");

    image.onclick = function(e) {
        if (is_blocked) {
            return;
        }
        if (is_2x) {
            counter.textContent = parseInt(counter.textContent) + 2;
        } else {
            counter.textContent = parseInt(counter.textContent) + 1;
        }
        if (Math.floor(Math.random() * 750) === 0) {
            sound1000.play();
            image.style.scale = 10;
            image.style.rotate = 360;
            setTimeout(function() {
                image.style.scale = 1;
            }, 500);
            send_balance();
            is_2x = true;
            document.getElementById('content').classList.remove('stopped');
            document.getElementById('content').classList.add('is_2x');
            document.getElementById('x2-text').style.top = '5%';
            document.getElementById('menu').style.opacity = '0';
            document.getElementById('image').src = 'images/totskiy_agro.png';
            document.body.classList.add('is_2x_body');
            setTimeout(function() {
                image.style.scale = 10;
                is_2x = false;
                document.getElementById('content').classList.remove('is_2x');
                document.getElementById('content').classList.add('stopped');
                document.getElementById('x2-text').style.top = '-50%';
                document.getElementById('menu').style.opacity = '1';
                document.getElementById('menu').style.left = '-100%';
                document.getElementById('image').src = 'images/totskiy.png';
                document.body.classList.remove('is_2x_body');
                send_balance();
            }, 10000);
        } else {
            image.style.scale = 0.5;
            counter.style.scale = 1.25;
            setTimeout(function() {
                image.style.scale = 1;
                counter.style.scale = 1;
            }, 100);
        }
    };

    menu_button.onclick = function() {
        document.getElementById("menu").classList.add('opened');
        document.getElementById("menu").classList.remove('closed');
    };

    back_button.onclick = function() {
        document.getElementById("menu").classList.add('closed');
        document.getElementById("menu").classList.remove('opened');
    };

    setInterval(send_balance, 10000);
    setInterval(wakeup, 15000);

    document.getElementById("content").style.opacity = "0";
    document.getElementById("content").style.visibility = "hidden";
    var loading_text = document.createElement("h1");
    loading_text.textContent = "Loading...";
    loading_text.className = "loading";
    loading_text.id = "loading-text";
    document.body.appendChild(loading_text);

    socket.on('connect', function() {
        console.log('Connected to server');
        document.getElementById("loading-text").remove();
        document.getElementById("content").style.opacity = "1";
        document.getElementById("content").style.visibility = "visible";
    });

    socket.on('response', function(data) {
        if (!is_inited) {
            is_inited = true;
        }
        console.log('Received message:', data);
        const parsedData = data;
        if (parsedData.action == 'coins') {
            var counter = document.getElementById('counter');
            counter.textContent = parsedData.coins;
        } else if (parsedData.action == 'chill') {
            var counter = document.getElementById('counter');
            counter.textContent = parsedData.coins;
            popup("Hey, Chill Out! Not So Fast!");
            is_chilled = true;
        }
    });

    socket.on('disconnect', function() {
        console.log('Connection closed');
        document.getElementById("content").style.opacity = "1";
        document.getElementById("content").style.visibility = "visible";
        while (document.body.childNodes.length > 0) {
            document.body.removeChild(document.body.childNodes[0]);
        }
        var error = document.createElement("p");
        error.textContent = "Connection to the server was lost. Maybe restart would help?";
        error.className = "error";
        document.body.appendChild(error);
    });

    async function loop() {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        for (let i = 0; i < 100000; i++) {
            console.log(i);
            if (is_inited) { return; }
            const to_send = { 'action': 'init', 'id': id };
            sendJson(to_send);
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    loop();
};
