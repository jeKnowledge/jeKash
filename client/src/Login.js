import React, { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import "./style/css/Login.css";
import logo from "./style/logo/logoJek.svg";
import axios from "axios";
import LabelsInputs from "./components/LabelsInputs";
import Buttons from "./components/Buttons";
import { AuthContext } from "./components/GlobalComponent";
import "./style/css/font.css";
import { decodeToken, isExpired } from "react-jwt";


const initialState = {
  email: "",
  password: "",
  error: "Oops! Email ou Password incorretos!",
  hidden: true,
};

const reducer = (user, action) => {
  //console.log(user)
  switch (action.type) {
    case "change":
      const { name, value } = action;
      return { ...user, [name]: value };
    case "closedauth":
      return {
        ...user,
        error: "Google Auth Fechada!",
        hidden: false,
      };
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
  const navigate = useNavigate();
  const authcontext = React.useContext(AuthContext);
  const [user, dispatch] = useReducer(reducer, initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "change", name, value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("users/login", { user })
      .then((res) => {
        const token = "Bearer " + res.data.Authorization;

        localStorage.setItem("Authorization", token);
        localStorage.setItem("Name", res.data.userData);
        
        // redirect /home
        authcontext.dispatch({ type: "LOGIN" });
        navigate("/home");
      })
      .catch((err) => {
        dispatch({ type: "error" });
        console.log(err);
      });
  };

  const responseGoogle = (response) => {
    //console.log(response);

    const token = response.credential;
    if (!token) {
      dispatch({ type: "error" });
      return;
    }

    // post to server /users/googlelogin
    axios
      .post("users/googlelogin", { token })
      .then((res) => {
        const token = "Bearer " + res.data.Authorization;
        const name = res.data.userData;

        console.log("navigatings bros");
        localStorage.setItem("Authorization", token);
        localStorage.setItem("Name", name);
        localStorage.setItem("google", "true");
        authcontext.dispatch({ type: "LOGIN" });
        
        navigate("/home");
      }).catch((err) => {
        console.log(err);
        const msg = err.response.data.error;
        alert(msg);
        authcontext.dispatch({ type: "error" });
      });
  };

  const responseFail = (response) => {
    // dispatch({ type: "closedauth" });
    console.log(response);
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
                placeholder="exemplo@jeknowledge.com"
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
          <div className="error-login">
            {!user.hidden && <p>{user.error}</p>}
          </div>
          <div className="button-login">

            <Buttons name="Log in" type="submit" title="button" />
          </div>




          <div className="link2signup">
            <GoogleLogin onSuccess={responseGoogle} onError={responseFail} hosted_domain="jeknowledge.com" />
            <span className="bottomLogin">
              Ainda não tens conta? Regista-te{" "}
              <Link className="link" to="/users/signup">
                aqui
              </Link>
              .
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
