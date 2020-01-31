import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import MainPage from './Components/MainPage';
import Register from './Components/Register';
import LogIn from './Components/LogIn';
import Todo from './Components/Todo';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={MainPage} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={LogIn} />
        <Route path="/todo" component={Todo} />
      </Router>
    </div>
  );
}

export default App;
