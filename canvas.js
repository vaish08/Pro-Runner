var mygamepiece, powerups=[];
var myObstacles = [];
var strokes = 0, if_clicked = false;
var myScore, prev_score;
var t = 15, temp = true;
var n = 150;
const img = document.getElementById('source');
var x = 500;
var y = 145;


function startgame(){
  mygamepiece = new component (30, 30, "#F0A500", x, y);
  background = new component(1000, 75, "#3EDBF0",0, 100);
  myScore = new component("20px", "Consolas", "green", 890, 30, "text");
  myGameArea.start();
}


var myGameArea = {
  canvas: document.getElementsByTagName("canvas")[0],
  start: function(){
    this.canvas.width = 1000;
    this.canvas.height = 275;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, t);
    console.log(t);
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
  if_clicked = true;
  strokes++;
})

function everinterval(n){
  if((myGameArea.frameNo / n) % 1 == 0){return true;}
  return false;
}

function component(width, height, color, x, y, type){
  this.type = type;
  this.gamearea = myGameArea;
  this.width = width;
  this.height = height;
  this.color = color;
  this.x = x;
  this.y = y;

  this.update = function(){
    ctx = myGameArea.context;
    if(this.type == "text"){
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
    }
    else{
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  this.newPos = function(){
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
  var b, width, gap, minwidth, maxwidth, mingap, maxgap, next_gap;
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
    b = myGameArea.canvas.height;
    minwidth = 40;
    maxwidth = 100;
    width = Math.floor(Math.random() * (maxwidth - minwidth) + minwidth);
    mingap = 70;
    maxgap = 200;
    gap = Math.floor(Math.random() * (maxgap - mingap) + mingap);
    while(width > gap){
      width = Math.floor(Math.random() * (maxwidth - minwidth) + minwidth);
      gap = Math.floor(Math.random() * (maxgap - mingap + 1) + mingap);
    }
    myObstacles.push(new component(width, 100, "#3EDBF0", a, 0));
    myObstacles.push(new component(width, 100, "#3EDBF0", a + gap, b - 100));

    if(myGameArea.frameNo > 500){
    var k = Math.floor(Math.random() * 100);
    console.log(k);
    if(k % 5 == 0){
      powerups.push(new component(20, 20, "black", a+gap+width+20, b-120, true));
    }}
  }

  for(var i = 0; i < myObstacles.length; i++){
    myObstacles[i].x += -2;
    myObstacles[i].update();
  }

  myScore.text = "SCORE:" + myGameArea.frameNo;
  myScore.update();

  for(var i = 0; i < powerups.length; i++){
    if(mygamepiece.crashWith(powerups[i])){
      powerups[i].type = false;
      t = 20;
      temp = false;
      prev_score = myGameArea.frameNo;
    }
  }

  if(myGameArea.frameNo - prev_score > 500){
    temp = true;
  }

  accelaration();
  clearInterval(myGameArea.interval);
  myGameArea.interval = setInterval(updateGameArea, t);
  background.update();
  powerup();
  mygamepiece.newPos();
  mygamepiece.update();
}

function powerup(){
  for(var i = 0; i < powerups.length; i++){
    powerups[i].x += -2;
    if(powerups[i].type == true)
      powerups[i].update();
  }
}

function accelaration(){
  mygamepiece.speedY = 0;
    if(y > 100 && myGameArea.key == 32 && strokes % 2 != 0){
        mygamepiece.speedY = -2;
        y -= 2;
      }

    else{
      if (y + 30 < 175 && myGameArea.key == 32 && strokes % 2 == 0){
        mygamepiece.speedY = 2;
        y += 2;
      }
    }

    if(temp == true){
      t = Math.floor(15 - 0.1 * (myGameArea.frameNo / 50));
      if(t <= 5){
        t = 5;
      }
    }
}
