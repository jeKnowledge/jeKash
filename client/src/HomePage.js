//* usual stuff
import React from 'react';
import { Link } from 'react-router-dom';

//* styling the page
import logo from './style/logo/logoJek.svg';
import './style/css/HomePage.css';
import Buttons from './components/Buttons'

const HomePage = () => {
  //* Se estamos na homepage nao estamos logged in.
  localStorage.removeItem("Authorization");
  return (
    <div className="App">
        <div id="Background">  
          <img src={logo} className="App-logo-mainmenu" alt="logo" />
          <div id="btns">
              <Link to="users/login">
                <Buttons 
                  name="Log in"
                  title="LoginStr button"
                />
              </Link>
              <Link to="users/signup">
                <Buttons 
                    name="Registar"
                    title="RegistarStr button"
                  />
              </Link>
          </div>
        </div>
      </div>
  )
}

export default HomePage;