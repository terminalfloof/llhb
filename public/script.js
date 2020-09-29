// setup socket.io
var socket = io();

// on document ready, hide "#app".
$(document).ready(() => {
  $("#app").hide();
});

class DebugTool {
  constructor() {
    this._glitchDebug = false;
  }

  get glitchDebug() {
    return this._glitchDebug;
  }

  openApp() {
    $("form").hide();
    $("#app").show(() => {
      console.log("app opened.");
    });
  }

  toggleGlitchDebug() {
    if (!this._glitchDebug) {
      console.log("Set glitchDebug to true.");
      this._glitchDebug = true;
    } else {
      console.log("Set glitchDebug to false.");
      this._glitchDebug = false;
    }
  }
}

var debug = new DebugTool();

function glitch(jQueryElement, message, amountOfSteps, timeBetweenSteps) {
  var aOS = amountOfSteps || 25;
  var tBS = timeBetweenSteps || 15;
  var doDebug = debug.glitchDebug;
  if (doDebug) {
    console.log(
      `Doing ${aOS} steps with ${tBS} seconds in between, totalling ${
        (aOS * tBS) / 1000
      } seconds.`
    );
  }
  let messageLength = message.length;
  let timeoutTime = 0;
  let glitchLetters = `qwertyuiopasdfghjklzxcvbnm1234567890!@#$%^&*()`.split(
    ""
  );
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

// just a countdown
function showEnd(date, endMessage) {
  var end = new Date(date);

  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;
  var timer;

  function showRemaining() {
    var now = new Date();
    var distance = end - now;
    if (distance < 0) {
      clearInterval(timer);
      $("#app").html(endMessage);
      return;
    }
    var days = Math.floor(distance / _day)
      .toString()
      .padStart(2, "0");
    var hours = Math.floor((distance % _day) / _hour)
      .toString()
      .padStart(2, "0");
    var minutes = Math.floor((distance % _hour) / _minute)
      .toString()
      .padStart(2, "0");
    var seconds = Math.floor((distance % _minute) / _second)
      .toString()
      .padStart(2, "0");
    var html = `${days}.${hours}.${minutes}.${seconds}`;
    html = html
      .toString()
      .split("00")
      .join(
        `<span class="glitch" data-text="00" style="font-size: 1em;">00</span>`
      );
    $("#app").html(html);
  }
  showRemaining();
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
                `Welcome to the MDBS, <span class="glitch" style="font-size: 1em" data-text="${finalString}">${finalString}.</span>`
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
