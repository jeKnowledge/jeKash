import React, { useReducer, useState } from "react";
import { Link,useHistory } from "react-router-dom";
import "./style/css/Login.css";
import logo from './style/logo/logoJek.svg';
import axios from "axios";
import LabelsInputs from "./components/LabelsInputs";
import Buttons from "./components/Buttons";
import {AuthContext } from './components/GlobalComponent';

const initialState = {
  email: "",
  password: "",
  error: "Oops! Email ou Passoword incorretos!",
  hidden: true,
};

const reducer = (user, action) => {
  switch (action.type) {
    case "change":
      const { name, value } = action;
      return { ...user, [name]: value };
    case "error":
      return {
        ...user,
        hidden: false,
      };
    default:
      return { ...user };
  }
};

const Login = () => {
  const authcontext = React.useContext(AuthContext);
  const [user, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "change", name, value });
  };

  const handleSubmit = (e) => {    
    e.preventDefault();
    console.log(user);
    axios.post("http://localhost:8000/users/login", { user })
      .then((res) => {
          console.log("Logging in...");
          const token = "Bearer " + res.data.Authorization;
          //? console.log('Token: ' + res.data.Authorization);

          localStorage.setItem("Authorization", token);

          console.log("Logged in! Redirecting...");
          authcontext.dispatch({type:"LOGIN"});
          
          history.push("/home");
          
      })
      .catch((err) => {
          console.log(err);
      });
  }

  const handleErros = (e) => {
    e.preventDefault();
    if (!errors.hidden) {
      return <p>Oops! Email ou Password incorretos</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="loginpage">
        <div className="jeKash-side">  
          <img src={logo} className="App-logo-mainmenu" alt="logo" />
        </div>
        <div className="loginside">
          <div className="titles-login">
            <h3 className="title1">Bem vindo/a ao jeKash!</h3>
            <h1 className="title2">Efetua o teu Login</h1>
          </div>
          <div className="inputs-login">
            <div className="email">
              <LabelsInputs
                title="Email"
                name="email"
                type="text"
                placeholder="exemplo@jeknowledge.pt"
                onChange={handleInputChange}
                value={user.email}
              />
            </div>
            <div className="password">
              <LabelsInputs
                title="Password"
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleInputChange}
                value={user.password}
              />
            </div>
          </div>
          <div className="error_login">
            {!user.hidden && <p>{user.error}</p>}
          </div>
          <div className="button-login">
            <Buttons name="Log in" type="submit" title="button" />
          </div>

          <div className="link2signup">
            <p>
              Ainda não tens conta? Regista-te{" "}
              <Link className="link" to="/users/signup">
                aqui
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
