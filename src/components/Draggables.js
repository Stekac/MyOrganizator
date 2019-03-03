import React, { Component } from 'react';
import EventTypes from '../models/EventTypes';
import DraggableEvent from './DraggableEvent';

export default class Draggables extends Component {
  constructor(props) {
    super(props);

    this.draggablesRef = React.createRef();
  }

  _scrollListenerFunction() {
    let ticking = false;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        this.draggablesRef.current.style.marginTop = window.scrollY + 15 + 'px';
        ticking = false;
      });

      ticking = true;
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', () => this._scrollListenerFunction())
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', () => this._scrollListenerFunction())
  }

  render() {
    return (
      <div ref={this.draggablesRef} className={'card border-primary'} style={{ marginTop: '15px', transition: '0.5s margin-top' }}>
        <div className={'card-body'} style={styles.draggablesBody}>
          <DraggableEvent type={EventTypes.outdoor} />
          <DraggableEvent type={EventTypes.social}/>
          <DraggableEvent type={EventTypes.learning} />
          <DraggableEvent type={EventTypes.general} />
        </div>
      </div>
    )
  }
}

const styles = {
  draggablesBody: {
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  }
}