// socket.io
var socket = io();

// declare stuff from document
let app = document.getElementById("app");
let form = document.getElementById("form");

// hide the app by default.
$(app).hide();

// when the form submits
$(form).submit((e) => {
	e.preventDefault();
	if (!form[0].value) {
		// if there's nothing inside, pulse red on the border.
		$(form[0]).css("transition", "all 0.1s ease-in-out");
		$(form[0]).css("border-bottom", "2px solid lightcoral");
		setTimeout(() => {
			$(form[0]).css("transition", "");
			$(form[0]).css("border-bottom", "");
		}, 100);
	} else {
		// change color to green, then:
		$(form[0]).css("transition", "all 0.1s ease-in-out");
		$(form[0]).css("color", "mediumseagreen");
		setTimeout(() => {
			$(form).fadeOut(500, () => {
				$(app).fadeIn(500);
			});
		}, 250);
	}
});

class ChangeClick extends React.Component {
	render() {
		return (
			<h1
				id="clickyButton"
				onClick={function () {
					$("#clickyButton").html("ow");
				}}
			>
				click me to change me hehe
			</h1>
		);
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				<h1>hi lol</h1>
				<br />
				<ChangeClick />
			</div>
		);
	}
}

ReactDOM.render(<App />, app);
