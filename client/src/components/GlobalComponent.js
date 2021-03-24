import React, { useReducer, useEffect, createContext } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
//* um context e um componente que tem componentes filhos
//* pode nao ser um context pode ser apenas um componente global

//TODO tirar a porta do front end
//TODO e defenir a porta como o base url aqui
let AuthContext = createContext();
// axios.defaults.baseURL = "http://localhost:61000/";
axios.defaults.baseURL = "https://jekash.herokuapp.com/";

//O context só dá render da App quando tiver guardado o token no State
const AuthReducer = (action, state = {}) => {
  const token = localStorage.getItem("Authorization");
  if (token === null) {
    return <Redirect to="/" />;
  }
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        status: "LOGIN",
        userToken: token,
      };
    case "CHECKAUTHSTATE":
      if (token) {
        axios.defaults.headers.common["Authorization"] = token;
      }
      return {
        ...state,
        status: "CHECKINGAUTHSTATE",
        userToken: token,
      };

    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        status: "LOGOUT",
        userToken: null,
      };
    default:
      return {
        ...state,
        status: "default",
        userToken: token,
      };
  }
};
const Initialstate = {
  //* Initialstate:
  status: "InitalState",
  userToken: null,
};

const AuthContextProvider = (props) => {
  const [state, dispatch] = useReducer(AuthReducer, Initialstate);
  let value = { state, dispatch };
  useEffect(() => {
    dispatch({ type: "CHECKAUTHSTATE" });
  }, [state.token]);
  return (
    <AuthContext.Provider value={value}>
      {!state.loading && props.children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider, AuthContext };
