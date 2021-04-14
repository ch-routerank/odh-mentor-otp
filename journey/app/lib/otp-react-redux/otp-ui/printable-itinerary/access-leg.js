import {
  getLegModeLabel,
  getPlaceName,
  getStepDirection,
  getStepStreetName
} from "../core-utils/itinerary";
import { configType, legType } from "../core-utils/types";
import { humanizeDistanceString } from "../humanize-distance";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "./styled";

export default function AccessLeg({ config, leg, LegIcon }) {
  return (
    <Styled.Leg>
      <Styled.ModeIcon>
        <LegIcon leg={leg} />
      </Styled.ModeIcon>
      <Styled.LegBody>
        <Styled.LegHeader>
          <b>{getLegModeLabel(leg)}</b>{" "}
          {leg.distance > 0 && (
            <span> {humanizeDistanceString(leg.distance)}</span>
          )}
          {" $_to_$ "}
          <b>{getPlaceName(leg.to, config.companies)}</b>
        </Styled.LegHeader>
        {!leg.hailedCar && (
          <Styled.LegDetails>
            {leg.steps.map((step, k) => {
              return (
                <Styled.LegDetail key={k}>
                  {getStepDirection(step)} on <b>{getStepStreetName(step)}</b>
                </Styled.LegDetail>
              );
            })}
          </Styled.LegDetails>
        )}
      </Styled.LegBody>
    </Styled.Leg>
  );
}

AccessLeg.propTypes = {
  config: configType.isRequired,
  leg: legType.isRequired,
  LegIcon: PropTypes.elementType.isRequired
};
