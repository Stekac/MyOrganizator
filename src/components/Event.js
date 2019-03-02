import React from 'react';

const _calculateBorder = (type) => {
  switch (type) {
    case 'outdoor':
      return 'bg-success text-white'
    case 'social':
      return 'bg-warning text-dark'
    case 'learning':
      return 'bg-info text-white';
    case 'general':
      return 'bg-secondary text-white'
  }
}

export default ({ event, onRemoveEvent, onOpenModal }) => {
  return (
    <li
      className={`list-group-item ${_calculateBorder(event.type)}`}
      style={{ padding: '2px' }}
      onDoubleClick={() => onOpenModal(event)}
    >
      <span>{event.startDate.format('HH:mm')} - {event.endDate.format('HH:mm')}</span>

      <span aria-hidden="true"
        style={{ fontSize: '20px', lineHeight: 1, float: 'right', cursor: 'pointer' }}
        onClick={() => onRemoveEvent(event)}>&times;</span>
    </li>
  )
}