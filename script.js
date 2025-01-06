const ws = new WebSocket('wss://134.249.176.116:8765');

var defaultWidth = 0;

window.onload = function() {
    var image = document.getElementById("image");
    var counter = document.getElementById("counter");
    var sound1000 = new Audio('sounds/1000.mp3');
    var menu_button = document.getElementById("menu_button");
    var back_button = document.getElementById("back_button");
    defaultWidth = image.offsetWidth;

    image.onclick = function(e) {
        counter.textContent = parseInt(counter.textContent) + 1;
        if (counter.textContent % 100 == 0) {
            sound1000.play();
            image.style.scale = 5;
            setTimeout(function() {
                image.style.scale = 1;
            }, 500);
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

    document.body.style.opacity = "0";
    document.body.style.visibility = "hidden";
}

ws.onopen = function() {
    console.log('Connected to server');
    document.body.style.opacity = "1";
    document.body.style.visibility = "visible";
    const to_send = {'action': 'init', 'phone': '', 'name': ''};
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