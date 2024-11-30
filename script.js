var defaultWidth = 0;

window.onload = function() {
    alert("totskiy");
    var image = document.getElementById("image");
    var counter = document.getElementById("counter");
    var sound1000 = new Audio('sounds/1000.mp3');
    var menu_button = document.getElementById("menu_button");
    var back_button = document.getElementById("back_button");
    defaultWidth = image.offsetWidth;

    image.onclick = function(e) {
        counter.textContent = parseInt(counter.textContent) + 1;
        image.style.width = "75%";
        if (counter.textContent % 100 == 0) {
            sound1000.play();
        }
    }

    menu_button.onclick = function() {
        document.getElementById("menu").showModal();
    }

    back_button.onclick = function() {
        document.getElementById("menu").close();
    }

}

setInterval(function() {
    var image = document.getElementById("image");
    image.style.width = image.offsetWidth + ((defaultWidth - image.offsetWidth) * 0.05) + "px";
}, 1/60)