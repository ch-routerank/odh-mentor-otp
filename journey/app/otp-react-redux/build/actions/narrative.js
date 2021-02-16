"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setActiveItinerary = setActiveItinerary;
exports.updateItineraryFilter = exports.setVisibleItinerary = exports.setUseRealtimeResponse = exports.setActiveStep = exports.setActiveLeg = void 0;

var _coreUtils = _interopRequireDefault(require("@opentripplanner/core-utils"));

var _reduxActions = require("redux-actions");

var _api = require("./api");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setActiveItinerary(payload) {
  return function (dispatch, getState) {
    // Trigger change in store.
    dispatch(settingActiveitinerary(payload)); // Update URL params.

    var urlParams = _coreUtils.default.query.getUrlParams();

    urlParams.ui_activeItinerary = payload.index;
    dispatch((0, _api.setUrlSearch)(urlParams));
  };
}

var settingActiveitinerary = (0, _reduxActions.createAction)('SET_ACTIVE_ITINERARY');
var setActiveLeg = (0, _reduxActions.createAction)('SET_ACTIVE_LEG');
exports.setActiveLeg = setActiveLeg;
var setActiveStep = (0, _reduxActions.createAction)('SET_ACTIVE_STEP');
exports.setActiveStep = setActiveStep;
var setUseRealtimeResponse = (0, _reduxActions.createAction)('SET_USE_REALTIME_RESPONSE'); // Set itinerary visible on map. This is used for mouse over effects with
// itineraries in the list.

exports.setUseRealtimeResponse = setUseRealtimeResponse;
var setVisibleItinerary = (0, _reduxActions.createAction)('SET_VISIBLE_ITINERARY');
exports.setVisibleItinerary = setVisibleItinerary;
var updateItineraryFilter = (0, _reduxActions.createAction)('UPDATE_ITINERARY_FILTER');
exports.updateItineraryFilter = updateItineraryFilter;

//# sourceMappingURL=narrative.js