import ClassicLegIcon from "../../icons/src/classic-leg-icon";
import TriMetLegIcon from "../../icons/src/trimet-leg-icon";
import React from "react";
import { storiesOf } from "@storybook/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import styled from "styled-components";

import PrintableItinerary from ".";
import * as PrintableItineraryClasses from "./styled";

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
const walkTransitWalkTransitWalkItinerary = require("../../itinerary-body/src/__mocks__/itineraries/walk-transit-walk-transit-walk.json");
const config = require("../../itinerary-body/src/__mocks__/config.json");

const StyledPrintableItinerary = styled(PrintableItinerary)`
  ${PrintableItineraryClasses.LegBody} {
    background-color: pink;
  }
`;

storiesOf("PrintableItinerary", module)
  .addDecorator(withA11y)
  .addDecorator(withInfo)
  .add("ItineraryBody with walk-only itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={walkOnlyItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with bike-only itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={bikeOnlyItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with walk-transit-walk itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={walkTransitWalkItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("Styled ItineraryBody with walk-transit-walk itinerary", () => (
    <StyledPrintableItinerary
      config={config}
      itinerary={walkTransitWalkItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with bike-transit-bike itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={bikeTransitBikeItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with walk-interlined-transit itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={walkInterlinedTransitItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with walk-transit-transfer itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={walkTransitWalkTransitWalkItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with bike-rental itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={bikeRentalItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with E-scooter-rental itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={eScooterRentalItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with park and ride itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={parkAndRideItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with bike rental + transit itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={bikeRentalTransitBikeRentalItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with E-scooter rental + transit itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={eScooterRentalTransiteScooterRentalItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with TNC + transit itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={tncTransitTncItinerary}
      LegIcon={TriMetLegIcon}
    />
  ))
  .add("ItineraryBody with classic icons and park and ride itinerary", () => (
    <PrintableItinerary
      config={config}
      itinerary={parkAndRideItinerary}
      LegIcon={ClassicLegIcon}
    />
  ));
