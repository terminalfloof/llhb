const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http").createServer(app);
const PORT = process.env.PORT || 3000;
const io = require("socket.io")(http);
const data = require("./accessKeys.json");
const status = require("./status.json");
let acceptedCodes = [];
for (var i = 0; i < data.length; i++) {
  acceptedCodes.push(parseInt(data[i].key));
}

//send the website.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
//hit the secret
app.get("/1523", (req, res) => {
  res.sendFile(__dirname + "/views/1523.html")
})
//teapot
app.get("/makeCoffee", (req, res) => {
  res.sendFile(__dirname + "/views/errors/418.html")
})

app.use(express.static("public"));

// Handle 404
app.use(function(req, res) {
  res.sendFile(__dirname + "/views/errors/404.html")
});

// Handle 500
app.use(function(error, req, res, next) {
  res.sendFile(__dirname + "/views/errors/500.html")
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

// Check if it's a valid access key.
function getAccessData(accessKey) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].key === accessKey) {
      return data[i];
    }
  }
}

function answersEdit(code, response) {
  let answers = JSON.parse(fs.readFileSync("answers.json", "UTF-8"));
      for (var i = 0; i<Object.keys(answers).length; i++) {
        if (answers[Object.keys(answers)[i]].key === code) {
          answers[Object.keys(answers)[i]].response = response;
        }
      }
    fs.writeFileSync("answers.json", JSON.stringify(answers), "UTF-8")
}


//on connect,
io.on("connection", socket => {
  // on login, receive the code + a check function.
  socket.on("login", (code, check) => {
    // check if it is a valid code, if not, reject.
    if (acceptedCodes.includes(code)) {
      check(true, getAccessData(code), status);
    } else {
      check(false);
    }
  });
  socket.on("surveyReply", (code, response) => {
    console.log(`received ${response} from ${code}`)
    answersEdit(code, response)
  })
});