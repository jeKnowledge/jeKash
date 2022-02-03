import React, { useReducer } from "react";
import { Link, useHistory } from "react-router-dom";
import "./style/css/Login.css";
import logo from "./style/logo/logoJek.svg";
import axios from "axios";
import LabelsInputs from "./components/LabelsInputs";
import Buttons from "./components/Buttons";
import GoogleLogin from "react-google-login";
import { AuthContext } from "./components/GlobalComponent";
import "./style/css/font.css";

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
  const authcontext = React.useContext(AuthContext);
  const [user, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();

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
        authcontext.dispatch({ type: "LOGIN" });

        history.push("/home");
      })
      .catch((err) => {
        dispatch({ type: "error" });
        console.log(err);
      });
  };

  const responseGoogle = (response) => {
    //console.log(response);

    let token = response.tokenId;
    let name = response.Ju.tf;

    localStorage.setItem("Authorization", "Bearer "+token);
    localStorage.setItem("Name", name);
    localStorage.setItem("google", "true");
    authcontext.dispatch({ type: "LOGIN" });

    history.push("/home");
    //localStorage.setItem("Name", res.data.userData);
  };

  const responseFail = (response) => {
    dispatch({ type: "closedauth" });
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
            <GoogleLogin 
          clientId= "879723079642-5jo7di56hjakea4pig397659gucjlsro.apps.googleusercontent.com"
          buttonText="Login with google"
          onSuccess={responseGoogle}
          onFailure={responseFail}
          cookiePolicy={'single_host_origin'}
          hostedDomain={"jeknowledge.com"}
           />
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
