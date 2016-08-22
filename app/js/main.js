var gameSequence = [];
var gameSequenceCounter = 0;
var playerResponses = 0;
var playerResponsesCount = 0;
var greenPadSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
var redPadSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
var bluePadSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
var yellowPadSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
var strictMode = false;
var levelCount = 0;
var roundsToWin = 20;
var powerState = "off";
var gameState = "notPlaying"; //game is either notPlaying, playing, lost or won
var turnState = "computer"; //whose turn it is
var colors = ["greenPad", "redPad", "bluePad", "yellowPad"];
var lightUpDuration = [2000, 2000, 2000, 2000
  , 1750, 1750, 1750, 1750
  , 1500, 1500, 1500, 1500
  , 1250, 1250, 1250, 1250
  , 1000, 1000, 1000, 1000];
var lightGap = 75;
var lightGapDecrementor = 3;
$(function () {

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
    if (powerState === "on") {
      strictPlay();
    }

  });

  init();
});


function chooseRandomColor() {
  var randomNumber = Math.floor(Math.random() * 4);
  console.log(randomNumber);
  var randomColor = colors[randomNumber];

  console.log(randomColor);
  return randomColor;
}

function init() {
  levelCount = 1;
  gameSequenceCounter = 0;
  playerResponses = [];
  playerResponses = 0;
  gameState = "notPlaying";
  turnState = "computer";
}

function computerPlays() {
  if (levelCount > 20) {
    gameState = "playerWon";
    return;
  }
  if (gameState === "playing") {
    console.log("*** starting Round ***");
    turnState = "computer";
    $("#countWindow").html(levelCount);

    var color = chooseRandomColor();
    gameSequence.push(color);

    for (var i = 0; i < gameSequence.length; i++) {
      var currentColor = gameSequence[i];

      setTimeout(lightUpPad.bind(null, gameSequence[i]), lightUpDuration[levelCount - 1] * i);

      if (gameSequence[i] === "yellowPad") {
        yellowPadSound.play();
      }
      else if (gameSequence[i] === "greenPad") {
        greenPadSound.play();
      }
      else if (gameSequence[i] === "redPad") {
        redPadSound.play();
      }
      else if (gameSequence[i] === "bluePad") {
        bluePadSound.play();
      }

      /*switch(gameSequence[i]){
        case "greenPad":
        greenPadSound.play();
        break;
        case "redPad":
        redPadSound.play();
        break;
        case "yellowPad":
        yellowPadSound.play();
        break;
        case "bluePad":
        bluePadSound.play();
      }*/

      setTimeout(darkenGamePad.bind(null, gameSequence[i]), 
        lightUpDuration[levelCount - 1] * (i + 1) - (lightGap-levelCount*lightGapDecrementor));
    }
    setTimeout(computerPlays,
      (gameSequence.length * lightUpDuration[levelCount - 1]));
    levelCount++;
  }

}

function darkenGamePad(color) {
  //console.log("darkenGamePad " + color);

  $("#" + color).removeClass(color + "Animate");
}

function playerPlays() {


}
function lightUpPad(color) {
  console.log("lightUpPad " + color);
  $("#" + color).addClass(color + "Animate");
}


function strictPlay() {

  if (powerOn === "on") {
    if (strictMode === true) {
      $("#led").addClass("led-red");
    }
    else {
      $("#led").removeClass("led-red");
      $("#led").addClass("led-clear");
    }
  }
}

function gameReset() {
  gameSequence = [];
  gameSequenceCounter = 0,
    playerResponses = [];
  playerResponsesCount = 0;
  levelCount = 0

};

