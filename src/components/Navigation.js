import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Store from '../store'

export default withRouter(class Navigation extends Component {
  constructor(props) {
    super(props);
    this.history = props.history;
  }

  nextDate() {
    Store.addMonth();
    this.history.push(Store.navigationDateFormat);
  }

  prevDate() {
    Store.subtractMonth();
    this.history.push(Store.navigationDateFormat);
  }

  render() {
    return (
      <div className={'col-12'} style={{ marginTop: '15px' }}>
        <div className={'row'}>
          <button className={'btn btn-primary col-2'} onClick={() => { this.prevDate() }}>
            <span>Претходен месец</span>
          </button>

          <div className={'col-8'} style={styles.middleText}>
            <h3 className={'text-primary'}>{Store.beautifulFormat}</h3>
          </div>

          <button className={'btn btn-primary col-2'} onClick={() => { this.nextDate() }}>
            <span>Следен месец</span>
          </button>
        </div>
      </div>
    )
  }
})

const styles = {
  middleText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}