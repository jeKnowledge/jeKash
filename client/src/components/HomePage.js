//* usual stuff
import React from 'react';
import { Link } from 'react-router-dom';

//* styling the page
import logo from '../style/logo/logo.svg';
import '../style/css/HomePage.css';

const HomePage = () => {
  return (
    <div className="App">
        <div id="Background">  
          <img src={logo} className="App-logo" alt="logo" />
          <div id = "Butoes">
              <Link to="users/login">
                <button id = "logIn" >
                  <span id="LogInStr">Log in</span>
                </button>
              </Link>
              
              <Link to="users/signup">
                <button id= "Registar">
                  <span id="RegistarStr">Registar</span>
                </button>
              </Link>
          </div>
        </div>
      </div>
  )
}

export default HomePage;