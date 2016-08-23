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
    lightUpDuration = lightUpDuration - lightUpStep;
    lightGap = lightGap - lightGapStep;

    for (var i = 0; i < gameSequence.length; i++) {
      var currentColor = gameSequence[i];

      setTimeout(lightUpPad.bind(null, gameSequence[i]), lightUpDuration * i);
      setTimeout(darkenGamePad.bind(null, gameSequence[i]),
        lightUpDuration * (i + 1) - lightGap);
    }
    setTimeout(computerPlays,
      (gameSequence.length * lightUpDuration));
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
  if (color === "yellowPad") {
    yellowPadSound = context.createBufferSource();
    yellowPadSound.buffer = bufferList[3];
    yellowPadSound.connect(context.destination);
    yellowPadSound.start(0);
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
  levelCount = 0;
  gameState = "notPlaying";
  turnState = "computer";

};
var context;
var bufferLoader;
var bufferList;

function loadSounds() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
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


