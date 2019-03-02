import React, { Component } from 'react';
import { observer } from "mobx-react";
import Calendar from '../components/Calendar'
import Draggables from '../components/Draggables'
import Navigation from '../components/Navigation'
import Store from '../store'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

class Main extends Component {
  componentWillMount(){
    if(!this.props.match.params.year && !this.props.match.params.month){
      this.props.history.push(Store.navigationDateFormat)
    }else{
      Store.setCurrentMonth(this.props.match.params.month);
      Store.setCurrentYear(this.props.match.params.year)
    }
  }

  render() {
    return (
        <div className="container-fluid">
          <div className={'row'}>
            <div className={'col-2'}>
              <Draggables {...this.props} />
            </div>

            <div className={'col-10'}>
              <Navigation {...this.props} />
              <Calendar {...this.props} monthData={Store.monthData} />
            </div>
          </div>
        </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(observer(Main));
