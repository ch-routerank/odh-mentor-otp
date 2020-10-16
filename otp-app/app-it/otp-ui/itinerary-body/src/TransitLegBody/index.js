import { getTransitFare } from "@opentripplanner/core-utils/lib/itinerary";
import { formatDuration } from "@opentripplanner/core-utils/lib/time";
import {
  configType,
  fareType,
  legType,
  transitOperatorType
} from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { ExclamationTriangle } from "styled-icons/fa-solid";
import { VelocityTransitionGroup } from "velocity-react";

import AlertsBody from "./alerts-body";
import IntermediateStops from "./intermediate-stops";
import * as Styled from "../styled";
import ViewTripButton from "./view-trip-button";

// TODO use pluralize that for internationalization (and complex plurals, i.e., not just adding 's')
function pluralize(str, list) {
  return `${str}${list.length > 1 ? "s" : ""}`;
}

export default class TransitLegBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertsExpanded: false,
      stopsExpanded: false
    };
  }

  getFareForLeg = (leg, fare) => {
    let fareForLeg;
    if (fare && fare.details && fare.details.regular) {
      fare.details.regular.forEach(fareComponent => {
        if (fareComponent.routes.includes(leg.routeId)) {
          fareForLeg = getTransitFare(fareComponent.price);
        }
      });
    }
    return fareForLeg;
  };

  onToggleStopsClick = () => {
    const { stopsExpanded } = this.state;
    this.setState({ stopsExpanded: !stopsExpanded });
  };

  onToggleAlertsClick = () => {
    const { alertsExpanded } = this.state;
    this.setState({ alertsExpanded: !alertsExpanded });
  };

  onSummaryClick = () => {
    const { leg, legIndex, setActiveLeg } = this.props;
    setActiveLeg(legIndex, leg);
  };

  render() {
    const {
      config,
      fare,
      leg,
      LegIcon,
      longDateFormat,
      RouteDescription,
      setViewedTrip,
      showAgencyInfo,
      showViewTripButton,
      timeFormat,
      TransitLegSubheader,
      TransitLegSummary,
      transitOperator
    } = this.props;
    const { language: languageConfig } = config;
    const { agencyBrandingUrl, agencyName, agencyUrl, alerts } = leg;
    const { alertsExpanded, stopsExpanded } = this.state;

    // If the config contains an operator with a logo URL, prefer that over the
    // one provided by OTP (which is derived from agency.txt#agency_branding_url)
    const logoUrl =
      transitOperator && transitOperator.logo
        ? transitOperator.logo
        : agencyBrandingUrl;

    const expandAlerts =
      alertsExpanded || (leg.alerts && leg.alerts.length < 3);
    const fareForLeg = this.getFareForLeg(leg, fare);
    return (
      <>
        {TransitLegSubheader && (
          <TransitLegSubheader languageConfig={languageConfig} leg={leg} />
        )}
        <Styled.LegBody>
          {/* The Route Icon/Name Bar; clickable to set as active leg */}
          <Styled.LegClickable onClick={this.onSummaryClick}>
            <RouteDescription
              leg={leg}
              LegIcon={LegIcon}
              transitOperator={transitOperator}
            />
          </Styled.LegClickable>

          {/* Agency information */}
          {showAgencyInfo && (
            <Styled.AgencyInfo>
              Servizio svolto da{" "}
              <a href={agencyUrl} rel="noopener noreferrer" target="_blank">
                {agencyName}
                {logoUrl && (
                  <img alt={`${agencyName} logo`} src={logoUrl} height={25} />
                )}
              </a>
            </Styled.AgencyInfo>
          )}

          {/* Alerts toggle */}
          {alerts && alerts.length > 2 && (
            <Styled.TransitAlertToggle onClick={this.onToggleAlertsClick}>
              <ExclamationTriangle size={15} /> {alerts.length}{" "}
              {pluralize("alert", alerts)}{" "}
              <Styled.CaretToggle expanded={alertsExpanded} />
            </Styled.TransitAlertToggle>
          )}

          {/* The Alerts body, if visible */}
          <VelocityTransitionGroup
            enter={{ animation: "slideDown" }}
            leave={{ animation: "slideUp" }}
          >
            {expandAlerts && (
              <AlertsBody
                alerts={leg.alerts}
                longDateFormat={longDateFormat}
                timeFormat={timeFormat}
              />
            )}
          </VelocityTransitionGroup>
          {/* The "Ride X Min / X Stops" Row, including IntermediateStops body */}
          {leg.intermediateStops && leg.intermediateStops.length > 0 && (
            <Styled.TransitLegDetails>
              {/* The header summary row, clickable to expand intermediate stops */}
              <Styled.TransitLegDetailsHeader>
                <TransitLegSummary
                  leg={leg}
                  onClick={this.onToggleStopsClick}
                  stopsExpanded={stopsExpanded}
                />

                {showViewTripButton && (
                  <ViewTripButton
                    tripId={leg.tripId}
                    fromIndex={leg.from.stopIndex}
                    setViewedTrip={setViewedTrip}
                    toIndex={leg.to.stopIndex}
                  />
                )}
              </Styled.TransitLegDetailsHeader>
              {/* IntermediateStops expanded body */}
              <VelocityTransitionGroup
                enter={{ animation: "slideDown" }}
                leave={{ animation: "slideUp" }}
              >
                {stopsExpanded ? (
                  <Styled.TransitLegExpandedBody>
                    <IntermediateStops stops={leg.intermediateStops} />
                    {fareForLeg && (
                      <Styled.TransitLegFare>
                        Fare: {fareForLeg.centsToString(fareForLeg.transitFare)}
                      </Styled.TransitLegFare>
                    )}
                  </Styled.TransitLegExpandedBody>
                ) : null}
              </VelocityTransitionGroup>

              {/* Average wait details, if present */}
              {leg.averageWait && (
                <span>Typical Wait: {formatDuration(leg.averageWait)}</span>
              )}
            </Styled.TransitLegDetails>
          )}
        </Styled.LegBody>
      </>
    );
  }
}

TransitLegBody.propTypes = {
  config: configType.isRequired,
  fare: fareType,
  leg: legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired,
  legIndex: PropTypes.number.isRequired,
  longDateFormat: PropTypes.string.isRequired,
  RouteDescription: PropTypes.elementType.isRequired,
  setActiveLeg: PropTypes.func.isRequired,
  setViewedTrip: PropTypes.func.isRequired,
  showAgencyInfo: PropTypes.bool.isRequired,
  showViewTripButton: PropTypes.bool.isRequired,
  timeFormat: PropTypes.string.isRequired,
  TransitLegSubheader: PropTypes.elementType,
  TransitLegSummary: PropTypes.elementType.isRequired,
  transitOperator: transitOperatorType
};

TransitLegBody.defaultProps = {
  fare: null,
  TransitLegSubheader: undefined,
  transitOperator: null
};
