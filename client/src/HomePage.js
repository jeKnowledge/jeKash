//* usual stuff
import React from 'react';
import { Link } from 'react-router-dom';

//* styling the page
import logo from './style/logo/logoJek.svg';
import './style/css/HomePage.css';
import Buttons from './components/Buttons'

const HomePage = () => {
  return (
    <div className="App">
        <div id="Background">  
          <img src={logo} className="App-logo-mainmenu" alt="logo" />
          <div id = "Butoes">
              <Link to="users/login">
                <Buttons 
                  name="Log in"
                  title="LoginStr"
                />
              </Link>
              
              <Link to="users/signup">
              <Buttons 
                  name="Registar"
                  title="RegistarStr"
                />
              </Link>
          </div>
        </div>
      </div>
  )
}

export default HomePage;