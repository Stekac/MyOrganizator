import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Main from './views/Main';
import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';

class App extends Component {

  render() {
    return (
      <Router>
        <div className="container-fluid">
          <Route exact path="/" component={Main} />
          <Route path="/:year/:month" component={Main} />

          <footer className={"row"}>
            <div className={"col text-center"} style={{ padding: '20px 0' }}>Изработил: Стефан Дејановски</div>
          </footer>

          <ToastContainer autoClose={4000}/>
        </div>
      </Router>
    );
  }
}

export default App;
