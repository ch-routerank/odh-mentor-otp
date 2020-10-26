"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.weak-map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.reflect.construct");

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _dateTimeScreen = _interopRequireDefault(require("./date-time-screen"));

var _optionsScreen = _interopRequireDefault(require("./options-screen"));

var _locationSearch = _interopRequireDefault(require("./location-search"));

var _welcomeScreen = _interopRequireDefault(require("./welcome-screen"));

var _resultsScreen = _interopRequireDefault(require("./results-screen"));

var _searchScreen = _interopRequireDefault(require("./search-screen"));

var _stopViewer = _interopRequireDefault(require("./stop-viewer"));

var _tripViewer = _interopRequireDefault(require("./trip-viewer"));

var _routeViewer = _interopRequireDefault(require("./route-viewer"));

var _ui = require("../../actions/ui");

var _state = require("../../util/state");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MobileMain = /*#__PURE__*/function (_Component) {
  _inherits(MobileMain, _Component);

  var _super = _createSuper(MobileMain);

  function MobileMain() {
    _classCallCheck(this, MobileMain);

    return _super.apply(this, arguments);
  }

  _createClass(MobileMain, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // Check if we are in the welcome screen and both locations have been set OR
      // auto-detect is denied and one location is set
      if (prevProps.uiState.mobileScreen === _ui.MobileScreens.WELCOME_SCREEN && (this.props.currentQuery.from && this.props.currentQuery.to || !this.props.currentPosition.coords && (this.props.currentQuery.from || this.props.currentQuery.to))) {
        // If so, advance to main search screen
        this.props.setMobileScreen(_ui.MobileScreens.SEARCH_FORM);
      }

      if (!prevProps.activeItinerary && this.props.activeItinerary) {
        this.props.setMobileScreen(_ui.MobileScreens.RESULTS_SUMMARY);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          itineraryClass = _this$props.itineraryClass,
          itineraryFooter = _this$props.itineraryFooter,
          LegIcon = _this$props.LegIcon,
          map = _this$props.map,
          ModeIcon = _this$props.ModeIcon,
          title = _this$props.title,
          uiState = _this$props.uiState; // check for route viewer

      if (uiState.mainPanelContent === _ui.MainPanelContent.ROUTE_VIEWER) {
        return /*#__PURE__*/_react.default.createElement(_routeViewer.default, null);
      } // check for viewed stop


      if (uiState.viewedStop) return /*#__PURE__*/_react.default.createElement(_stopViewer.default, null); // check for viewed trip

      if (uiState.viewedTrip) return /*#__PURE__*/_react.default.createElement(_tripViewer.default, null);

      switch (uiState.mobileScreen) {
        case _ui.MobileScreens.WELCOME_SCREEN:
          return /*#__PURE__*/_react.default.createElement(_welcomeScreen.default, {
            map: map,
            title: title
          });

        case _ui.MobileScreens.SET_INITIAL_LOCATION:
          return /*#__PURE__*/_react.default.createElement(_locationSearch.default, {
            locationType: "to",
            backScreen: _ui.MobileScreens.WELCOME_SCREEN
          });

        case _ui.MobileScreens.SEARCH_FORM:
          return /*#__PURE__*/_react.default.createElement(_searchScreen.default, {
            map: map,
            newScreen: this.newScreen
          });

        case _ui.MobileScreens.SET_FROM_LOCATION:
          return /*#__PURE__*/_react.default.createElement(_locationSearch.default, {
            locationType: "from",
            backScreen: _ui.MobileScreens.SEARCH_FORM
          });

        case _ui.MobileScreens.SET_TO_LOCATION:
          return /*#__PURE__*/_react.default.createElement(_locationSearch.default, {
            locationType: "to",
            backScreen: _ui.MobileScreens.SEARCH_FORM
          });

        case _ui.MobileScreens.SET_DATETIME:
          return /*#__PURE__*/_react.default.createElement(_dateTimeScreen.default, null);

        case _ui.MobileScreens.SET_OPTIONS:
          return /*#__PURE__*/_react.default.createElement(_optionsScreen.default, {
            ModeIcon: ModeIcon
          });

        case _ui.MobileScreens.RESULTS_SUMMARY:
          return /*#__PURE__*/_react.default.createElement(_resultsScreen.default, {
            itineraryClass: itineraryClass,
            itineraryFooter: itineraryFooter,
            LegIcon: LegIcon,
            map: map
          });

        default:
          return /*#__PURE__*/_react.default.createElement("p", null, "Invalid mobile screen");
      }
    }
  }]);

  return MobileMain;
}(_react.Component); // connect to the redux store


_defineProperty(MobileMain, "propTypes", {
  currentQuery: _propTypes.default.object,
  itineraryClass: _propTypes.default.func,
  LegIcon: _propTypes.default.elementType.isRequired,
  ModeIcon: _propTypes.default.elementType.isRequired,
  map: _propTypes.default.element,
  setMobileScreen: _propTypes.default.func,
  title: _propTypes.default.element,
  uiState: _propTypes.default.object
});

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    uiState: state.otp.ui,
    currentQuery: state.otp.currentQuery,
    currentPosition: state.otp.location.currentPosition,
    activeItinerary: (0, _state.getActiveItinerary)(state.otp)
  };
};

var mapDispatchToProps = {
  setMobileScreen: _ui.setMobileScreen
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MobileMain);

exports.default = _default;
module.exports = exports.default;

//# sourceMappingURL=main.js