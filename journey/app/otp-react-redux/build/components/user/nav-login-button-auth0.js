"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _useAuth0Hooks = require("use-auth0-hooks");

var _constants = require("../../util/constants");

var _navLoginButton = _interopRequireDefault(require("./nav-login-button"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This component wraps NavLoginButton with Auth0 information.
 */
const NavLoginButtonAuth0 = ({
  className,
  id,
  links,
  style
}) => {
  const {
    isAuthenticated,
    login,
    logout,
    user
  } = (0, _useAuth0Hooks.useAuth)(); // On login, preserve the current trip query if any.
  // TODO: check that URLs are whitelisted. All trip query URLs in /#/ are.

  const afterLoginPath = '/#/signedin';

  const handleLogin = () => login({
    redirect_uri: `${_constants.URL_ROOT}${afterLoginPath}`,
    appState: {
      urlHash: window.location.hash
    } // The part of href from #/?, e.g. #/?ui_activeSearch=...

  }); // On logout, it is better to "clear" the screen, so
  // return to redirectUri set in <Auth0Provider> (no specific event handler).


  return /*#__PURE__*/_react.default.createElement(_navLoginButton.default, {
    className: className,
    id: id,
    links: links,
    onSignInClick: handleLogin,
    onSignOutClick: logout,
    profile: isAuthenticated ? user : null,
    style: style
  });
};

var _default = NavLoginButtonAuth0;
exports.default = _default;
module.exports = exports.default;

//# sourceMappingURL=nav-login-button-auth0.js