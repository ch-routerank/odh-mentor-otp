import BaseMap from "../../base-map/src";
import { itineraryToTransitive } from "../../core-utils/src/map";
import EndpointsOverlay from "../../endpoints-overlay";
import React from "react";
import { action } from "@storybook/addon-actions";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { storiesOf } from "@storybook/react";

import TransitiveOverlay from ".";

import "../../../node_modules/leaflet/dist/leaflet.css";

// import mock itinaries. These are all trip plan outputs from OTP.
const bikeOnlyItinerary = require("../../itinerary-body/src/__mocks__/itineraries/bike-only.json");
const bikeRentalItinerary = require("../../itinerary-body/src/__mocks__/itineraries/bike-rental.json");
const bikeRentalTransitBikeRentalItinerary = require("../../itinerary-body/src/__mocks__/itineraries/bike-rental-transit-bike-rental.json");
const bikeTransitBikeItinerary = require("../../itinerary-body/src/__mocks__/itineraries/bike-transit-bike.json");
const eScooterRentalItinerary = require("../../itinerary-body/src/__mocks__/itineraries/e-scooter-rental.json");
const eScooterRentalTransiteScooterRentalItinerary = require("../../itinerary-body/src/__mocks__/itineraries/e-scooter-transit-e-scooter.json");
const parkAndRideItinerary = require("../../itinerary-body/src/__mocks__/itineraries/park-and-ride.json");
const tncTransitTncItinerary = require("../../itinerary-body/src/__mocks__/itineraries/tnc-transit-tnc.json");
const walkInterlinedTransitItinerary = require("../../itinerary-body/src/__mocks__/itineraries/walk-interlined-transit-walk.json");
const walkOnlyItinerary = require("../../itinerary-body/src/__mocks__/itineraries/walk-only.json");
const walkTransitWalkItinerary = require("../../itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json");
const walkTransitWalkItineraryNoIntermediateStops = require("../../itinerary-body/src/__mocks__/itineraries/walk-transit-walk-no-intermediate-stops.json");
const walkTransitWalkTransitWalkItinerary = require("../../itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json");

const companies = [
  {
    id: "RAZOR",
    label: "Razor",
    modes: "MICROMOBILITY_RENT"
  },
  {
    id: "SHARED",
    label: "Shared",
    modes: "MICROMOBILITY_RENT"
  }
];

const setLocation = action("setLocation");

function getFromLocation(itinerary) {
  return itinerary.legs[0].from;
}

function getToLocation(itinerary) {
  return itinerary.legs[itinerary.legs.length - 1].to;
}

storiesOf("TransitiveOverlay", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("TransitiveOverlay with walking itinerary", () => (
    <BaseMap center={[45.518841, -122.679302]} zoom={19}>
      <EndpointsOverlay
        fromLocation={getFromLocation(walkOnlyItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(walkOnlyItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(walkOnlyItinerary, companies)}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with bike-only itinerary", () => (
    <BaseMap center={[45.520441, -122.68302]} zoom={16}>
      <EndpointsOverlay
        fromLocation={getFromLocation(bikeOnlyItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(bikeOnlyItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(bikeOnlyItinerary, companies)}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with walk-transit-walk itinerary", () => (
    <BaseMap center={[45.520441, -122.68302]} zoom={16}>
      <EndpointsOverlay
        fromLocation={getFromLocation(walkTransitWalkItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(walkTransitWalkItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          walkTransitWalkItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add(
    "TransitiveOverlay with walk-transit-walk itinerary with no intermediate stops",
    () => (
      <BaseMap center={[45.525841, -122.649302]} zoom={13}>
        <EndpointsOverlay
          fromLocation={getFromLocation(
            walkTransitWalkItineraryNoIntermediateStops
          )}
          setLocation={setLocation}
          toLocation={getToLocation(
            walkTransitWalkItineraryNoIntermediateStops
          )}
          visible
        />
        <TransitiveOverlay
          transitiveData={itineraryToTransitive(
            walkTransitWalkItineraryNoIntermediateStops,
            companies
          )}
          visible
        />
      </BaseMap>
    )
  )
  .add("TransitiveOverlay with bike-transit-bike itinerary", () => (
    <BaseMap center={[45.520441, -122.68302]} zoom={16}>
      <EndpointsOverlay
        fromLocation={getFromLocation(bikeTransitBikeItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(bikeTransitBikeItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          bikeTransitBikeItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with walk-interlined-transit itinerary", () => (
    <BaseMap center={[45.511841, -122.679302]} zoom={14}>
      <EndpointsOverlay
        fromLocation={getFromLocation(walkInterlinedTransitItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(walkInterlinedTransitItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          walkInterlinedTransitItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with walk-transit-transfer itinerary", () => (
    <BaseMap center={[45.505841, -122.631302]} zoom={14}>
      <EndpointsOverlay
        fromLocation={getFromLocation(walkTransitWalkTransitWalkItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(walkTransitWalkTransitWalkItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          walkTransitWalkTransitWalkItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with bike-rental itinerary", () => (
    <BaseMap center={[45.508841, -122.631302]} zoom={14}>
      <EndpointsOverlay
        fromLocation={getFromLocation(bikeRentalItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(bikeRentalItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(bikeRentalItinerary, companies)}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with E-scooter-rental itinerary", () => (
    <BaseMap center={[45.52041, -122.675302]} zoom={16}>
      <EndpointsOverlay
        fromLocation={getFromLocation(eScooterRentalItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(eScooterRentalItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          eScooterRentalItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with park and ride itinerary", () => (
    <BaseMap center={[45.515841, -122.75302]} zoom={13}>
      <EndpointsOverlay
        fromLocation={getFromLocation(parkAndRideItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(parkAndRideItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(parkAndRideItinerary, companies)}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with bike rental + transit itinerary", () => (
    <BaseMap center={[45.538841, -122.6302]} zoom={12}>
      <EndpointsOverlay
        fromLocation={getFromLocation(bikeRentalTransitBikeRentalItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(bikeRentalTransitBikeRentalItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          bikeRentalTransitBikeRentalItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with E-scooter rental + transit itinerary", () => (
    <BaseMap center={[45.538841, -122.6302]} zoom={12}>
      <EndpointsOverlay
        fromLocation={getFromLocation(
          eScooterRentalTransiteScooterRentalItinerary
        )}
        setLocation={setLocation}
        toLocation={getToLocation(eScooterRentalTransiteScooterRentalItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          eScooterRentalTransiteScooterRentalItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ))
  .add("TransitiveOverlay with TNC + transit itinerary", () => (
    <BaseMap center={[45.538841, -122.6302]} zoom={12}>
      <EndpointsOverlay
        fromLocation={getFromLocation(tncTransitTncItinerary)}
        setLocation={setLocation}
        toLocation={getToLocation(tncTransitTncItinerary)}
        visible
      />
      <TransitiveOverlay
        transitiveData={itineraryToTransitive(
          tncTransitTncItinerary,
          companies
        )}
        visible
      />
    </BaseMap>
  ));
