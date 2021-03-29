"use strict";

require("core-js/modules/web.dom.iterable.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.linkType = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactBootstrap = require("react-bootstrap");

var _ui = require("../../actions/ui");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const linkType = _propTypes.default.shape({
  target: _propTypes.default.string,
  text: _propTypes.default.string.isRequired,
  url: _propTypes.default.string.isRequired
});
/**
 * This component displays a react-bootstrap MenuItem for a link entry,
 * and routes to the path provided by the link when the MenuItem's onSelect event is triggered.
 */


exports.linkType = linkType;

class LinkMenuItem extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_handleClick", () => {
      const {
        link,
        routeTo
      } = this.props;
      routeTo(link.url);
    });
  }

  render() {
    const {
      link
    } = this.props;
    const {
      target,
      text
    } = link;
    return /*#__PURE__*/_react.default.createElement(_reactBootstrap.MenuItem, {
      onSelect: this._handleClick,
      target: target
    }, text);
  }

} // connect to the redux store


_defineProperty(LinkMenuItem, "propTypes", {
  link: linkType.isRequired
});

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = {
  routeTo: _ui.routeTo
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(LinkMenuItem);

exports.default = _default;

//# sourceMappingURL=link-menu-item.js