import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Day from './Day'
import Store from '../store';

export default observer(class Calendar extends Component {

  _renderDayNames() {
    return Store.dayNames.map((dayName, index) => (
      <div key={index} className={'bg-secondary text-white text-center'}
        style={{ width: 'calc(100% / 7)', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
        <h6>{dayName}</h6>
      </div>
    ))
  }

  _randomKeyGenerator() {
    return Math.random().toString(36).substring(7);
  }

  _renderDays() {
    if (this.props.monthData) {
      let { startingDay, daysInMonth, eventsInMonth } = this.props.monthData;

      const inactiveDaysBefore = Array.apply(null, Array(startingDay))
        .map(() => (<Day key={this._randomKeyGenerator()} active={false} />))

      const activeDays = Array.apply(null, Array(daysInMonth))
        .map((_, i) => (
          <Day key={this._randomKeyGenerator()} active={true} currentDay={i + 1} eventsInDay={eventsInMonth[i + 1]}></Day>
        ))

      let daysDisplayed = (startingDay + daysInMonth) > 35 ? 42 : 35;

      const inactiveDaysAfter = Array.apply(null, Array(daysDisplayed - (startingDay + daysInMonth)))
        .map(() => (<Day key={this._randomKeyGenerator()} active={false} />))

      return [...inactiveDaysBefore, ...activeDays, ...inactiveDaysAfter]
    } else {
      return []
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {this._renderDayNames()}
        {this._renderDays()}
      </div>
    )
  }
})