import moment from 'moment'
import coreUtils from '@opentripplanner/core-utils'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'

const {
  OTP_API_DATE_FORMAT,
  OTP_API_TIME_FORMAT,
  getTimeFormat,
  getDateFormat
} = coreUtils.time

class DateTimePreview extends Component {
  static propTypes = {
    caret: PropTypes.string,
    compressed: PropTypes.bool,
    date: PropTypes.string,
    departArrive: PropTypes.string,
    editButtonText: PropTypes.element,
    time: PropTypes.string,
    onClick: PropTypes.func,
    routingType: PropTypes.string
  }

  static defaultProps = {
    editButtonText: <i className='fa fa-pencil' />
  }

  render () {
    const {
      caret,
      date,
      editButtonText,
      time,
      departArrive,
      routingType,
      startTime,
      endTime,
      timeFormat,
      dateFormat
    } = this.props

    let timeStr
    moment.locale("de")
    const formattedTime = moment.utc(time, OTP_API_TIME_FORMAT).format(timeFormat)
    if (routingType === 'ITINERARY') {
      if (departArrive === 'NOW') timeStr = '$_now_$'
      else if (departArrive === 'ARRIVE') timeStr = '$_arrive_$ ' + formattedTime
      else if (departArrive === 'DEPART') timeStr = '$_departure_$ ' + formattedTime
    } else if (routingType === 'PROFILE') {
      timeStr = startTime + ' a ' + endTime
    }

    const summary = (
      <div className='summary'>
        <i className='fa fa-calendar' /> {
          moment(date, OTP_API_DATE_FORMAT)
            .calendar(null, { sameElse: dateFormat })
            .split(' a')[0]}
        <br />
        <i className='fa fa-clock-o' /> {timeStr}
      </div>
    )

    const button = (
      <div className='button-container'>
        <Button
          aria-label='Edit departure or arrival time'
          onClick={this.props.onClick}
        >
          {editButtonText}{caret && <span> <i className={`fa fa-caret-${caret}`} /></span>}
        </Button>
      </div>
    )

    return (
      <div className='settings-preview' onClick={this.props.onClick}>
        {summary}
        {button}
        <div style={{ clear: 'both' }} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { departArrive, date, time, routingType, startTime, endTime } = state.otp.currentQuery
  const config = state.otp.config
  return {
    config,
    routingType,
    departArrive,
    date,
    time,
    startTime,
    endTime,
    timeFormat: getTimeFormat(config),
    dateFormat: getDateFormat(config)
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(DateTimePreview)
