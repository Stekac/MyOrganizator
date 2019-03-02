import React, { Component } from 'react';
import Store from '../store';
import { observer } from 'mobx-react';
import Modal from 'react-modal';
import Event from './Event';
import Timekeeper from 'react-timekeeper';
import { toast } from 'react-toastify';
import { DropTarget } from 'react-dnd';

const spec = {
  canDrop(props) {
    return props.active;
  },
  drop(props, monitor, component) {
    component.setState({ modalState: 'save' })
    component._openModal(Store.createNewEventbyType(monitor.getItem().props.type))
  }
}

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

export default DropTarget('DraggableEvent', spec, collect)(observer(class Day extends Component {
  constructor(props) {
    super(props);
    this.active = this.props.active;
    this.currentDay = this.props.currentDay;
    this.eventsInDay = this.props.eventsInDay;

    this.state = { modalOpened: false, currentEvent: null, originalEvent: null, modalState: 'update' };
  }
  _calculateStyles() {
    return {
      cursor: this.active ? 'default' : 'not-allowed',
      userSelect: this.active ? '' : 'none',
      width: 'calc(100% / 7)'
    }
  }

  _removeEvent(event) {
    Store.removeEvent(this.currentDay, event);
  }

  _renderEvents() {
    if (this.eventsInDay) {
      return this.eventsInDay.map((event, index) => {
        return (
          <Event key={index}
            event={event}
            onRemoveEvent={(event) => this._removeEvent(event)}
            onOpenModal={(event) => this._openModal(event)}
          />
        )
      })
    }
  }

  _openModal(event) {
    this.setState({ modalOpened: true })
    this.setState({ originalEvent: event })
    this.setState({ currentEvent: event.clone() })

  }

  _closeModal(action) {
    if (action === 'save') {
      Store.addEventOnDay(this.currentDay, this.state.currentEvent)
        .then(succ => {
          toast.success(succ);
        }).catch(err => {
          toast.error(err)
        })
      this.setState({ modalState: 'update' })
    } else if (action === 'update') {
      Store.updateEvent(this.currentDay, this.state.originalEvent, this.state.currentEvent)
        .then(succ => {
          toast.success(succ)
        }).catch(err => {
          toast.error(err)
        })
    }

    this.setState({ modalOpened: false })
    this.setState({ currentEvent: null })
  }

  _updateCurrentEvent({ from, to, description }) {
    let newEvent = this.state.currentEvent.clone();

    if (from) {
      newEvent.startDate.hours(from.hour24);
      newEvent.startDate.minutes(from.minute);
    }
    if (to) {
      newEvent.endDate.hours(to.hour24);
      newEvent.endDate.minutes(to.minute);
    }
    if (description) {
      newEvent.description = description;
    }

    this.setState({ currentEvent: newEvent })
  }

  _determineClasses() {
    let classes = ['card rounded-0'];

    if (this.active) {
      classes.push('border-primary');
      if (this.props.canDrop) {
        classes.push('border-success')
      }
      if (this.props.isOver && this.props.canDrop) {
        classes.push('bg-success')
      } else {
        classes.push('bg-white')
      }
    } else {
      classes.push('border-secundary text-muted')
      if (!this.props.canDrop && this.props.isOver) {
        classes.push('bg-danger')
      } else {
        classes.push('bg-light')
      }
    }

    return classes.join(' ')
  }

  modalBorderColor(type) {
    switch (type) {
      case 'outdoor':
        return 'border-success';
      case 'social':
        return 'border-warning';
      case 'learning':
        return 'border-info';
      case 'general':
        return 'border-secondary'
    }
  }

  render() {
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <div
        className={this._determineClasses()}
        style={this._calculateStyles()}>
        <div className={'card-body customize-card'}>
          <div className={'card-title text-center'}>{this.currentDay}</div>
          <div className={'card-text text-center'}>
            <ul className={'list-group'}>
              {this._renderEvents()}
            </ul>
          </div>
        </div>
        <Modal
          isOpen={this.state.modalOpened}
          ariaHideApp={false}
          overlayClassName={'modal-overlay'}
          className={'align-middle col-8 offset-2 modal-class'}
        >
          <div className={`card ${this.modalBorderColor(this.state.currentEvent && this.state.currentEvent.type)}`}>
            <div className={'card-header text-center'}>{this.state.currentEvent && this.state.currentEvent.type.toUpperCase() + ' НАСТАН'}</div>
            <div className={'card-body row'}>
              <div className={'col-4'}>
                <div className={'text-center'}>Од: </div>
                <Timekeeper
                  time={this.state.currentEvent && this.state.currentEvent.startDate.format('HH:mm')}
                  onChange={newTime => this._updateCurrentEvent({ from: newTime })} />
              </div>
              <div className={'col-4'}>
                <div className={'text-center'}>До:</div>
                <Timekeeper
                  time={this.state.currentEvent && this.state.currentEvent.endDate.format('HH:mm')}
                  onChange={newTime => this._updateCurrentEvent({ to: newTime })} />
              </div>
              <div className={'col-4'}>
                <div className={'text-center'}>Опис: </div>
                <textarea className={'form-control'} name="event_description" cols="30" rows="10"
                  value={(this.state.currentEvent && this.state.currentEvent.description) || ''}
                  onChange={(e) => { this._updateCurrentEvent({ description: e.currentTarget.value }) }}>
                </textarea>
              </div>
            </div>
            <div className="card-footer text-right">
              <button className={'btn btn-danger'} style={{ marginRight: '15px' }} onClick={() => { this._removeEvent(this.state.originalEvent) }}>
                {this.state.modalState === 'save' ? 'Откажи' : 'Избриши'}
              </button>
              <button className={'btn btn-primary'} onClick={() => { this._closeModal(this.state.modalState) }}>
                {this.state.modalState === 'save' ? 'Додади' : 'Смени'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

}))