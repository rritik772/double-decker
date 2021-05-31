import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';

import {BrowserRouter, Route} from 'react-router-dom';
import Login from "./Components/Static/Login.js"
import SignUp from "./Components/Static/SignUp.js"
import MainProfile from './Components/Profilic/MainProfile';
import MainLanding from './Components/LandingPage/MainLanding';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Route exact path="/" render={(props) =><MainLanding {...props}/>}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/signup" component={SignUp}/>
      <Route exact path="/profile" render={(props) =><MainProfile {...props}/>}/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
