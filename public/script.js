// setup socket.io
var socket = io();

console.log(
  "%chey there buster, welcome to the big boy dev console. type in debug to see the debug tool.",
  `font-size: 1em; color: lime;`
);

// on document ready, hide "#app".
$(document).ready(() => {
  $("#app").hide();
});

class DebugTool {
  constructor() {
    this._textGlitch = false;
    this._timerGlitch = false;
  }

  get textGlitch() {
    return this._textGlitch;
  }

  get timerGlitch() {
    return this._timerGlitch;
  }

  openApp() {
    $("form").hide();
    $("#app").show(() => {
      console.log("app opened.");
    });
  }

  toggleTextGlitch() {
    if (!this._textGlitch) {
      this._textGlitch = true;
      return "Set textGlitchDebug to true.";
    } else {
      this._textGlitch = false;
      return "Set textGlitchDebug to false.";
    }
  }

  toggleTimerGlitch() {
    if (!this._timerGlitch) {
      this._timerGlitch = true;
      return "Set timerGlitchDebug to true.";
    } else {
      this._timerGlitch = false;
      return "Set textGlitchDebug to false.";
    }
  }

  stopTimer() {
    throw new Error("The timer hasn't started yet.");
  }
}

var debug = new DebugTool();

function glitch(
  jQueryElement,
  message,
  amountOfSteps,
  timeBetweenSteps,
  glitchChars
) {
  var aOS = amountOfSteps || 25;
  var tBS = timeBetweenSteps || 15;
  var gC = glitchChars || `qwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*()`;
  var doDebug = debug.timerGlitch;
  if (doDebug) {
    console.log(
      `Doing ${aOS} steps with ${tBS} seconds in between, totalling ${
        (aOS * tBS) / 1000
      } seconds.`
    );
  }
  let messageLength = message.length;
  let timeoutTime = 0;
  let glitchLetters = gC;
  for (var i = 0; i < aOS; i++) {
    if (i !== aOS - 1) {
      setTimeout(() => {
        let glitchMessage = "";
        for (var j = 0; j < messageLength; j++) {
          glitchMessage +=
            glitchLetters[Math.floor(Math.random() * glitchLetters.length)];
        }
        if (doDebug) {
          console.log(`set message to ${glitchMessage}.`);
        }
        jQueryElement.html(glitchMessage);
      }, timeoutTime);
    } else {
      setTimeout(() => {
        if (doDebug) {
          console.log(`set message to ${message}, end.`);
        }
        jQueryElement.html(message);
      }, timeoutTime);
    }
    timeoutTime = tBS + timeoutTime;
  }
}

var stopTimer = () => {
  throw new Error("The timer hasn't started yet.");
};
// just a countdown
function showEnd(date, endMessage) {
  var doDebug = debug.timerGlitch;
  var previous0s = [];
  var now;
  var end = new Date(date);
  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;
  var timer;

  function showRemaining() {
    var html;
    var glitchHtml;
    now = new Date();
    var distance = end - now;
    if (distance < 0) {
      clearInterval(timer);
      $("#app").html(endMessage);
      return;
    }
    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);
    days = days.toString().padStart(2, "0");
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    if (days == 0) {
      glitchHtml = `<span class="glitch" style="font-size: 1em" data-text="00.">00.</span>`;
      if (hours == 0) {
        glitchHtml = `<span class="glitch" style="font-size: 1em" data-text="00.00">00.00</span>`;
        if (minutes == 0) {
          glitchHtml = `<span class="glitch" style="font-size: 1em" data-text="00.00.00">00.00.00</span>`;
          if (seconds == 0) {
            glitchHtml = ``;
          } else {
            html = `${seconds}`;
          }
        } else {
          html = `${minutes}.${seconds}`;
        }
      } else {
        html = `${hours}.${minutes}.${seconds}`;
      }
    } else {
      html = `${days}.${hours}.${minutes}.${seconds}`;
    }

    if ($("#glitchTime").html() !== glitchHtml) {
      $("#glitchTime").html(glitchHtml);
    }
    $("#time").html(html);
    let debugObj = {
      now: now,
      distance: distance,
      time: [days, hours, minutes, seconds],
      glitchHTML: glitchHtml,
      html: html,
    };
    if (doDebug) {
      console.log(debugObj);
    }
  }
  showRemaining();
  debug.stopTimer = () => {
    clearInterval(timer);
    return "stopped.";
  };
  timer = setInterval(showRemaining, 1000);
}

// load the status from status.json
function loadStatus(status, userData) {
  let app = $("#app");
  // if fail, console.log error, and show it in the app.
  try {
    // save the #app div as a variable.
    // switch the type in the status.
    switch (status.type) {
      case "message":
        app.html(status.data.message);
        break;
      case "none":
        app.css("font-size", "2em");
        app.html("Nothing's going on.");
        break;
      case "countdown":
        app.html(
          `<div id="glitchTime" style="display: inline;"></div><span id="time"></span>`
        );
        app.css("font-size", "3em");
        console.log(status.data.time);
        showEnd(status.data.time, status.data.end);
        break;
      case "survey":
        if (
          status.data.users.includes(userData.key) ||
          status.data.users.includes("all")
        ) {
          app.css("font-size", "1em");
          app.html(`${status.data.question}<br>`);
          app.append(
            `<form name="survey" id="survey"><input id="surveyResponse" name="response"></form>`
          );
          $("#surveyResponse").css("font-size", "1em");
          $("#survey").submit((e) => {
            e.preventDefault();
            let acceptedValues = status.data.allowedResponses;
            console.log(document.forms["survey"]["response"]);
            if (
              acceptedValues.includes(
                parseInt(document.forms["survey"]["response"].value)
              )
            ) {
              socket.emit(
                "surveyReply",
                userData.key,
                parseInt(document.forms["survey"]["response"].value)
              );
              $("#app").fadeOut(500, () => {
                $("#app").html(
                  `Thanks for submitting, ${userData.name}.<br><span style="font-size: 0.75em">You submitted <strong>${document.forms["survey"]["response"].value}</strong></span>.`
                );
                $("#app").css("font-size", "1.5em");
                $("#app").fadeIn(500);
              });
            } else {
              let acceptedValues = status.data.allowedResponses;
              let list = "Invalid response. Please input one of these values: ";
              for (var i = 0; i < acceptedValues.length; i++) {
                if (i === acceptedValues.length) {
                  list += ", " + acceptedValues[i] + ".";
                } else if (i === 0) {
                  list += acceptedValues[i];
                } else {
                  list += ", " + acceptedValues[i];
                }
              }
              alert(list);
              document.forms["survey"]["response"].value = "";
            }
          });
        } else {
          $("#app").css("font-size", "1em");
          $("#app").html(status.data.altMessage);
        }
        break;
      default:
        throw new Error(`Invalid status type, got "${status.type}".`);
    }
  } catch (err) {
    console.log(err);
    app.html(
      `Looks like the developer of this site sucks at coding. There was an error. <br><br><span style="color: green; font-family: monospace;">${err.message}</span>`
    );
  }
}

$("#idinput").submit((event) => {
  event.preventDefault();
  console.log(`inputted ${document.forms["idinput"]["id"].value}`);
  socket.emit(
    "login",
    parseInt(document.forms["idinput"]["id"].value),
    function (result, data, status) {
      if (result) {
        console.log("passed.");
        $("#inputdiv").fadeOut(500, function () {
          $("#inputdiv").hide(() => {
            $("#app").css("font-size", "1.5em");
            $("#title").html(`mdbs session`);
            if (data.name === "?????") {
              let randomSymbols = "!@#$%^&*r";
              randomSymbols = randomSymbols.split("");
              let finalString = "";
              for (var i = 0; i < 5; i++) {
                let currentSymbol =
                  randomSymbols[
                    Math.floor(Math.random() * randomSymbols.length)
                  ];
                if (currentSymbol === "r") {
                  finalString += "Giles".split("")[i];
                } else {
                  finalString += currentSymbol;
                }
              }
              $("#app").html(
                `Welcome back to the MDBS, <span class="glitch" style="font-size: 1em" data-text="${finalString}">${finalString}.</span>`
              );
            } else if (data.level > 1) {
              $("#app").html(`Welcome back to the MDBS, ${data.name}.`);
            } else {
              $("#app").html(`Welcome to the MDBS, ${data.name}.`);
            }
          });
          $("#app").fadeIn(1000);
          $("#app").fadeOut(1000, () => {
            $("#title").html("&#65279;");
            loadStatus(status, data);
          });
          $("#app").fadeIn(1000);
        });
      } else {
        $("#inputdiv").fadeOut(100, () => {
          document.forms["idinput"]["id"].value = "";
        });
        console.log("failed.");
        $("#inputdiv").fadeIn(100);
      }
    }
  );
});
