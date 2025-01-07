const ws = new WebSocket('wss://totskiy-coin-base.fly.dev');

var tg = window.Telegram.WebApp;
var user = tg.initDataUnsafe.user;
if (user) {
    var id = tg.initDataUnsafe.user.id;
} else {
    var id = 0;
}


function send_balance() {
    var counter = document.getElementById("counter");
    const to_send = {'action': 'set_balance', 'id': id, 'coins': parseInt(counter.textContent)};
    ws.send(JSON.stringify(to_send))
}

window.onload = function() {
    var image = document.getElementById("image");
    var counter = document.getElementById("counter");
    var sound1000 = new Audio('sounds/1000.mp3');
    var menu_button = document.getElementById("menu_button");
    var back_button = document.getElementById("back_button");

    image.onclick = function(e) {
        counter.textContent = parseInt(counter.textContent) + 1;
        if (counter.textContent % 100 == 0) {
            sound1000.play();
            image.style.scale = 5;
            setTimeout(function() {
                image.style.scale = 1;
            }, 500);
            send_balance();
        } else {
            image.style.scale = 0.5;
            setTimeout(function() {
                image.style.scale = 1;
            }, 100);
        }
    }

    menu_button.onclick = function() {
        document.getElementById("menu").showModal();
    }

    back_button.onclick = function() {
        document.getElementById("menu").close();
    }

    setInterval(send_balance, 10000);

    document.body.style.opacity = "0";
    document.body.style.visibility = "hidden";

    ws.onopen = function() {
        console.log('Connected to server');
        document.body.style.opacity = "1";
        document.body.style.visibility = "visible";
        const to_send = {'action': 'init', 'id': id};
        ws.send(JSON.stringify(to_send))
    };

    ws.onmessage = function(event) {
        console.log('Received message:', event.data);
        document.body.style.opacity = "1";
        document.body.style.visibility = "visible";
        const data = JSON.parse(event.data);
        if (data.action === 'coins') {
            var counter = document.getElementById('counter');
            counter.textContent = data.coins;
        }
    };
    
    ws.onclose = function(event) {
        console.log('Connection closed');
        document.body.style.opacity = "1";
        document.body.style.visibility = "visible";
        while (document.body.childNodes.length > 0) {
            document.body.removeChild(document.body.childNodes[0]);
        }
        var error = document.createElement("p");
        error.textContent = "Connection to the server was lost.";
        error.className = "error";
        document.body.appendChild(error);
        ws.close();
    };
}