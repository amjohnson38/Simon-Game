var gameSequence = [];
var playerResponse;
var playerResponsesCounter = 0;
var strictMode = false;
var levelCount = 0;
var roundsToWin = 2;
var powerState = "off";
var gameState = "notPlaying"; //game is either notPlaying, playing, lost or won
var turnState = "computer"; //whose turn it is
var colors = ["greenPad", "redPad", "bluePad", "yellowPad"];
var lightUpDuration;
var lightUpStep = 50;
var lightGap;
var lightGapStep = 2;
var yellowPadSound;
var greenPadSound;
var redPadSound;
var bluePadSound;
var setTimeOutLightUp;
var setTimeOutDarken;
var timeOutArray = [];
var wrongAnswerBuzzer;
var winnerCheer;
var losingMessage = "You Lose! Press Start To Play Again.";
var winningMessage = "You Won! Press Start To Play Again";
var boolFirstPlay = true;
/*Loads the sounds need for the game, makes the power switch, buttons and game pads functional*/
$(function () {
  loadSounds();//
  W = window.innerWidth;
  H = window.innerHeight;
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
      powerState = "off";
      $("#countWindow").html("&nbsp");
      $("#led").removeClass("led-green");
      $("#led").removeClass("led-red");
      $("#led").addClass("led-clear");

      if ($("#resetContainer").hasClass('slideDown')) {
        $("#resetContainer").removeClass('slideDown');
        $("#resetContainer").addClass('slideUp');
      }

      init();
      //clears the setTimeout method that were set for the lightUpPad function
      for (var i = 0; i < timeOutArray.length; i++) {
        clearTimeout(timeOutArray[i]);
      }
      //clears the setTimeout method for the darkenGamePad function
      for (var i = 0; i < colors.length; i++) {
        clearTimeout(darkenGamePad(colors[i]));
      }

    }

  });

  $(".circle").mousedown(function (event) {
    if ((powerState === "on") &&
      (turnState === "player")) {
      lightUpPad(event.currentTarget.id);
    }

  });

  $(".circle").mouseup(function (event) {
    if ((powerState === "on") &&
      (turnState === "player")) {
      playerPlays(event.currentTarget.id);
      darkenGamePad(event.currentTarget.id);
    }
  });

  $("#startButton").on("click", function () {
    if (powerState === "on") {
      $(".circle").removeClass("winningAnimation");
      $(".middleCircle").removeClass("winningAnimation");
      $("#simonContainer").removeClass("losingAnimation");
      if ($("#resetContainer").hasClass('slideDown')) {
        $("#resetContainer").removeClass('slideDown');
        $("#resetContainer").addClass('slideUp');
      }
      gameState = "playing";
      computerPlays(true);
    }

  });

  $("#strictButton").on("click", function () {

    if ((powerState === "on") &&
      ((turnState !== "computer") && (turnState !== "player"))) {
      strictMode = !strictMode;
      if (strictMode === true) {
        $("#led").addClass("led-red");
      }
      else {
        $("#led").removeClass("led-red");
        $("#led").addClass("led-clear");
      }
    }
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
  console.log(levelCount);
  /*if (powerState === "on") {
    $("#countWindow").html(levelCount);
  }*/
  gameState = "notPlaying";
  turnState = undefined;// allows the player to turn on the strict button prior to the game starting.
  darkenGamePad();
  gameSequence = [];
  playerResponsesCounter = 0;
  lightUpDuration = 1400;
  lightGap = 75;

}
/************************************************************
 * computerPlays
 * Params:
 * addNew-if addNew equals true, a new color is added to the sequence. If it's false- no new color is addedto the sequence.
 * Description:
 * it is the function that handles the computer's sequences in the game. It's where a random color is shown and pushed into the 
 * game sequence array.  The current color that is choosen to be animated gets it's length of time to "shine" and darken.  
 * These times are given a delay so they don't overlap one another. Also a delay is added so that the sequence of light animation
 * is delayed to give the player enough time to respond in replicating the sequence.
 * */
function computerPlays(addNew) {
  if (levelCount > roundsToWin) {
    gameState = "playerWon";
    playerWins();
    return;
  }
  //the computer plays it's portion of the round
  if (gameState === "playing") {
    /*console.log("*** starting Round ***");*/
    turnState = "computer";
    $("#countWindow").html(levelCount);
    //adds a new color to the sequence
    if (addNew === true) {
      color = chooseRandomColor();//the random color that has been choosen
      gameSequence.push(color);//the color is pushed into the game sequence array
      console.log(gameSequence);
    }
    if (addNew === false) {
      $("#simonContainer").removeClass("losingAnimation");
    }

    lightUpDuration = lightUpDuration - lightUpStep;//the length of time the pad stays illuminated
    lightGap = lightGap - lightGapStep;//the time between a light turning off and the next light turning on
    timeOutArray = [];//emptying of the timeOutArray
    //the gameSequence array is looped through and the current color to be animated is selected.
    for (var i = 0; i < gameSequence.length; i++) {
      var currentColor = gameSequence[i];
      /*the setTimeout calls the lightUpPad function, 
      which is bound to the current color. The current color lights up and plays sound after the following time 
      (lightUpDuration multiplied by the index)*/
      var setTimeOutLightUp = setTimeout(lightUpPad.bind(null, gameSequence[i]), lightUpDuration * i);
      /*the setTimeout calls the darkenGamePad function, which is bound to the current color.
       The current color darkens, removes the animations after the following time (the lightUpDuration multiplied by the index plus 1 subtracted by the light gap */
      var setTimeOutDarken = setTimeout(darkenGamePad.bind(null, gameSequence[i]),
        lightUpDuration * (i + 1) - lightGap);
      //this array contains the two setTimeouts that are attached to the gamepad's animation functions. 
      //it is going to be used to clear the setTimeouts when the game is powered off.
      timeOutArray.push(setTimeOutLightUp, setTimeOutDarken);

    }
    /*this setTimeout calls the computerPlays function, 
    after what ever time is derived from the gameSequence length multiplied by the light duration*/
    setTimeout(function () { turnState = "player"; },
      gameSequence.length * lightUpDuration);

  }

}
//darkens the game pad after the lightUpPad function has done it's job
function darkenGamePad(color) {
  //console.log("darkenGamePad " + color);
  $("#" + color).removeClass(color + "TurnOn");
  $("#" + color).addClass(color + "TurnOff");
}

function playerPlays(playerResponse) {
  turnState = "player";
  if (gameSequence[playerResponsesCounter] !== playerResponse) {
    loseRound();
  }
  else {
    playerResponsesCounter++;
    if (gameSequence.length === playerResponsesCounter) {
      setTimeout(function () {
        computerPlays(true);
      }, 750);//keeps the computer from immediately doing it's sequence before the player has fully responded
      playerResponsesCounter = 0;
      levelCount++;
    }
  }
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
      "http://res.cloudinary.com/angiemjohnson/video/upload/v1471888253/simonSound4_wqvp1p.mp3",
      "http://res.cloudinary.com/angiemjohnson/video/upload/v1472237645/164089__hypocore__buzzer2_gkt1l5.wav",
      "http://res.cloudinary.com/angiemjohnson/video/upload/v1472241093/333404__jayfrosting__cheer-2_wq0edx.wav"
    ],
    finishedLoading
  );
  bufferLoader.load();
}

function finishedLoading(bList) {
  bufferList = bList;
  init();
}

function loseRound() {
  if (strictMode === true) {
    loserNotification();
    $("#countWindow").html("--");
    $("#resetContainer").removeClass('slideUp');
    $("#gameStatement").text(losingMessage);
    $("#resetContainer").addClass('slideDown');
    $("#simonContainer").addClass("losingAnimation");
    init();
  }
  else {
    $("#simonContainer").addClass("losingAnimation");
    loserNotification();
    playerResponsesCounter = 0;
    setTimeout(function () {
      computerPlays(false);
    }, 3250);
  }
}

function loserNotification() {
  wrongAnswerBuzzer = context.createBufferSource();
  wrongAnswerBuzzer.buffer = bufferList[4];
  wrongAnswerBuzzer.connect(context.destination);
  wrongAnswerBuzzer.start(0);
}

function playerWins() {
  $("#resetContainer").removeClass('slideUp');
  $("#gameStatement").text(winningMessage);
  $("#resetContainer").addClass('slideDown');
  winnerCheer = context.createBufferSource();
  winnerCheer.buffer = bufferList[5];
  winnerCheer.connect(context.destination);
  winnerCheer.start(0);
  $(".circle").addClass("winningAnimation");
  $(".middleCircle").addClass("winningAnimation");
  init();
}



