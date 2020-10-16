import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import styled from "styled-components";

import TripDetails from ".";
import * as TripDetailsClasses from "./styled";

// import mock itinaries. These are all trip plan outputs from OTP.
const bikeOnlyItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-only.json");
const bikeRentalItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-rental.json");
const bikeRentalTransitBikeRentalItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-rental-transit-bike-rental.json");
const bikeTransitBikeItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/bike-transit-bike.json");
const eScooterRentalItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/e-scooter-rental.json");
const eScooterRentalTransiteScooterRentalItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/e-scooter-transit-e-scooter.json");
const parkAndRideItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/park-and-ride.json");
const tncTransitTncItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/tnc-transit-tnc.json");
const walkInterlinedTransitItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-interlined-transit-walk.json");
const walkOnlyItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-only.json");
const walkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk.json");
const walkTransitWalkTransitWalkItinerary = require("@opentripplanner/itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json");

const StyledTripDetails = styled(TripDetails)`
  ${TripDetailsClasses.TripDetailsHeader} {
    background-color: pink;
  }
`;

const customMessages = {
  title: "Details about this Trip",
  transitFare: "Transit Fare",
  transitFareDescription:
    "Note: actual fare may be lower if you have a transit pass or something like that."
};
const longDateFormat = "MMMM D, YYYY";

storiesOf("TripDetails", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("TripDetails with walk-only itinerary", () => (
    <TripDetails
      itinerary={walkOnlyItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with bike-only itinerary", () => (
    <TripDetails
      itinerary={bikeOnlyItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with walk-transit-walk itinerary", () => (
    <TripDetails
      itinerary={walkTransitWalkItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add(
    "TripDetails with walk-transit-walk itinerary and custom messages",
    () => (
      <TripDetails
        itinerary={walkTransitWalkItinerary}
        longDateFormat={longDateFormat}
        messages={customMessages}
      />
    )
  )
  .add("Styled TripDetails with walk-transit-walk itinerary", () => (
    <StyledTripDetails
      itinerary={walkTransitWalkItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with bike-transit-bike itinerary", () => (
    <TripDetails
      itinerary={bikeTransitBikeItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with walk-interlined-transit itinerary", () => (
    <TripDetails
      itinerary={walkInterlinedTransitItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with walk-transit-transfer itinerary", () => (
    <TripDetails
      itinerary={walkTransitWalkTransitWalkItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with bike-rental itinerary", () => (
    <TripDetails
      itinerary={bikeRentalItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with E-scooter-rental itinerary", () => (
    <TripDetails
      itinerary={eScooterRentalItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with park and ride itinerary", () => (
    <TripDetails
      itinerary={parkAndRideItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with bike rental + transit itinerary", () => (
    <TripDetails
      itinerary={bikeRentalTransitBikeRentalItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with E-scooter rental + transit itinerary", () => (
    <TripDetails
      itinerary={eScooterRentalTransiteScooterRentalItinerary}
      longDateFormat={longDateFormat}
    />
  ))
  .add("TripDetails with TNC + transit itinerary", () => (
    <TripDetails
      itinerary={tncTransitTncItinerary}
      longDateFormat={longDateFormat}
    />
  ));
