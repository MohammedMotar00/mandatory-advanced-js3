import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import LoggedinUser from './Components/LoggedinUser';

import MainPage from './Components/MainPage';
import Register from './Components/Register';
import LogIn from './Components/LogIn';
import RenderTodos from './Components/RenderTodos';

function App() {
  return (
    <div className="App">
      <Router>
        <LoggedinUser />
        <Route exact path="/" component={MainPage} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={LogIn} />
        <Route path="/todo" component={RenderTodos} />
      </Router>
    </div>
  );
}

export default App;
