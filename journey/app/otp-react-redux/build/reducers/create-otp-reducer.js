"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInitialState = getInitialState;
exports.default = void 0;

var _clone = _interopRequireDefault(require("clone"));

var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));

var _lodash = _interopRequireDefault(require("lodash.isequal"));

var _objectPath = _interopRequireDefault(require("object-path"));

var _src = _interopRequireDefault(require("../otp-ui/core-utils/src"));

var _ui = require("../actions/ui");

var _state = require("../util/state");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  isTransit,
  getTransitModes
} = _src.default.itinerary;
const {
  matchLatLon
} = _src.default.map;
const {
  filterProfileOptions
} = _src.default.profile;
const {
  ensureSingleAccessMode,
  getDefaultQuery,
  getTripOptionsFromQuery
} = _src.default.query;
const {
  getItem,
  removeItem,
  storeItem
} = _src.default.storage;
const {
  getUserTimezone
} = _src.default.time;
const MAX_RECENT_STORAGE = 5; // TODO: fire planTrip action if default query is complete/error-free

/**
 * Validates the initial state of the store. This is intended to mainly catch
 * configuration issues since a manually edited config file is loaded into the
 * initial state.
 * TODO: mabye it's a better idea to move all of this to a script that can do
 *  JSON Schema validation and other stuff.
 */

function validateInitalState(initialState) {
  const {
    config
  } = initialState;
  const errors = []; // validate that the ArcGIS geocoder isn't used with a persistence strategy of
  // `localStorage`. ArcGIS requires the use of a paid account to store geocode
  // results.
  // See https://developers.arcgis.com/rest/geocode/api-reference/geocoding-free-vs-paid.htm

  if (_objectPath.default.get(config, 'persistence.enabled') && _objectPath.default.get(config, 'persistence.strategy') === 'localStorage' && _objectPath.default.get(config, 'geocoder.type') === 'ARCGIS') {
    errors.push(new Error('Local Storage persistence and ARCGIS geocoder cannot be enabled at the same time!'));
  }

  if (errors.length > 0) {
    throw new Error(errors.reduce((message, error) => {
      return `${message}\n- ${error.message}`;
    }, 'Encountered the following configuration errors:'));
  }
}
/**
 * Create the initial state of otp-react-redux using user-provided config, any
 * items in localStorage and a few defaults.
 */


function getInitialState(userDefinedConfig, initialQuery) {
  const defaultConfig = {
    autoPlan: false,
    debouncePlanTimeMs: 0,
    language: {},
    transitOperators: [],
    realtimeEffectsDisplayThreshold: 120,
    routingTypes: [],
    stopViewer: {
      numberOfDepartures: 3,
      // per pattern
      // This is set to 345600 (four days) so that, for example, if it is Friday and
      // a route does not begin service again until Monday, we are showing its next
      // departure and it is not entirely excluded from display.
      timeRange: 345600 // four days in seconds

    }
  };
  const config = Object.assign(defaultConfig, userDefinedConfig);

  if (!config.homeTimezone) {
    config.homeTimezone = getUserTimezone();
    console.warn(`Config value 'homeTimezone' not configured for this webapp!\n
      This value is recommended in order to properly display stop times for
      users that are not in the timezone that the transit system is in. The
      detected user timezone of '${config.homeTimezone}' will be used. Hopefully
      that is the right one...`);
  } // Load user settings from local storage.
  // TODO: Make this work with settings fetched from alternative storage system
  //  (e.g., OTP backend middleware containing user profile system).
  // User overrides determine user's default mode/query parameters.


  const userOverrides = getItem('defaultQuery', {}); // Combine user overrides with default query to get default search settings.

  const defaults = Object.assign(getDefaultQuery(config), userOverrides); // Whether to auto-refresh stop arrival times in the Fermata.

  const autoRefreshStopTimes = getItem('autoRefreshStopTimes', true); // User's home and work locations

  const home = getItem('home');
  const work = getItem('work'); // Whether recent searches and places should be tracked in local storage.

  const trackRecent = getItem('trackRecent', false);
  const expandAdvanced = getItem('expandAdvanced', false); // Recent places used in trip plan searches.

  const recentPlaces = getItem('recent', []); // List of user's favorite stops.

  const favoriteStops = getItem('favoriteStops', []); // Recent trip plan searches (excluding time/date parameters to avoid complexity).

  const recentSearches = getItem('recentSearches', []); // Filter valid locations found into locations list.

  const locations = [home, work].filter(p => p); // TODO: parse and merge URL query params w/ default query
  // populate query by merging any provided query params w/ the default params

  const currentQuery = Object.assign(defaults, initialQuery); // Add configurable locations to home and work locations

  if (config.locations) {
    locations.push(...config.locations.map(l => ({ ...l,
      type: 'suggested'
    })));
  } // Check for alternative routerId in session storage. This is generally used
  // for testing single GTFS feed OTP graphs that are deployed to feed-specific
  // routers (e.g., https://otp.server.com/otp/routers/non_default_router).
  // This routerId session value is initially set by visiting otp-rr
  // with the path /start/:latLonZoomRouter, which dispatches the SET_ROUTER_ID
  // action and stores the value in sessionStorage.
  // Note: this mechanism assumes that the OTP API path is otp/routers/default.


  const routerId = window.sessionStorage.getItem('routerId'); // If routerId is found, update the config.api.path (keep the original config
  // value at originalPath in case it needs to be reverted.)

  if (routerId) {
    config.api.originalPath = userDefinedConfig.api.path;
    config.api.path = `/otp/routers/${routerId}`;
  }

  let queryModes = currentQuery.mode.split(','); // If 'TRANSIT' is included in the mode list, replace it with individual modes

  if (queryModes.includes('TRANSIT')) {
    // Isolate the non-transit modes in queryModes
    queryModes = queryModes.filter(m => !isTransit(m)); // Add all possible transit modes

    queryModes = queryModes.concat(getTransitModes(config)); // Stringify and set as OTP 'mode' query param

    currentQuery.mode = queryModes.join(',');
  } // If we are in 'ITINERARY' mode, ensure that one and only one access mode is selected


  if (currentQuery.routingType === 'ITINERARY') {
    queryModes = ensureSingleAccessMode(queryModes);
  }

  return {
    config,
    currentQuery,
    filter: {
      filter: 'ALL',
      sort: {
        direction: 'ASC',
        type: 'BEST'
      }
    },
    location: {
      currentPosition: {
        error: null,
        coords: null,
        fetching: false
      },
      sessionSearches: [],
      nearbyStops: []
    },
    user: {
      autoRefreshStopTimes,
      // Do not store from/to or date/time in defaults
      defaults: getTripOptionsFromQuery(defaults),
      expandAdvanced,
      favoriteStops,
      trackRecent,
      locations,
      recentPlaces,
      recentSearches
    },
    searches: {},
    transitIndex: {
      stops: {},
      trips: {}
    },
    useRealtime: true,
    activeSearchId: 0,
    overlay: {
      bikeRental: {
        stations: []
      },
      carRental: {
        stations: []
      },
      parkAndRide: {
        // null default value indicates no request for P&R list has been made
        locations: null
      },
      transit: {
        stops: []
      },
      transitive: null,
      vehicleRental: {
        stations: []
      },
      zipcar: {
        locations: []
      },
      parking: {
        locations: []
      }
    },
    tnc: {
      etaEstimates: {},
      rideEstimates: {}
    },
    ui: {
      mobileScreen: _ui.MobileScreens.WELCOME_SCREEN,
      printView: window.location.href.indexOf('/print/') !== -1,
      diagramLeg: null
    }
  };
}

function createOtpReducer(config, initialQuery) {
  const initialState = getInitialState(config, initialQuery); // validate the inital state

  validateInitalState(initialState);
  return (state = initialState, action) => {
    const searchId = action.payload && action.payload.searchId;
    const requestId = action.payload && action.payload.requestId;
    const activeSearch = state.searches[searchId];

    switch (action.type) {
      case 'ROUTING_REQUEST':
        const {
          activeItinerary,
          pending
        } = action.payload;
        return (0, _immutabilityHelper.default)(state, {
          searches: {
            [searchId]: {
              $set: {
                activeItinerary,
                activeLeg: null,
                activeStep: null,
                pending,
                // FIXME: get query from action payload?
                query: (0, _clone.default)(state.currentQuery),
                response: [],
                timestamp: (0, _state.getTimestamp)()
              }
            }
          },
          activeSearchId: {
            $set: searchId
          }
        });

      case 'ROUTING_ERROR':
        return (0, _immutabilityHelper.default)(state, {
          searches: {
            [searchId]: {
              response: {
                $push: [{
                  error: action.payload.error,
                  requestId
                }]
              },
              pending: {
                $set: activeSearch.pending - 1
              }
            }
          }
        });

      case 'ROUTING_RESPONSE':
        const response = state.currentQuery.routingType === 'PROFILE' ? filterProfileOptions(action.payload.response) : action.payload.response;
        response.requestId = requestId;
        return (0, _immutabilityHelper.default)(state, {
          searches: {
            [searchId]: {
              response: {
                $push: [response]
              },
              pending: {
                $set: activeSearch.pending - 1
              }
            }
          },
          ui: {
            diagramLeg: {
              $set: null
            }
          }
        });

      case 'NON_REALTIME_ROUTING_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          searches: {
            [searchId]: {
              nonRealtimeResponse: {
                $set: action.payload.response
              }
            }
          }
        });

      case 'BIKE_RENTAL_REQUEST':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            bikeRental: {
              pending: {
                $set: true
              },
              error: {
                $set: null
              }
            }
          }
        });

      case 'BIKE_RENTAL_ERROR':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            bikeRental: {
              pending: {
                $set: false
              },
              error: {
                $set: action.payload
              }
            }
          }
        });

      case 'BIKE_RENTAL_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            bikeRental: {
              stations: {
                $set: action.payload.stations
              },
              pending: {
                $set: false
              }
            }
          }
        });

      case 'CAR_RENTAL_ERROR':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            carRental: {
              pending: {
                $set: false
              },
              error: {
                $set: action.payload
              }
            }
          }
        });

      case 'CAR_RENTAL_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            carRental: {
              stations: {
                $set: action.payload.stations
              },
              pending: {
                $set: false
              }
            }
          }
        });

      case 'VEHICLE_RENTAL_ERROR':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            vehicleRental: {
              pending: {
                $set: false
              },
              error: {
                $set: action.payload
              }
            }
          }
        });

      case 'VEHICLE_RENTAL_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            vehicleRental: {
              stations: {
                $set: action.payload.stations
              },
              pending: {
                $set: false
              }
            }
          }
        });

      case 'SET_USE_REALTIME_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          useRealtime: {
            $set: action.payload.useRealtime
          }
        });

      case 'SET_ACTIVE_ITINERARY':
        if (state.activeSearchId !== null) {
          return (0, _immutabilityHelper.default)(state, {
            searches: {
              [state.activeSearchId]: {
                activeItinerary: {
                  $set: action.payload.index
                },
                activeLeg: {
                  $set: null
                },
                activeStep: {
                  $set: null
                }
              }
            }
          });
        }

        return state;

      case 'SET_VISIBLE_ITINERARY':
        if (state.activeSearchId !== null) {
          return (0, _immutabilityHelper.default)(state, {
            searches: {
              [state.activeSearchId]: {
                visibleItinerary: {
                  $set: action.payload.index
                }
              }
            }
          });
        }

        return state;

      case 'SET_ACTIVE_LEG':
        if (state.activeSearchId !== null) {
          return (0, _immutabilityHelper.default)(state, {
            searches: {
              [state.activeSearchId]: {
                activeLeg: {
                  $set: action.payload.index
                },
                activeStep: {
                  $set: null
                }
              }
            }
          });
        }

        return state;

      case 'SET_ACTIVE_STEP':
        if (state.activeSearchId !== null) {
          return (0, _immutabilityHelper.default)(state, {
            searches: {
              [state.activeSearchId]: {
                activeStep: {
                  $set: action.payload.index
                }
              }
            }
          });
        }

        return state;

      case 'SET_LOCATION':
        return (0, _immutabilityHelper.default)(state, {
          currentQuery: {
            [action.payload.locationType]: {
              $set: action.payload.location
            }
          }
        });

      case 'CLEAR_LOCATION':
        return (0, _immutabilityHelper.default)(state, {
          currentQuery: {
            [action.payload.locationType]: {
              $set: null
            }
          }
        });

      case 'SET_QUERY_PARAM':
        return (0, _immutabilityHelper.default)(state, {
          currentQuery: {
            $merge: action.payload
          }
        });

      case 'CLEAR_ACTIVE_SEARCH':
        return (0, _immutabilityHelper.default)(state, {
          activeSearchId: {
            $set: null
          }
        });

      case 'SET_ACTIVE_SEARCH':
        return (0, _immutabilityHelper.default)(state, {
          activeSearchId: {
            $set: action.payload
          }
        });

      case 'CLEAR_DEFAULT_SETTINGS':
        removeItem('defaultQuery');
        return (0, _immutabilityHelper.default)(state, {
          user: {
            defaults: {
              $set: null
            }
          }
        });

      case 'STORE_DEFAULT_SETTINGS':
        storeItem('defaultQuery', action.payload);
        return (0, _immutabilityHelper.default)(state, {
          user: {
            defaults: {
              $set: action.payload
            }
          }
        });

      case 'FORGET_PLACE':
        {
          // Payload is the place ID.
          // Recent place IDs contain the string literal 'recent'.
          if (action.payload.indexOf('recent') !== -1) {
            const recentPlaces = (0, _clone.default)(state.user.recentPlaces); // Remove recent from list of recent places

            const removeIndex = recentPlaces.findIndex(l => l.id === action.payload);
            recentPlaces.splice(removeIndex, 1);
            storeItem('recent', recentPlaces);
            return removeIndex !== -1 ? (0, _immutabilityHelper.default)(state, {
              user: {
                recentPlaces: {
                  $splice: [[removeIndex, 1]]
                }
              }
            }) : state;
          } else {
            const locations = (0, _clone.default)(state.user.locations);
            const removeIndex = locations.findIndex(l => l.id === action.payload);
            removeItem(action.payload);
            return removeIndex !== -1 ? (0, _immutabilityHelper.default)(state, {
              user: {
                locations: {
                  $splice: [[removeIndex, 1]]
                }
              }
            }) : state;
          }
        }

      case 'REMEMBER_PLACE':
        {
          const {
            location,
            type
          } = action.payload;

          switch (type) {
            case 'recent':
              {
                const recentPlaces = (0, _clone.default)(state.user.recentPlaces);
                const index = recentPlaces.findIndex(l => matchLatLon(l, location)); // Replace recent place if duplicate found or add to list.

                if (index !== -1) recentPlaces.splice(index, 1, location);else recentPlaces.push(location);
                const sortedPlaces = recentPlaces.sort((a, b) => b.timestamp - a.timestamp); // Only keep up to 5 recent locations
                // FIXME: Check for duplicates

                if (recentPlaces.length >= MAX_RECENT_STORAGE) {
                  sortedPlaces.splice(MAX_RECENT_STORAGE);
                }

                storeItem('recent', recentPlaces);
                return (0, _immutabilityHelper.default)(state, {
                  user: {
                    recentPlaces: {
                      $set: sortedPlaces
                    }
                  }
                });
              }

            default:
              {
                const locations = (0, _clone.default)(state.user.locations); // Determine if location type (e.g., home or work) already exists in list

                const index = locations.findIndex(l => l.type === type);
                if (index !== -1) locations.splice(index, 1, location);else locations.push(location);
                storeItem(type, location);
                return (0, _immutabilityHelper.default)(state, {
                  user: {
                    locations: {
                      $set: locations
                    }
                  }
                });
              }
          }
        }

      case 'FORGET_STOP':
        {
          // Payload is the stop ID.
          const favoriteStops = (0, _clone.default)(state.user.favoriteStops); // Remove stop from favorites

          const removeIndex = favoriteStops.findIndex(l => l.id === action.payload);
          favoriteStops.splice(removeIndex, 1);
          storeItem('favoriteStops', favoriteStops);
          return removeIndex !== -1 ? (0, _immutabilityHelper.default)(state, {
            user: {
              favoriteStops: {
                $splice: [[removeIndex, 1]]
              }
            }
          }) : state;
        }

      case 'REMEMBER_STOP':
        {
          // Payload is stop data. We want to avoid saving other attributes that
          // might be contained there (like lists of patterns).
          const {
            id,
            name,
            lat,
            lon
          } = action.payload;
          const stop = {
            type: 'stop',
            icon: 'bus',
            id,
            name,
            lat,
            lon
          };
          const favoriteStops = (0, _clone.default)(state.user.favoriteStops);

          if (favoriteStops.length >= MAX_RECENT_STORAGE) {
            window.alert(`Cannot save more than ${MAX_RECENT_STORAGE} stops. Remove one before adding more.`);
            return state;
          }

          const index = favoriteStops.findIndex(s => s.id === stop.id); // Do nothing if duplicate stop found.

          if (index !== -1) {
            console.warn(`Stop with id ${stop.id} already exists in favorites.`);
            return state;
          } else {
            favoriteStops.unshift(stop);
          }

          storeItem('favoriteStops', favoriteStops);
          return (0, _immutabilityHelper.default)(state, {
            user: {
              favoriteStops: {
                $set: favoriteStops
              }
            }
          });
        }
      // FIXME: set up action

      case 'TOGGLE_ADVANCED_OPTIONS':
        storeItem('expandAdvanced', action.payload);
        if (!action.payload) removeItem('expandAdvanced');
        return (0, _immutabilityHelper.default)(state, {
          user: {
            expandAdvanced: {
              $set: action.payload
            }
          }
        });

      case 'TOGGLE_TRACKING':
        {
          storeItem('trackRecent', action.payload);
          let recentPlaces = (0, _clone.default)(state.user.recentPlaces);
          let recentSearches = (0, _clone.default)(state.user.recentSearches);

          if (!action.payload) {
            // If user disables tracking, remove recent searches and locations.
            recentPlaces = [];
            recentSearches = [];
            removeItem('recent');
            removeItem('recentSearches');
          }

          return (0, _immutabilityHelper.default)(state, {
            user: {
              trackRecent: {
                $set: action.payload
              },
              recentPlaces: {
                $set: recentPlaces
              },
              recentSearches: {
                $set: recentSearches
              }
            }
          });
        }

      case 'REMEMBER_SEARCH':
        const searches = (0, _clone.default)(state.user.recentSearches);
        const duplicateIndex = searches.findIndex(s => (0, _lodash.default)(s.query, action.payload.query)); // Overwrite duplicate search (so that new timestamp is stored).

        if (duplicateIndex !== -1) searches[duplicateIndex] = action.payload;else searches.unshift(action.payload);
        const sortedSearches = searches.sort((a, b) => b.timestamp - a.timestamp); // Ensure recent searches do not extend beyong MAX_RECENT_STORAGE

        if (sortedSearches.length >= MAX_RECENT_STORAGE) {
          sortedSearches.splice(MAX_RECENT_STORAGE);
        }

        storeItem('recentSearches', sortedSearches);
        return (0, _immutabilityHelper.default)(state, {
          user: {
            searches: {
              $set: sortedSearches
            }
          }
        });

      case 'FORGET_SEARCH':
        {
          const recentSearches = (0, _clone.default)(state.user.recentSearches);
          const index = recentSearches.findIndex(l => l.id === action.payload); // Remove item from list of recent searches

          recentSearches.splice(index, 1);
          storeItem('recentSearches', recentSearches);
          return index !== -1 ? (0, _immutabilityHelper.default)(state, {
            user: {
              recentSearches: {
                $splice: [[index, 1]]
              }
            }
          }) : state;
        }

      case 'SET_AUTOPLAN':
        return (0, _immutabilityHelper.default)(state, {
          config: {
            autoPlan: {
              $set: action.payload.autoPlan
            }
          }
        });

      case 'SET_MAP_CENTER':
        return (0, _immutabilityHelper.default)(state, {
          config: {
            map: {
              initLat: {
                $set: action.payload.lat
              },
              initLon: {
                $set: action.payload.lon
              }
            }
          }
        });

      case 'SET_MAP_ZOOM':
        return (0, _immutabilityHelper.default)(state, {
          config: {
            map: {
              initZoom: {
                $set: action.payload.zoom
              }
            }
          }
        });

      case 'SET_ROUTER_ID':
        const routerId = action.payload; // Store original path value in originalPath variable.

        const originalPath = config.api.originalPath || config.api.path || '/otp/routers/default';
        const path = routerId ? `/otp/routers/${routerId}` // If routerId is null, revert to the original config's API path (or
        // the standard path if that is not found).
        : originalPath; // Store routerId in session storage (persists through page reloads but
        // not when a new tab/window is opened).

        if (routerId) window.sessionStorage.setItem('routerId', routerId);else window.sessionStorage.removeItem('routerId');
        return (0, _immutabilityHelper.default)(state, {
          config: {
            api: {
              path: {
                $set: path
              },
              originalPath: {
                $set: originalPath
              }
            }
          }
        });

      case 'SET_LEG_DIAGRAM':
        return (0, _immutabilityHelper.default)(state, {
          ui: {
            diagramLeg: {
              $set: action.payload
            }
          }
        });

      case 'SET_ELEVATION_POINT':
        return (0, _immutabilityHelper.default)(state, {
          ui: {
            elevationPoint: {
              $set: action.payload
            }
          }
        });

      case 'SET_MAP_POPUP_LOCATION':
        return (0, _immutabilityHelper.default)(state, {
          ui: {
            mapPopupLocation: {
              $set: action.payload.location
            }
          }
        });

      case 'POSITION_FETCHING':
        return (0, _immutabilityHelper.default)(state, {
          location: {
            currentPosition: {
              $merge: {
                fetching: action.payload.type
              }
            }
          }
        });

      case 'POSITION_ERROR':
        return (0, _immutabilityHelper.default)(state, {
          location: {
            currentPosition: {
              $set: action.payload
            }
          }
        });

      case 'POSITION_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          location: {
            currentPosition: {
              $set: action.payload.position
            }
          }
        });

      case 'ADD_LOCATION_SEARCH':
        return (0, _immutabilityHelper.default)(state, {
          location: {
            sessionSearches: {
              $unshift: [action.payload.location]
            }
          }
        });

      case 'NEARBY_STOPS_RESPONSE':
        const stopLookup = {};
        action.payload.stops.forEach(s => {
          stopLookup[s.id] = s;
        });
        return (0, _immutabilityHelper.default)(state, {
          location: {
            nearbyStops: {
              $set: action.payload.stops.map(s => s.id)
            }
          },
          transitIndex: {
            stops: {
              $merge: stopLookup
            }
          }
        });

      case 'STOPS_WITHIN_BBOX_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            transit: {
              stops: {
                $set: action.payload.stops
              },
              pending: {
                $set: false
              }
            }
          }
        });

      case 'CLEAR_STOPS_OVERLAY':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            transit: {
              stops: {
                $set: []
              },
              pending: {
                $set: false
              }
            }
          }
        });

      case 'ROUTES_AT_STOP_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            stops: {
              [action.payload.stopId]: {
                routes: {
                  $set: action.payload.routes
                }
              }
            }
          }
        });

      case 'SET_MOBILE_SCREEN':
        return (0, _immutabilityHelper.default)(state, {
          ui: {
            mobileScreen: {
              $set: action.payload
            }
          }
        });

      case 'SET_MAIN_PANEL_CONTENT':
        return (0, _immutabilityHelper.default)(state, {
          ui: {
            mainPanelContent: {
              $set: action.payload
            }
          }
        });

      case 'SET_VIEWED_STOP':
        if (action.payload) {
          // If setting to a stop (not null), also set main panel.
          return (0, _immutabilityHelper.default)(state, {
            ui: {
              mainPanelContent: {
                $set: _ui.MainPanelContent.STOP_VIEWER
              },
              viewedStop: {
                $set: action.payload
              }
            }
          });
        } else {
          // Otherwise, just replace viewed stop with null
          return (0, _immutabilityHelper.default)(state, {
            ui: {
              viewedStop: {
                $set: action.payload
              }
            }
          });
        }

      case 'CLEAR_VIEWED_STOP':
        return (0, _immutabilityHelper.default)(state, {
          ui: {
            viewedStop: {
              $set: null
            }
          }
        });

      case 'SET_VIEWED_TRIP':
        return (0, _immutabilityHelper.default)(state, {
          ui: {
            viewedTrip: {
              $set: action.payload
            }
          }
        });

      case 'CLEAR_VIEWED_TRIP':
        return (0, _immutabilityHelper.default)(state, {
          ui: {
            viewedTrip: {
              $set: null
            }
          }
        });

      case 'SET_VIEWED_ROUTE':
        if (action.payload) {
          // If setting to a route (not null), also set main panel.
          return (0, _immutabilityHelper.default)(state, {
            ui: {
              mainPanelContent: {
                $set: _ui.MainPanelContent.ROUTE_VIEWER
              },
              viewedRoute: {
                $set: action.payload
              }
            }
          });
        } else {
          // Otherwise, just replace viewed route with null
          return (0, _immutabilityHelper.default)(state, {
            ui: {
              viewedRoute: {
                $set: action.payload
              }
            }
          });
        }

      case 'FIND_STOP_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            stops: {
              [action.payload.id]: {
                $set: action.payload
              }
            }
          }
        });

      case 'FIND_TRIP_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            trips: {
              [action.payload.id]: {
                $set: action.payload
              }
            }
          }
        });

      case 'FIND_STOPS_FOR_TRIP_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            trips: {
              [action.payload.tripId]: {
                stops: {
                  $set: action.payload.stops
                }
              }
            }
          }
        });

      case 'FIND_STOP_TIMES_FOR_TRIP_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            trips: {
              [action.payload.tripId]: {
                stopTimes: {
                  $set: action.payload.stopTimes
                }
              }
            }
          }
        });

      case 'FIND_GEOMETRY_FOR_TRIP_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            trips: {
              [action.payload.tripId]: {
                geometry: {
                  $set: action.payload.geometry
                }
              }
            }
          }
        });

      case 'FIND_STOP_TIMES_FOR_STOP_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            stops: {
              [action.payload.stopId]: {
                stopTimes: {
                  $set: action.payload.stopTimes
                },
                stopTimesLastUpdated: {
                  $set: new Date().getTime()
                }
              }
            }
          }
        });

      case 'TOGGLE_AUTO_REFRESH':
        storeItem('autoRefreshStopTimes', action.payload);
        return (0, _immutabilityHelper.default)(state, {
          user: {
            autoRefreshStopTimes: {
              $set: action.payload
            }
          }
        });

      case 'FIND_ROUTES_RESPONSE':
        // If routes is undefined, initialize it w/ the full payload
        if (!state.transitIndex.routes) {
          return (0, _immutabilityHelper.default)(state, {
            transitIndex: {
              routes: {
                $set: action.payload
              }
            }
          });
        } // Otherwise, merge in only the routes not already defined


        const currentRouteIds = Object.keys(state.transitIndex.routes);
        const newRoutes = Object.keys(action.payload).filter(key => !currentRouteIds.includes(key)).reduce((res, key) => Object.assign(res, {
          [key]: action.payload[key]
        }), {});
        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            routes: {
              $merge: newRoutes
            }
          }
        });

      case 'FIND_ROUTE_RESPONSE':
        // If routes is undefined, initialize it w/ this route only
        if (!state.transitIndex.routes) {
          return (0, _immutabilityHelper.default)(state, {
            transitIndex: {
              routes: {
                $set: {
                  [action.payload.id]: action.payload
                }
              }
            }
          });
        } // Otherwise, overwrite only this route


        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            routes: {
              [action.payload.id]: {
                $set: action.payload
              }
            }
          }
        });

      case 'FIND_PATTERNS_FOR_ROUTE_RESPONSE':
        const {
          patterns,
          routeId
        } = action.payload; // If routes is undefined, initialize it w/ this route only

        if (!state.transitIndex.routes) {
          return (0, _immutabilityHelper.default)(state, {
            transitIndex: {
              routes: {
                $set: {
                  [routeId]: {
                    patterns
                  }
                }
              }
            }
          });
        } // Otherwise, overwrite only this route


        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            routes: {
              [routeId]: {
                patterns: {
                  $set: patterns
                }
              }
            }
          }
        });

      case 'FIND_GEOMETRY_FOR_PATTERN_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          transitIndex: {
            routes: {
              [action.payload.routeId]: {
                patterns: {
                  [action.payload.patternId]: {
                    geometry: {
                      $set: action.payload.geometry
                    }
                  }
                }
              }
            }
          }
        });

      case 'TNC_ETA_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          tnc: {
            etaEstimates: {
              [action.payload.from]: fromData => {
                fromData = Object.assign({}, fromData);
                const estimates = action.payload.estimates || [];
                estimates.forEach(estimate => {
                  if (!fromData[estimate.company]) {
                    fromData[estimate.company] = {};
                  }

                  fromData[estimate.company][estimate.productId] = Object.assign({
                    estimateTimestamp: new Date()
                  }, estimate);
                });
                return fromData;
              }
            }
          }
        });

      case 'TNC_RIDE_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          tnc: {
            rideEstimates: {
              [action.payload.from]: fromData => {
                fromData = Object.assign({}, fromData);
                const {
                  company,
                  rideEstimate,
                  to
                } = action.payload;

                if (!rideEstimate) {
                  return fromData;
                }

                if (!fromData[to]) {
                  fromData[to] = {};
                }

                if (!fromData[to][company]) {
                  fromData[to][company] = {};
                }

                fromData[to][company][rideEstimate.rideType] = Object.assign({
                  estimateTimestamp: new Date()
                }, rideEstimate);
                return fromData;
              }
            }
          }
        });

      case 'PARK_AND_RIDE_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            parkAndRide: {
              locations: {
                $set: action.payload
              },
              pending: {
                $set: false
              }
            }
          }
        });
      // TODO: can this be broken out into a separate module?

      case 'ZIPCAR_LOCATIONS_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            zipcar: {
              locations: {
                $set: action.payload.locations
              },
              pending: {
                $set: false
              }
            }
          }
        });

      case 'PARKING_LOCATIONS_RESPONSE':
        return (0, _immutabilityHelper.default)(state, {
          overlay: {
            parking: {
              locations: {
                $set: action.payload.data.stations
              },
              pending: {
                $set: false
              }
            }
          }
        });

      case 'UPDATE_OVERLAY_VISIBILITY':
        const mapOverlays = (0, _clone.default)(state.config.map.overlays);

        for (let key in action.payload) {
          const overlay = mapOverlays.find(o => o.name === key);
          overlay.visible = action.payload[key];
        }

        return (0, _immutabilityHelper.default)(state, {
          config: {
            map: {
              overlays: {
                $set: mapOverlays
              }
            }
          }
        });

      default:
        return state;

      case 'UPDATE_ITINERARY_FILTER':
        return (0, _immutabilityHelper.default)(state, {
          filter: {
            $set: action.payload
          }
        });
    }
  };
}

var _default = createOtpReducer;
exports.default = _default;

//# sourceMappingURL=create-otp-reducer.js