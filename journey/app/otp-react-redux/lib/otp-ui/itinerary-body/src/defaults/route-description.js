import { legType } from "@opentripplanner/core-utils/lib/types";
import React from "react";

import * as Styled from "../styled";

export default function RouteDescription({ leg }) {
  const { headsign, routeLongName, routeShortName } = leg;
  return (
    <Styled.LegDescriptionForTransit>
      {routeShortName && (
        <div>
          <Styled.LegDescriptionRouteShortName>
            {routeShortName}
          </Styled.LegDescriptionRouteShortName>
        </div>
      )}
      <Styled.LegDescriptionRouteLongName>
        {routeLongName}
        {headsign && (
          <span>
            <Styled.LegDescriptionHeadsignPrefix>
              {" $_to_$ "}
            </Styled.LegDescriptionHeadsignPrefix>
            {headsign}
          </span>
        )}
      </Styled.LegDescriptionRouteLongName>
    </Styled.LegDescriptionForTransit>
  );
}

RouteDescription.propTypes = {
  leg: legType.isRequired
};
