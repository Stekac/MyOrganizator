import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import EventTypes from '../models/EventTypes';

const spec = {
  beginDrag(props) {
    return { props };
  },
  endDrag(props, monitor) {
    return { props }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class DraggableEvent extends Component {
  eventType(type) {
    switch (type) {
      case EventTypes.outdoor:
        return 'btn-success';
      case EventTypes.social:
        return 'btn-warning';
      case EventTypes.learning:
        return 'btn-info';
      case EventTypes.general:
        return 'btn-secondary'
      default:
        return 'btn-primary'
    }
  }
  render() {
    return this.props.connectDragSource(
      <div className={`btn ${this.eventType(this.props.type)}`} style={{ width: '100%' }} >
        {this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)}
      </div>
    )
  }
}

export default DragSource('DraggableEvent', spec, collect)(DraggableEvent);