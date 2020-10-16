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

var _coreUtils = _interopRequireDefault(require("@opentripplanner/core-utils"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _form = require("../../actions/form");

var _styled = require("./styled");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var DateTimeModal = /*#__PURE__*/function (_Component) {
  _inherits(DateTimeModal, _Component);

  var _super = _createSuper(DateTimeModal);

  function DateTimeModal() {
    _classCallCheck(this, DateTimeModal);

    return _super.apply(this, arguments);
  }

  _createClass(DateTimeModal, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          date = _this$props.date,
          dateFormatLegacy = _this$props.dateFormatLegacy,
          departArrive = _this$props.departArrive,
          setQueryParam = _this$props.setQueryParam,
          time = _this$props.time,
          timeFormatLegacy = _this$props.timeFormatLegacy;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "date-time-modal"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "main-panel"
      }, /*#__PURE__*/_react.default.createElement(_styled.StyledDateTimeSelector, {
        className: "date-time-selector",
        date: date,
        departArrive: departArrive,
        onQueryParamChange: setQueryParam,
        time: time // These props below are for Safari on MacOS, and legacy browsers
        // that don't support `<input type="time|date">`.
        // These props are not relevant in modern browsers,
        // where `<input type="time|date">` already
        // formats the time|date according to the OS settings.
        ,
        dateFormatLegacy: dateFormatLegacy,
        timeFormatLegacy: timeFormatLegacy
      })));
    }
  }]);

  return DateTimeModal;
}(_react.Component);

_defineProperty(DateTimeModal, "propTypes", {
  setQueryParam: _propTypes.default.func
});

var mapStateToProps = function mapStateToProps(state, ownProps) {
  var _state$otp$currentQue = state.otp.currentQuery,
      departArrive = _state$otp$currentQue.departArrive,
      date = _state$otp$currentQue.date,
      time = _state$otp$currentQue.time;
  var config = state.otp.config;
  return {
    config: config,
    departArrive: departArrive,
    date: date,
    time: time,
    // These props below are for legacy browsers (see render method above).
    timeFormatLegacy: _coreUtils.default.time.getTimeFormat(config),
    dateFormatLegacy: _coreUtils.default.time.getDateFormat(config)
  };
};

var mapDispatchToProps = {
  setQueryParam: _form.setQueryParam
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(DateTimeModal);

exports.default = _default;
module.exports = exports.default;

//# sourceMappingURL=date-time-modal.js