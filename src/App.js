import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { LoginForm } from './components/LoginForm';

class App extends Component {
  render() {
    return (
      
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
        <LoginForm/>
      </div>
    );
  }
}

export default App;
