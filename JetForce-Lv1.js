var myPlayer;
var playerSprite = ["JetGuy1.png","JetGuy2.png", "JetGuy3.png", "JetGuy4.png", "JetGuy5.png", "JetGuy6.png"];
var myPlayerSprite;
var myPlayerHitbox;
var myLand;
var myObstacle = [];
var myObstacleSrc = [];
var myScore;
var myTransparent;
var myBackground;
var mySoundDeath;
var canvasWidth = window.innerWidth - 25;
var canvasHeight = window.innerHeight - 25;



function changeSprite(i){
    var border = document.getElementById("border")
    var restart
    if (border != null) {
        border.parentNode.removeChild(border)
        restart = false
    }
    else {
        document.getElementById("lose").style.display = "none"
        restart = true
    }
    myPlayerSprite = i;
    myPlayerSpriteFly = i+1;

    startGame(restart);
}


function startGame(restart) {
    if (restart == true) {
        myObstacle = [];
        myObstacleSrc = [];
    }
    
    myPlayerHitbox = new component (30, 45, "rgba(255, 0, 0, 0)", 105, 120)
    myPlayer = new component(48, 49, playerSprite[myPlayerSprite], 100, 120, "image");
    myBackground = new component(720, 360, "background1.png", 0, 0, "image");
    // myScore = new component("30px", "Consolas", "rgba(255, 255, 255, 255)", 0, 25, "text");
    mySoundDeath = new sound("dead.wav");
    mySoundWin = new sound("win.wav");
    myGameArea.start();
}


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 720;
        this.canvas.height = 360;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function(){
        clearInterval(this.interval)
    }
}


function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.1;
    this.gravitySpeed = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type == "image") {
            ctx.drawImage(
                this.image,
                this.x, this.y,
                this.width, this.height
            )
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    //--MENGERAKKAN POSISI PLAYER TERGANTUNG DENGAN "gravitySpeed"NYA--//
    this.newPos = function() {
        // this.gravitySpeed += this.gravity
        // this.x += this.speedX;
        // this.y += this.speedY + this.gravitySpeed;
        // this.hitLimit()
        if (this == myPlayerHitbox) {
            this.x = myPlayer.x + 5
            this.y = myPlayer.y
        }
        else {
            this.gravitySpeed += this.gravity
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            this.hitLimit()
        }
    }
    //--MEMASTIKAN PLAYER TIDAK MELEWATI BATAS BAWAH DAN ATAS GAME--//
    this.hitLimit = function() {
        var bottomLimit = myGameArea.canvas.height - this.height;
        if (this.y > bottomLimit && this != myPlayer) {
            this.y = bottomLimit;
            this.gravitySpeed = 0;
        }
        else if (this == myPlayer && this.y > bottomLimit + 5) {
            this.y = bottomLimit + 5;
            this.gravitySpeed = 0;
            myPlayer.image.src = playerSprite[myPlayerSprite]
        }
        var skyLimit = 0;
        if (this.y < skyLimit) {
            this.y = skyLimit;
            this.gravitySpeed = 0.1;
        }
    }
    //--DIGUNAKAN UNTUK MENCEK APABILA SEBUAH OBJEK MENABRAK IBJEK LAIN--//
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}



function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for(i = 0; i < myObstacle.length; i++){
        // if (myPlayer.crashWith(myObstacle[i])) {
        if (myPlayerHitbox.crashWith(myObstacle[i]) || myPlayer.y == (myGameArea.canvas.height - myPlayer.height) + 5) {
            mySoundDeath.play();
            myTransparent = new component(720, 360, "#ff0000a9", 0,  0);
            myTransparent.update();
            myGameArea.stop();
            document.getElementById("lose").style.display = "initial"
            return;
        }
    }
    
    
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        if (myGameArea.frameNo < 2000) {
            x = myGameArea.canvas.width;
            minHeight1 = 30;
            maxHeight1 = 250;
            height1 = Math.floor(Math.random()*(maxHeight1-minHeight1+1)+minHeight1);
            minHeight2 = 50;
            maxHeight2 = 100;
            height2 = Math.floor(Math.random()*(maxHeight2-minHeight2+1)+minHeight2);
            minGap = 100;
            maxGap = 150;
            gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
            minY = 0
            maxY = 110
            y = Math.floor(Math.random()*(maxY-minY+1)+minY);
            myObstacle.push(new component(15, height1, "LaserRed.png", x, y, "image"));
            myObstacle.push(new component(21, 8, "LaserTopR.png", x-3, y, "image"));
            myObstacle.push(new component(21, 8, "LaserBotR.png", x-3, height1 + y, "image"));
            if (height1 <= 100) {
                myObstacle.push(new component(15, height2, "LaserRed.png", x, height1 + y + gap, "image"));
                myObstacle.push(new component(21, 8, "LaserTopR.png", x-3, height1 + y + gap, "image"));
                myObstacle.push(new component(21, 8, "LaserBotR.png", x-3, height1 + y + gap + height2, "image"));
            }
        }
        else if (myGameArea.frameNo >= 2600) {
            mySoundWin.play();
            myTransparent = new component(720, 360, "#00ff00a9", 0,  0);
            myTransparent.update();
            myGameArea.stop();
            document.getElementById("win").style.display = "initial"
            return;
        }
    }
    myGameArea.clear();
    myBackground.newPos();
    myBackground.update();


    //MENGGERAKAN OBSTACLE
    for(i = 0; i < myObstacle.length; i++){
        myObstacle[i].x += -1;
        myObstacle[i].update();
    }
    //MENGUBAH SPRITE SESUAI GERAKAN PPLAYER
    if (myPlayer.gravity > 0) {
        myPlayer.image.src = playerSprite[myPlayerSprite]
    }
    else if (myPlayer.gravity < 0) {
        myPlayer.image.src = playerSprite[myPlayerSpriteFly]
    }
    if (myGameArea.key && myGameArea.key == 32) {
        jump(-0.2);
    }
    else if(myGameArea.key == false){
        jump(0.1)
    }

    myPlayerHitbox.newPos();
    myPlayerHitbox.update();
    myPlayer.newPos();
    myPlayer.update();
}


function everyinterval(n){
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true
    }
    return false
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    //--MEMAINKAN AUDIO GAME--//
    this.play = function(loop){
        if (loop == true) {
            this.sound.loop = true
        }
        this.sound.play();
    }
    //--MENGHENTIKAN AUDIO GAME--//
    this.stop = function(){
        this.sound.pause();
    }
}


function jump(n){
    myPlayer.gravity = n;
}


function reload(){
    changeSprite(myPlayerSprite)
}