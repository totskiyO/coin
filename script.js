var defaultWidth = 0;

window.onload = function() {
    var image = document.getElementById("image");
    var counter = document.getElementById("counter");
    var sound1000 = new Audio('1000.mp3');
    defaultWidth = image.offsetWidth;

    image.onclick = function(e) {
        counter.textContent = parseInt(counter.textContent) + 1;
        image.style.width = "75%";
        if (counter.textContent % 100 == 0) {
            sound1000.play();
        }
    }
}

setInterval(function() {
    var image = document.getElementById("image");
    image.style.width = image.offsetWidth + ((defaultWidth - image.offsetWidth) * 0.05) + "px";
}, 1/60)