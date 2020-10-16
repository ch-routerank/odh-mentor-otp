import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'

import DateTimePreview from '../form/date-time-preview'
import DefaultMap from '../map/default-map'
import LocationField from '../form/connected-location-field'
import PlanTripButton from '../form/plan-trip-button'
import SettingsPreview from '../form/settings-preview'
import SwitchButton from '../form/switch-button'

import MobileContainer from './container'
import MobileNavigationBar from './navigation-bar'

import { MobileScreens, setMobileScreen } from '../../actions/ui'

class MobileSearchScreen extends Component {
  static propTypes = {
    map: PropTypes.element,
    setMobileScreen: PropTypes.func
  }

  _fromFieldClicked = () => {
    this.props.setMobileScreen(MobileScreens.SET_FROM_LOCATION)
  }

  _toFieldClicked = () => {
    this.props.setMobileScreen(MobileScreens.SET_TO_LOCATION)
  }

  _expandDateTimeClicked = () => {
    this.props.setMobileScreen(MobileScreens.SET_DATETIME)
  }

  _expandOptionsClicked = () => {
    this.props.setMobileScreen(MobileScreens.SET_OPTIONS)
  }

  _planTripClicked = () => {
    this.props.setMobileScreen(MobileScreens.RESULTS_SUMMARY)
  }

  render () {
    return (
      <MobileContainer>
        <MobileNavigationBar headerText='Pianifica viaggio' />
        <div className='search-settings mobile-padding'>
          <LocationField
            locationType='from'
            onTextInputClick={this._fromFieldClicked}
            showClearButton={false}
          />
          <LocationField
            locationType='to'
            onTextInputClick={this._toFieldClicked}
            showClearButton={false}
          />

          <div className='switch-button-container-mobile'>
            <SwitchButton content={<i className='fa fa-exchange fa-rotate-90' />} />
          </div>

          <Row style={{ marginBottom: 12 }}>
            <Col xs={6} style={{ borderRight: '2px solid #ccc' }}>
              <DateTimePreview
                onClick={this._expandDateTimeClicked}
                compressed
              />
            </Col>
            <Col xs={6}>
              <SettingsPreview
                onClick={this._expandOptionsClicked}
                compressed
              />
            </Col>
          </Row>

          <PlanTripButton onClick={this._planTripClicked} />
        </div>
        <div className='search-map'>
          <DefaultMap />
        </div>
      </MobileContainer>
    )
  }
}

// connect to the redux store

const mapStateToProps = (state, ownProps) => {
  return { }
}

const mapDispatchToProps = {
  setMobileScreen
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileSearchScreen)
