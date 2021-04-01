"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactBootstrap = require("react-bootstrap");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _handleClick = () => window.location.reload();
/**
 * This component contains the prompt for the user to verify their email address.
 * It also contains a button that lets the user finish account setup.
 *
 * (One way to make sure the parent page fetches the latest email verification status
 * is to simply reload the page.)
 */


const VerifyEmailScreen = () => /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h1", null, "Verify your email address"), /*#__PURE__*/_react.default.createElement("p", null, "Please check your email inbox and follow the link in the message to verify your email address before finishing your account setup."), /*#__PURE__*/_react.default.createElement("p", null, "Once you're verified, click the button below to continue."), /*#__PURE__*/_react.default.createElement(_reactBootstrap.Button, {
  bsSize: "large",
  bsStyle: "primary",
  onClick: _handleClick
}, "My email is verified!"));

var _default = VerifyEmailScreen;
exports.default = _default;
module.exports = exports.default;

//# sourceMappingURL=verify-email-screen.js