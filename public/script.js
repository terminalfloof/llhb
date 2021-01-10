// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyB2pbYVVcpqTwSKQ-Wr0Ds5WWe0EZ1gx7U",
  authDomain: "ddllhb.firebaseapp.com",
  databaseURL: "https://ddllhb.firebaseio.com",
  projectId: "ddllhb",
  storageBucket: "ddllhb.appspot.com",
  messagingSenderId: "702462043930",
  appId: "1:702462043930:web:1db5e64613d72095816ea3",
  measurementId: "G-S0FXP2QG84"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let db = firebase.firestore();
let userData;
//setup socket.io
var socket = io();

let __debugRandomKey = () => {};

socket.on("defineKey", key => {
  __debugRandomKey = inputtedKey => {
    let debugKey = key;
    if (inputtedKey !== debugKey) {
      console.log("invalid");
    } else {
      db.collection("users")
        .get()
        .then(a => {
          let arr = [];
          a.forEach(doc => {
            arr.push(doc.data());
          });
          let itemSelected = false;
          let selectedItem = "";
          while (!itemSelected) {
            let randomSelect = Math.floor(Math.random() * arr.length);
            console.log(
              `Selected number ${randomSelect} (${arr[randomSelect].key}).`
            );
            let user = arr[randomSelect];
            console.log(`That would be ${user.name}.`);
            if (user.level === 1) {
              console.log("User level IS 1.");
              itemSelected = true;
              selectedItem = user.key;
            } else {
              console.log(`User level is ${user.level}.`);
            }
          }
          document.forms[0][0].value = selectedItem;
        });
    }
  };
});

//on document ready, hide "#app".
$(document).ready(() => {
  $("#app").hide();
  $("#loggedIn").hide();
});

//prevents duplicating bug
let alreadySubmitted = false;
// on submit
$("#idinput").submit(e => {
  e.preventDefault();
  if (!alreadySubmitted) {
    alreadySubmitted = true;
    if (!$("#input").val()) {
      alreadySubmitted = false;
      $("#input").css("transition", "all 0s");
      $("#input").css("border-bottom", "2px solid #FDFD96");
      setTimeout(() => {
        $("#input").css("transition", "");
        $("#input").css("border-bottom", "");
      }, 500);
    } else {
      if ($("#input").val() == "1523") {
        $(document.body).css("font-size", "3em");
        $(document.body).html("/");
      } else {
        db.collection("users")
          .doc($("#input").val())
          .get()
          .then(doc => {
            if (doc.exists) {
              userData = doc.data();
              $("#input").css("transition", "all 0s");
              $("#input").css("border-bottom", "2px solid lightgreen");
              setTimeout(() => {
                $("#input").css("transition", "");
                $("#input").css("border-bottom", "");
                $("#idinput").fadeOut(500, () => {
                  setup(() => {
                    $("#app").fadeIn(500);
                  });
                });
              }, 500);
            } else {
              alreadySubmitted = false;
              $("#input").css("transition", "all 0s");
              $("#input").css("border-bottom", "2px solid coral");
              setTimeout(() => {
                $("#input").css("transition", "");
                $("#input").css("border-bottom", "");
              }, 500);
            }
          });
      }
    }
  }
});

function setup(callback) {
  var callback = callback ||  function(){};
  $("#app").append(`<h1>...</h1>`)
  $("#loggedIn").html(
    `<span>${userData.name}</span><div class="break"></div><span style="color: azure;font-weight: bold;font-size: 1.2em;">${userData.level === 1? 'D' + userData.dorm : 'L' + userData.level}</span>`
  );
  $("#loggedIn").fadeIn(250);
  callback();
}
