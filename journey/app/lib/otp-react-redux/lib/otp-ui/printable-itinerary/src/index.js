import {
  configType,
  itineraryType,
  timeOptionsType
} from "../../core-utils/src/types";
import PropTypes from "prop-types";
import React from "react";

import AccessLeg from "./access-leg";
import * as Styled from "./styled";
import TNCLeg from "./tnc-leg";
import TransitLeg from "./transit-leg";

export default function PrintableItinerary({
  className,
  config,
  itinerary,
  LegIcon,
  timeOptions
}) {
  return (
    <Styled.PrintableItinerary className={className}>
      {itinerary.legs.length > 0 && (
        <Styled.CollapsedTop>
          <Styled.LegBody>
            <Styled.LegHeader>
              <b>Depart</b> from <b>{itinerary.legs[0].from.name}</b>
            </Styled.LegHeader>
          </Styled.LegBody>
        </Styled.CollapsedTop>
      )}
      {itinerary.legs.map((leg, k) =>
        leg.transitLeg ? (
          <TransitLeg
            interlineFollows={
              k < itinerary.legs.length - 1 &&
              itinerary.legs[k + 1].interlineWithPreviousLeg
            }
            key={k}
            leg={leg}
            LegIcon={LegIcon}
            timeOptions={timeOptions}
          />
        ) : leg.hailedCar ? (
          <TNCLeg
            leg={leg}
            LegIcon={LegIcon}
            key={k}
            timeOptions={timeOptions}
          />
        ) : (
          <AccessLeg
            config={config}
            key={k}
            leg={leg}
            LegIcon={LegIcon}
            timeOptions={timeOptions}
          />
        )
      )}
    </Styled.PrintableItinerary>
  );
}

PrintableItinerary.propTypes = {
  /** Used for additional styling with styled components for example. */
  className: PropTypes.string,
  /** Contains OTP configuration details. */
  config: configType.isRequired,
  /** Itinerary that the user has selected to view, contains multiple legs */
  itinerary: itineraryType.isRequired,
  /** A component class that is used to render icons for legs of an itinerary */
  LegIcon: PropTypes.elementType.isRequired,
  /** Contains the preferred format string for time display and a timezone offset */
  timeOptions: timeOptionsType
};

PrintableItinerary.defaultProps = {
  className: null,
  timeOptions: null
};
