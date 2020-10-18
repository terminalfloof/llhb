var socket = io();

var app = document.getElementById("app");

$(app).hide();

$("#form").submit(function (e) {
	e.preventDefault();
	socket.emit("login", $("#input").val());
	$("#form").fadeOut(500, function () {
		ReactDOM.render(React.createElement(
			"h1",
			null,
			"Hi"
		), app);
		$("#app").fadeIn(500);
	});
});