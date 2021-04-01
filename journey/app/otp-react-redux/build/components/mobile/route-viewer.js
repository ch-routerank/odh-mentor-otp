"use strict";

require("core-js/modules/web.dom.iterable.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _container = _interopRequireDefault(require("./container"));

var _navigationBar = _interopRequireDefault(require("./navigation-bar"));

var _routeViewer = _interopRequireDefault(require("../viewers/route-viewer"));

var _defaultMap = _interopRequireDefault(require("../map/default-map"));

var _ui = require("../../actions/ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MobileRouteViewer extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_backClicked", () => {
      this.props.setViewedRoute(null);
      this.props.setMainPanelContent(null);
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_container.default, null, /*#__PURE__*/_react.default.createElement(_navigationBar.default, {
      headerText: this.props.languageConfig.routeViewer || 'Visualizza Linee',
      showBackButton: true,
      onBackClicked: this._backClicked
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "viewer-map"
    }, /*#__PURE__*/_react.default.createElement(_defaultMap.default, null)), /*#__PURE__*/_react.default.createElement("div", {
      className: "viewer-container"
    }, /*#__PURE__*/_react.default.createElement(_routeViewer.default, {
      hideBackButton: true
    })));
  }

} // connect to the redux store


_defineProperty(MobileRouteViewer, "propTypes", {
  setViewedRoute: _propTypes.default.func,
  setMainPanelContent: _propTypes.default.func
});

const mapStateToProps = (state, ownProps) => {
  return {
    languageConfig: state.otp.config.language
  };
};

const mapDispatchToProps = {
  setViewedRoute: _ui.setViewedRoute,
  setMainPanelContent: _ui.setMainPanelContent
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MobileRouteViewer);

exports.default = _default;
module.exports = exports.default;

//# sourceMappingURL=route-viewer.js