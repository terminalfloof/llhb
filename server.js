//installing modules
require("dotenv").config();
const chalk = require("chalk");
const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http").createServer(app);
const PORT = process.env.PORT || 3000;
const io = require("socket.io")(http);

// get the accesskeys from the json file.
const accessKeys = require("./accessKeys.json");

app.get("/users", (req, res, next) => {
	res.status(401).send("401: Unauthorized.");
});

// send the website.
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

//use all files from public.
app.use(express.static("public"));

http.listen(PORT, () => {
	console.log(`listening on ${PORT}`);
});

//on connect,
io.on("connection", (socket) => {
	console.log("user connected.");
});

// THESE ARE ALL FOR ERRORS/SECRETS.

// get the secret
app.get("/1523", (req, res) => {
	res.sendFile(__dirname + "/views/1523.html");
});

// teapot
app.get("/makeCoffee", (req, res) => {
	res.sendFile(__dirname + "/views/errors/418.html");
});

// Handle 404
app.use(function (req, res) {
	res.sendFile(__dirname + "/views/errors/404.html");
});

// Handle 500
app.use(function (error, req, res, next) {
	res.sendFile(__dirname + "/views/errors/500.html");
});
