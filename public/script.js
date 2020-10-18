var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// socket.io
var socket = io();

// declare stuff from document
var app = document.getElementById("app");
var form = document.getElementById("form");

// hide the app by default.
$(app).hide();

// when the form submits
$(form).submit(function (e) {
	e.preventDefault();
	if (!form[0].value) {
		// if there's nothing inside, pulse red on the border.
		$(form[0]).css("transition", "all 0.1s ease-in-out");
		$(form[0]).css("border-bottom", "2px solid lightcoral");
		setTimeout(function () {
			$(form[0]).css("transition", "");
			$(form[0]).css("border-bottom", "");
		}, 100);
	} else {
		// change color to green, then:
		$(form[0]).css("transition", "all 0.1s ease-in-out");
		$(form[0]).css("color", "mediumseagreen");
		setTimeout(function () {
			$(form).fadeOut(500, function () {
				$(app).fadeIn(500);
			});
		}, 250);
	}
});

var ChangeClick = function (_React$Component) {
	_inherits(ChangeClick, _React$Component);

	function ChangeClick() {
		_classCallCheck(this, ChangeClick);

		return _possibleConstructorReturn(this, (ChangeClick.__proto__ || Object.getPrototypeOf(ChangeClick)).apply(this, arguments));
	}

	_createClass(ChangeClick, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"h1",
				{
					id: "clickyButton",
					onClick: function onClick() {
						$("#clickyButton").html("ow");
					}
				},
				"click me to change me hehe"
			);
		}
	}]);

	return ChangeClick;
}(React.Component);

var App = function (_React$Component2) {
	_inherits(App, _React$Component2);

	function App() {
		_classCallCheck(this, App);

		return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
	}

	_createClass(App, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				null,
				React.createElement(
					"h1",
					null,
					"hi lol"
				),
				React.createElement("br", null),
				React.createElement(ChangeClick, null)
			);
		}
	}]);

	return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), app);