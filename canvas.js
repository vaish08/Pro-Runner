var mygamepiece, powerups=[];
var myObstacles = [];
var strokes = 0, if_clicked = false;
var myScore, prev_score;
localStorage.highScore;
var t = 12, temp = true;
var x = 500;
var y = 145;
var score = 0;
var play = true, flag=  false;
var array = [];
var offsetX = document.getElementsByClassName('canvas')[0].offsetLeft;
var offsetY = document.getElementsByClassName('canvas')[0].offsetTop;

function startgame(){
  mygamepiece = new component (30, 30, "#F0A500", x, y);
  background = new component(1000, 75, "#3EDBF0",0, 100);
  myScore = new component("20px", "Verdana", "green", 825, 30, "text");
  myGameArea.start();
}


var myGameArea = {
  canvas: document.getElementsByTagName("canvas")[0],
  start: function(){
    this.canvas.width = 1000;
    this.canvas.height = 275;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[1]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, t);

    window.addEventListener('keydown', function(e){
      myGameArea.key = e.keyCode;
    });
    window.addEventListener("click", function(){
      myGameArea.key = 32;
    })
  },
  clear: function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function(){
    clearInterval(this.interval);
  }
}

document.addEventListener("keydown", function(e){
  if(play == true){
    var audio = new Audio('audio/mixkit-player-jumping-in-a-video-game-2043.wav');
    audio.play();
  }
  strokes++;
})

document.addEventListener("click", function(e){
  if(e.pageY >= offsetY && e.pageY <= offsetY + 275 && e.pageX >= offsetX && e.pageX <= offsetX + 1000){
  console.log(offsetY);
  console.log(e.pageY);
    if(play == true){
      var audio = new Audio('audio/mixkit-player-jumping-in-a-video-game-2043.wav');
      audio.play();
    }
    strokes++;
  }
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
      highScoreUpdate();
      local_storage(score);
      play = false;
      var gameover = document.querySelectorAll(".gameover")[0];
      gameover.style.display = "block";
      myGameArea.stop();
      return;
    }
    // else{
    //   if(myGameArea.key == 32){
    //     var audio = new Audio('audio/mixkit-player-jumping-in-a-video-game-2043.wav');
    //     audio.play();
    //   }
    // }
  }

  myGameArea.clear();

  myGameArea.frameNo += 1;

  //creates obstacles.
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

    if(myGameArea.frameNo > 700){
    var k = Math.floor(Math.random() * 100);
    if(k % 5 == 0){
      powerups.push(new component(20, 20, "black", a+gap+width+35, b-120, true));
    }}
  }


  for(var i = 0; i < myObstacles.length; i++){
    myObstacles[i].x += -2;
    myObstacles[i].update();
  }


  display();

  //powerups.
  for(var i = 0; i < powerups.length; i++){
    if(mygamepiece.crashWith(powerups[i])){
      powerups[i].type = false;
      t = 30;
      temp = false;
      prev_score = myGameArea.frameNo;
    }
  }
  if(myGameArea.frameNo - prev_score > 500){
    temp = true;
  }

  accelaration();
  background.update();
  powerup();
  mygamepiece.newPos();
  mygamepiece.update();
}

//to update the score.
function display(){
  if(localStorage.highScore == undefined){
    localStorage.highScore = 0;
  }
  myScore.text = "SCORE: " + score + "  " + localStorage.highScore;
  console.log(Math.max(...array));
  myScore.update();
}

//update score
setInterval(function scoreUpdate(){
  score++;
}, 500);

//localStorage for hight score
function highScoreUpdate(){
  if(score > localStorage.highScore){
    localStorage.highScore = score;
  }
}

//powerups: displaying in canvas
function powerup(){
  for(var i = 0; i < powerups.length; i++){
    powerups[i].x += -2;
    if(powerups[i].type == true)
      powerups[i].update();
  }
}

//updateGameArea - interval
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
    clearInterval(myGameArea.interval);
    myGameArea.interval = setInterval(updateGameArea, t);
}

//LeaderBoard button
var modal1 = document.querySelectorAll(".modal")[0];
var btn1 = document.querySelectorAll(".button3")[0];
var span1 = document.querySelectorAll(".close")[0];
btn1.onclick = function(){
  modal1.style.display =  "block";
}
span1.onclick = function(){
  modal1.style.display = "none";
}

//Instruction button.
var modal = document.getElementsByClassName("modal")[1];
var btn = document.getElementsByClassName("button2")[0];
var span = document.getElementsByClassName("close")[1];
btn.onclick = function(){
  modal.style.display =  "block";
}
span.onclick = function(){
  modal.style.display = "none";
}

print_moves(JSON.parse(localStorage.getItem("rank")));

function local_storage(move){
  var moves = !!localStorage.getItem('rank') ? JSON.parse(localStorage.getItem('rank')) : [];
  for(var i = 0; i < moves.length; i++){
    if(moves[i] == move){
      flag = true;
      break;
    }
  }
  if(flag != true){
    moves.push(move);
    moves.sort(function(a, b){return b-a});
    localStorage.setItem("rank", JSON.stringify(moves));
  }
}

//print the array elements
function print_moves(array){
  var x = document.getElementById("list_items");

  var ol = document.createElement('ol');

  for(var i = 0; i < array.length; i++){
    var li = document.createElement('li');
    li.innerHTML = array[i];
    ol.appendChild(li);
  }
  x.appendChild(ol);
}
