var gameSequence = [];
var gameSequenceCounter = 0;
var playerResponses = 0;
var playerResponsesCount = 0;
var strictMode = false;
var levelCount = 0;
var roundsToWin = 20;
var powerState = "off";
var gameState = "notPlaying"; //game is either notPlaying, playing, lost or won
var turnState = "computer"; //whose turn it is
var colors = ["greenPad", "redPad", "bluePad", "yellowPad"];
var lightUpDuration = 1800;
var lightUpStep = 75;
var lightGap = 75;
var lightGapStep = 3;
var yellowPadSound;
var greenPadSound;
var redPadSound;
var bluePadSound;
var setTimeOutLightUp;
var setTimeOutDarken;
var timeOutArray = [];
/*Loads the sounds need for the game, makes the power switch, buttons and game pads functional*/

$(function () {
  loadSounds();
  $("#powerSwitch").on("click", function () {
    if (powerState === "off") {
      $("#mark-toggle").animate({
        left: "26px"
      }, 50);
      $("#countWindow").html("--");
      $("#led").addClass("led-green");
      $("#led").removeClass("led-clear");
      powerState = "on";

    }
    else if (powerState === "on") {
      $("#mark-toggle").animate({
        left: "0px"
      }, 50);
      $("#countWindow").html("");
      $("#led").removeClass("led-green");
      $("#led").removeClass("led-red");
      $("#led").addClass("led-clear");
      powerState = "off";
      gameReset();
      //clears the setTimeouts for both lightUpPad and darkenGamePad
      for (var i = 0; i < timeOutArray.length; i++) {
        clearTimeout(timeOutArray[i]);
      }
      for (var i = 0; i < colors.length; i++) {
        darkenGamePad(colors[i]);
      }

    }

  });

  $(".circle").on("click", function () {

  });

  $("#startButton").on("click", function () {
    if (powerState === "on") {
      gameState = "playing";
      computerPlays();
    }

  });

  $("#strictButton").on("click", function () {
    strictPlay();
  });

});

//chooses a random color out of the 4 colors
function chooseRandomColor() {
  var randomNumber = Math.floor(Math.random() * 4);
  /*console.log(randomNumber);*/
  var randomColor = colors[randomNumber];
  /*console.log(randomColor);*/
  return randomColor;
}
//initializes the game upon starting
function init() {
  levelCount = 1;
  gameSequenceCounter = 0;
  playerResponses = [];
  playerResponses = 0;
  gameState = "notPlaying";
  turnState = "computer";
}
//the computer's sequences
function computerPlays() {
  if (levelCount > 20) {
    gameState = "playerWon";
    return;
  }
  //the computer plays it's portion of the round
  if (gameState === "playing") {
    /*console.log("*** starting Round ***");*/
    turnState = "computer";
    $("#countWindow").html(levelCount);
//this happens each round
    var color = chooseRandomColor();//the random color that has been choosen
    gameSequence.push(color);//the color is pushed into the game sequence array
    lightUpDuration = lightUpDuration - lightUpStep;//the length of time the pad stays illuminated
    lightGap = lightGap - lightGapStep;//the time between a light turning off and the next light turning on
    timeOutArray = [];//emptying of the timeOutArray
//the gameSequence array is looped through and the current color to be animated is selected.
    for (var i = 0; i < gameSequence.length; i++) {
      var currentColor = gameSequence[i];

      var setTimeOutLightUp = setTimeout(lightUpPad.bind(null, gameSequence[i]), lightUpDuration * i);
      var setTimeOutDarken = setTimeout(darkenGamePad.bind(null, gameSequence[i]),
        lightUpDuration * (i + 1) - lightGap);
      timeOutArray.push(setTimeOutLightUp, setTimeOutDarken);
      console.log(timeOutArray);
    }
    setTimeout(computerPlays,
      (gameSequence.length * lightUpDuration));
    levelCount++;
  }

}
//darkens the game pad after the lightUpPad function has done it's job
function darkenGamePad(color) {
  //console.log("darkenGamePad " + color);
  $("#" + color).removeClass(color + "TurnOn");
  $("#" + color).addClass(color + "TurnOff");
}

function playerPlays() {


}
/*the game pad are animated to change the color to a lighter color and the border is shrunk. 
Also the sound is retrieved and played for the corresponding game pad*/

function lightUpPad(color) {
  /*console.log("lightUpPad " + color);*/
  $("#" + color).removeClass(color + "TurnOff");
  $("#" + color).addClass(color + "TurnOn");
  if (color === "yellowPad") {
    yellowPadSound = context.createBufferSource();//creates a sound source
    yellowPadSound.buffer = bufferList[3]; //tells the source which sound to play
    yellowPadSound.connect(context.destination);//connects the sound to the speakers
    yellowPadSound.start(0);//plays the source innediately. (time)=equals the amount of time before the source is played
  }
  else if (color === "greenPad") {
    greenPadSound = context.createBufferSource();
    greenPadSound.buffer = bufferList[0];
    greenPadSound.connect(context.destination);
    greenPadSound.start(0);
  }
  else if (color === "redPad") {
    redPadSound = context.createBufferSource();
    redPadSound.buffer = bufferList[1];
    redPadSound.connect(context.destination);
    redPadSound.start(0);
  }
  else if (color === "bluePad") {
    bluePadSound = context.createBufferSource();
    bluePadSound.buffer = bufferList[2];
    bluePadSound.connect(context.destination);
    bluePadSound.start(0);
  }

}


function strictPlay() {

  if (powerState === "on") {
    strictMode === true;
    $("#led").toggleClass("led-red");
  }
  else {
    strictMode === false;
    $("#led").removeClass("led-red");
    $("#led").addClass("led-clear");
  }
}

//resets the game to it's original settings
function gameReset() {
  gameSequence = [];
  gameSequenceCounter = 0,
    playerResponses = [];
  playerResponsesCount = 0;
  levelCount = 0;
  gameState = "notPlaying";
  turnState = "computer";
  darkenGamePad();
  lightUpDuration = 1800;
  lightGap = 75;

};
//Using a bufferLoader class through web audio api to create, load audio buffers
var context;
var bufferLoader;
var bufferList;

function loadSounds() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  //AudioContext is used for managing and playing all sounds. 
  context = new AudioContext();
  bufferLoader = new BufferLoader(
    context,
    ["http://res.cloudinary.com/angiemjohnson/video/upload/v1471888207/simonSound1_ajce3m.mp3",
      "http://res.cloudinary.com/angiemjohnson/video/upload/v1471888220/simonSound2_khpatu.mp3",
      "http://res.cloudinary.com/angiemjohnson/video/upload/v1471888236/simonSound3_gmfhys.mp3",
      "http://res.cloudinary.com/angiemjohnson/video/upload/v1471888253/simonSound4_wqvp1p.mp3"
    ],
    finishedLoading
  );
  bufferLoader.load();
}

function finishedLoading(bList) {
  bufferList = bList;
  init();
}

function playerWins() {


}


