const ws = new WebSocket('wss://totskiy-coin-base.fly.dev');

function send_balance() {
    var counter = document.getElementById("counter");
    const to_send = {'action': 'set_balance', 'phone': '', 'coins': parseInt(counter.textContent)};
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
}

ws.onopen = function() {
    console.log('Connected to server');
    document.body.style.opacity = "1";
    document.body.style.visibility = "visible";
    const to_send = {'action': 'init', 'phone': phone, 'name': ''};
    ws.send(JSON.stringify(to_send))
};

ws.onmessage = function(event) {
    console.log('Received message:', event.data);
    const data = JSON.parse(event.data);
    if (data.action === 'coins') {
        var counter = document.getElementById('counter');
        counter.textContent = data.coins;
    }
};

ws.onclose = function(event) {
    console.log('Connection closed');
    while (document.body.childNodes.length > 0) {
        document.body.removeChild(document.body.childNodes[0]);
    }
    var error = document.createElement("p");
    error.textContent = "Connection to the server was lost.";
    error.className = "error";
    document.body.appendChild(error);
    ws.close();
};

Telegram.WebApp.onReady(() => {
    const user = Telegram.WebApp.initDataUnsafe.user;
    if (user) {
      console.log(`First Name: ${user.first_name}`);
      console.log(`Last Name: ${user.last_name}`);
      console.log(`Username: ${user.username}`);
      console.log(`User ID: ${user.phone}`);
      phone = user.phone;
      alert(phone);
    } else {
      console.log("User information is not available.");
    }
  });