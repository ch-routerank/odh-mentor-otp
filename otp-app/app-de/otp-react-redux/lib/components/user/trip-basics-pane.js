import React, { Component } from 'react'
import {
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  ToggleButton,
  ToggleButtonGroup
} from 'react-bootstrap'

import { arrayToDayFields, dayFieldsToArray } from '../../util/monitored-trip'
import TripSummary from './trip-summary'

/**
 * This component shows summary information for a trip
 * and lets the user edit the trip name and day.
 */
class TripBasicsPane extends Component {
  _handleTripDaysChange = e => {
    const { onMonitoredTripChange } = this.props
    onMonitoredTripChange(arrayToDayFields(e))
  }

  _handleTripNameChange = e => {
    const { onMonitoredTripChange } = this.props
    onMonitoredTripChange({ tripName: e.target.value })
  }

  render () {
    const { monitoredTrip } = this.props
    const { itinerary } = monitoredTrip

    if (!itinerary) {
      return <div>No itinerary to display.</div>
    } else {
      return (
        <div>
          <ControlLabel>Selected itinerary:</ControlLabel>
          <TripSummary monitoredTrip={monitoredTrip} />

          <FormGroup>
            <ControlLabel>Please provide a name for this trip:</ControlLabel>
            <FormControl
              onChange={this._handleTripNameChange}
              type='text'
              value={monitoredTrip.tripName}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>What days to you take this trip?</ControlLabel>
            <ButtonToolbar>
              <ToggleButtonGroup
                onChange={this._handleTripDaysChange}
                type='checkbox'
                value={dayFieldsToArray(monitoredTrip)}
              >
                <ToggleButton value={'monday'}>Monday</ToggleButton>
                <ToggleButton value={'tuesday'}>Tuesday</ToggleButton>
                <ToggleButton value={'wednesday'}>Wednesday</ToggleButton>
                <ToggleButton value={'thursday'}>Thursday</ToggleButton>
                <ToggleButton value={'friday'}>Friday</ToggleButton>
                <ToggleButton value={'saturday'}>Saturday</ToggleButton>
                <ToggleButton value={'sunday'}>Sunday</ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>
          </FormGroup>

        </div>
      )
    }
  }
}

export default TripBasicsPane
