import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

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
      case 'outdoor':
        return 'btn-success';
      case 'social':
        return 'btn-warning';
      case 'learning':
        return 'btn-info';
      case 'general':
        return 'btn-secondary'
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