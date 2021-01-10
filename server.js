const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http").createServer(app);
const PORT = process.env.PORT || 8000;
const path = require("path")
const io = require("socket.io")(http);
const nsm = require("node-sass-middleware")
let acceptedCodes = [];


app.use(nsm({
  src: __dirname,
  dest: path.join(__dirname, "public")
}))

//send the website.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
//hit the secret
app.get("/1523", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/1523.html")
})
//teapot
app.get("/makeCoffee", (req, res) => {
  res.status(418).sendFile(__dirname + "/views/errors/418.html")
})

app.use(express.static("public"));

// Handle 404
app.use(function(req, res) {
  res.status(404).sendFile(__dirname + "/views/errors/404.html")
});

// Handle 500
app.use(function(error, req, res, next) {
  res.status(500).sendFile(__dirname + "/views/errors/500.html")
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

//on connect,
io.on("connection", socket => {
  socket.emit('defineKey', process.env.DEBUGKEY)
});