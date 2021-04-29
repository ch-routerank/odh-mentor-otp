"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLeafletItineraryBounds = getLeafletItineraryBounds;
exports.getLeafletLegBounds = getLeafletLegBounds;

var _leaflet = require("leaflet");

var _src = _interopRequireDefault(require("../otp-ui/core-utils/src"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLeafletItineraryBounds(itinerary) {
  return (0, _leaflet.latLngBounds)(_src.default.itinerary.getItineraryBounds(itinerary));
}
/**
 * Return a leaflet LatLngBounds object that encloses the given leg's geometry.
 */


function getLeafletLegBounds(leg) {
  return (0, _leaflet.latLngBounds)(_src.default.itinerary.getLegBounds(leg));
}

//# sourceMappingURL=itinerary.js