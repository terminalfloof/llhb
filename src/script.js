var socket = io();

let app = document.getElementById("app");

$(app).hide();

$("#form").submit((e) => {
	e.preventDefault();
	socket.emit("login", $("#input").val());
	$("#form").fadeOut(500, () => {
		ReactDOM.render(<h1>Hi</h1>, app);
		$("#app").fadeIn(500);
	});
});
