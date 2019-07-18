// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
var labelScore;
var player;
var count;
var pipes = [];
var gapSize = 90
var pipeGap = 100
var blockHeight = 50
var height = 400
var width = 790
var length = 50
var balloons = [];
var weights = [];








/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
  game.load.image("backgroundImg", "../assets/BG4.jpg");
  game.load.image("playerImg", "../assets/X-wing.png");
  game.load.image("playerImg2", "../assets/up.png");
  game.load.audio("score", "../assets/rocketfire1.wav");
  game.load.image("pipeBlock", "../assets/pipe_blue.png");
  game.load.image("pipeEnd", "../assets/pipe-end.png");
  game.load.image("balloons", "../assets/balloons.png");
  game.load.image("weight", "../assets/weight.png");


}

/*
 * Initialises the game. This function is only called once.
 */
function create()  {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.setBackgroundColor("#030526");
  game.add.text(520, 10, "Star Wars : Take Evasive Action", {font: "20px Ariel", fill: "#ffffff"});

  var background = game.add.image(0, 0, "backgroundImg");
	background.width = 790;
	background.height = 400;


  player = game.add.sprite(50, 200, "playerImg",);
  game.physics.arcade.enable(player);
  player.body.velocity.x = 0;
  player.body.gravity.y = 250;

  var pipeInterval = 2.75 * Phaser.Timer.SECOND;
  game.time.events.loop(
      pipeInterval,
      generatePipe);





  labelScore = game.add.text(20, 20, "0");






  game.input
 .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
 .onDown.add(function () {
 player.body.velocity.y = - 150
 playSound();

 });



game.input
    .keyboard.addKey(Phaser.Keyboard.UP)
    .onDown.add(function () {
    player.body.velocity.y = - 150
    playSound();

    });




}



    // set the background colour of the scene}

/*
 * This function updates the scene. It is called for every new frame.
 */



 function playerJump() {
  player.body.velocity.y = - 150;
  playSound()

}
function generate() {
 var diceRoll = game.rnd.integerInRange(1, 10);
 if(diceRoll==1) {
 generateBalloons();
 } else if(diceRoll==2) {
 generateWeight();
 } else {
 generatePipe();
 }
}


 function addPipeBlock(x, y) {
  var block = game.add.sprite(x, y, "pipeBlock");
  pipes.push(block);
  game.physics.arcade.enable(block);
  block.body.velocity.x = -250;
 }


function addPipeEnd(x, y) {
 var block = game.add.sprite(x, y, "pipeEnd");
 pipes.push(block);
 game.physics.arcade.enable(block);
 block.body.velocity.x = -250
}



function moveUp(){
  player.y = player.y - 150;
  playSound();
  changeScore()

}








function generatePipe() {
 var gapStart = game.rnd.integerInRange(50, height - 50 - pipeGap);
 addPipeEnd(width-5,gapStart - 25);
 for(var y=gapStart - 75; y>-50; y -= 50){
 addPipeBlock(width,y);
 }
 addPipeEnd(width-5,gapStart+pipeGap);
 for(var y=gapStart + pipeGap + 25; y<height; y += 50){
 addPipeBlock(width,y);
 }
 changeScore();
}




function generateBalloons(){
 var bonus = game.add.sprite(width, height, "balloons");
 balloons.push(bonus);
 game.physics.arcade.enable(bonus);
 bonus.body.velocity.x = - 200;
 bonus.body.velocity.y = - game.rnd.integerInRange(60, 100);
}

function generateWeight(){
 var bonus = game.add.sprite(width, 0, "weight");
 weights.push(bonus);
 game.physics.arcade.enable(bonus);
 bonus.body.velocity.x = - 200;
 bonus.body.velocity.y = game.rnd.integerInRange(60,100);
}




function update() {
if(player.body.y < 0 || player.body.y > 400){
 gameOver();
        }
 game.physics.arcade.overlap(
 player,
 pipes,
 gameOver);

 for(var i = balloons.length - 1; i >= 0; i--){
  game.physics.arcade.overlap(player, balloons[i], function(){
    changeGravity(-50);
 balloons[i].destroy();
 balloons.splice(i, 1);
  // We need to do something here!
  });
 }


}



function changeGravity(g){
 gameGravity += g;
 player.body.gravity.y = gameGravity;
}



function gameOver(){
  score = 0 ;
  game.state.restart();
}







function spaceHandler() {
  changeScore();
  playSound()

}

function changeScore() {
  score = score + 1;
  labelScore.setText(score.toString());
}

function playSound() {
  game.sound.play("score");
}
