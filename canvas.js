var mygamepiece;
var myObstacles = [];
var strokes = 0, clicks = 0;
var x = 500;
var y = 145;


function startgame(){
  mygamepiece = new component (30, 30, "red", x, y);
  background = new component(1000, 75, "blue",0, 100);
  myObstacle = new component (75, 100, "green", 100, 175);
  myGameArea.start();
}


var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function(){
    this.canvas.width = 1000;
    this.canvas.height = 275;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function(e){
      myGameArea.key = e.keyCode;
    })

  },
  clear: function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function(){
    clearInterval(this.interval);
  }
}

document.addEventListener("keydown", function(){
  strokes++;
})

document.addEventListener("click", function(){
  clicks++;
})

function everinterval(n){
  if((myGameArea.frameNo / n) % 1 == 0){return true;}
  return false;
}

function component(width, height, color, x, y){
  this.gamearea = myGameArea;
  this.width = width;
  this.height = height;
  this.color = color;
  this.x = x;
  this.y = y;

  this.update = function(){
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.newPos = function(){
    //this.x += this.speedX;
    this.y += this.speedY;
  }

  this.crashWith = function(otherobj){
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;

    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;

    var crash = true;
    if((myright < otherleft) || (myleft > otherright) || (mybottom < othertop) || (mytop > otherbottom) ){
      crash = false;
    }
    return crash;
  }
}

function updateGameArea(){
  var b, width, gap, minwidth, maxwidth, mingap, maxgap;
  for(var i = 0; i < myObstacles.length; i++){
    if(mygamepiece.crashWith(myObstacles[i])){
      myGameArea.stop();
      return;
    }
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if(myGameArea.frameNo == 1 || everinterval(150)){
    a = myGameArea.canvas.width;
    // b = myGameArea.canvas.height - 100;
    // myObstacles.push(new component(75, 100, "green", a, b));
    b = myGameArea.canvas.height;
    minwidth = 30;
    maxwidth = 90;
    width = Math.floor(Math.random() * (maxwidth - minwidth) + minwidth);
    mingap = 70;
    maxgap = 250;
    //console.log(width);
    gap = Math.floor(Math.random() * (maxgap - mingap + 1) + mingap);
    //console.log(gap);
    myObstacles.push(new component(width, 100, "blue", a + gap, 0));
    myObstacles.push(new component(width, 100, "blue", a, b - 100));
    //myObstacles.push(new component(width + 20, 100, "green", a - gap - 50, b - 100));
  }
  for(var i = 0; i < myObstacles.length; i++){
    myObstacles[i].x += -2;
    myObstacles[i].update();
  }

    mygamepiece.speedY = 0;
    if(y > 100 && myGameArea.key == 32 && strokes % 2 != 0){
        console.log("up");
        mygamepiece.speedY = -2;
        y -= 2;
      }

    else{
      if (y + 30 < 175 && myGameArea.key == 32 && strokes % 2 == 0){
        console.log("down");
        mygamepiece.speedY = 2;
        y += 2;
      }
    }

    background.update();
    mygamepiece.newPos();
    mygamepiece.update();
}
