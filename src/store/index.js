import { observable, computed, action, decorate } from 'mobx';
import { get, set } from 'lodash';
import Event from '../models/Event';
import EventTypes from '../models/EventTypes';
import moment from 'moment';
import mk from 'moment/locale/mk'
moment.updateLocale('mk', mk);


const exampleEvent = new Event(
  new moment().set({
    year: 2019,
    month: 2,
    day: 23,
    hour: 1,
    minutes: 0
  }),
  new moment().set({
    year: 2019,
    month: 2,
    day: 23,
    hour: 2,
    minutes: 0
  }),
  EventTypes.outdoor,
  'Ова е пример Настан'
)

const exampleEvent2 = new Event(
  new moment().set({
    year: 2019,
    month: 2,
    day: 23,
    hour: 2,
    minutes: 0
  }),
  new moment().set({
    year: 2019,
    month: 2,
    day: 23,
    hour: 3,
    minutes: 0
  }),
  EventTypes.social,
  'Ова е пример Настан2'
)

class Store {
  currentDate = moment();
  eventData = {
    '2019': {
      '2': {
        '23': [exampleEvent, exampleEvent2]
      }
    }
  };

  _isEventOverlapping(eventsForDay, newEvent) {
    if (eventsForDay.length === 0) {
      return false;
    }

    //barem edno da vrati true rezultatot e deka ima konflikt
    return eventsForDay.some(eventInDay => {

      //pocnal pred a zavrsil posle start na postoeckiot event
      if (eventInDay.startDate.isAfter(newEvent.startDate) && newEvent.endDate.isAfter(eventInDay.startDate)) {
        return true;
      }
      //pocnal pred a zavrsil posle end na postoeckiot event
      if (eventInDay.endDate.isAfter(newEvent.startDate) && newEvent.endDate.isAfter(eventInDay.endDate)) {
        return true;
      }
      //edniot e vo drugiot
      if (eventInDay.startDate.isAfter(newEvent.startDate) && newEvent.endDate.isAfter(eventInDay.endDate)) {
        return true
      }

      return false;
    })

  }

  _sortEvents(currentDay) {
    let eventsForDay = get(this.eventData, [this.currentDate.year(), this.currentDate.month() + 1, currentDay], []);

    eventsForDay = eventsForDay.slice().sort((a, b) => {
      if (!a.startDate.isAfter(b.startDate)) {
        return -1
      } else {
        return 1
      }
    });

    set(this.eventData, [this.currentDate.year(), this.currentDate.month() + 1, currentDay], eventsForDay);
  }

  addEventOnDay(date, event) {
    return new Promise((resolve, reject) => {
      if (!get(this.eventData, [], null)) {
        if (!event.endDate.isAfter(event.startDate)) {
          reject('Почетното време треба да е помало од крајното.')
          return;
        } else {
          let { years: year, months: month } = this.currentDate.toObject()
          month++;

          if (!this.eventData[year]) {
            this.eventData[year] = {};
          }

          if (!this.eventData[year][month]) {
            this.eventData[year][month] = {}
          }

          if (!this.eventData[year][month][date]) {
            this.eventData[year][month][date] = [];
          }

          event.startDate.seconds(0).milliseconds(0);
          event.endDate.seconds(0).milliseconds(0);

          let eventsForDay = get(this.eventData, [this.currentDate.year(), this.currentDate.month() + 1, date], []);
          let isOverlapping = this._isEventOverlapping(eventsForDay, event);

          if (isOverlapping) {
            reject('Има преклопување на настани.')
          } else {
            this.eventData[year][month][date].push(event.clone())
            this._sortEvents(date);
            resolve('Додавањето беше успешно.')
          }
        }
      }
    })

  }

  removeEvent(currentDay, event) {
    let eventsForDay = get(this.eventData, [this.currentDate.year(), this.currentDate.month() + 1, currentDay], []);

    eventsForDay = eventsForDay.filter(e => e !== event);

    set(this.eventData, [this.currentDate.year(), this.currentDate.month() + 1, currentDay], eventsForDay);
  }

  updateEvent(currentDay, originalEvent, updatedEvent) {
    return new Promise((resolve, reject) => {
      if(updatedEvent.startDate.isAfter(updatedEvent.endDate)){
        reject('Според квантната теорија времето може да тече назад, но во случајов тоа е недозволена операција.')
      }
      let eventsForDay = get(this.eventData, [this.currentDate.year(), this.currentDate.month() + 1, currentDay], null);

      let arrayWithoutOriginal = eventsForDay.filter(ev => ev !== originalEvent);

      let isOverlapping = this._isEventOverlapping(arrayWithoutOriginal, updatedEvent);

      if (isOverlapping) {
        reject('Настанот неможе да се смени поради преклопување со друг настан.')
        return;
      } else {
        eventsForDay = eventsForDay.map(e => {
          if (e === originalEvent) {
            return updatedEvent.clone()
          }

          return e;
        });

        set(this.eventData, [this.currentDate.year(), this.currentDate.month() + 1, currentDay], eventsForDay);
        this._sortEvents(currentDay)
        resolve('Успешна промена.');
      }
    })
  }

  createNewEventbyType(type) {
    return new Event(new moment(), new moment(), type, '')
  }

  setCurrentYear(year) {
    this.currentDate.year(year);
  }

  setCurrentMonth(month) {
    this.currentDate.month(--month);
  }

  addMonth() {
    this.currentDate = this.currentDate.add(1, 'months');
  }

  subtractMonth() {
    this.currentDate = this.currentDate.subtract(1, 'months');
  }

  get navigationDateFormat() {
    return this.currentDate.format("/YYYY/M");
  }

  get beautifulFormat() {
    return this.currentDate.format("MMMM - YYYY");
  }

  get monthData() {
    return {
      startingDay: this.currentDate.startOf('month').isoWeekday(),
      daysInMonth: this.currentDate.daysInMonth(),
      eventsInMonth: get(this.eventData, [this.currentDate.year(), this.currentDate.month() + 1], [])
    }
  }

  get dayNames() {
    return moment.weekdays();
  }

  eventsInDay(day) {
    return computed(() => {
      return get(this.eventData, [this.currentDate.year(), this.currentDate.month() + 1, ++day], [])
    }).get()
  }
}

decorate(Store, {
  eventData: observable,
  setCurrentMonth: action,
  setCurrentYear: action,
  addMonth: action,
  subtractMonth: action,
  removeEvent: action,
  navigationDateFormat: computed,
  beautifulFormat: computed,
  dayNames: computed
})

const store = new Store();

export default store;