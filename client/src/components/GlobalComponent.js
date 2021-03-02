import React, { useReducer, useEffect, createContext } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";

//* um context e um componente que tem componentes filhos
//* pode nao ser um context pode ser apenas um componente global

//TODO tirar a porta do front end
//TODO e defenir a porta como o base url aqui
let AuthContext = createContext();
const id_admin = "60328f4b2ff1fe39404a88ef";
axios.defaults.baseURL = "http://localhost:8000/";

//O context só dá render da App quando tiver guardado o token no State
const AuthReducer = (state = {}, action) => {
  const token = localStorage.getItem("Authorization");

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
    case "CHECKADMINSTATE":
      if (token) {
        const tok = token.split(" ");
        const decoded = jwt.decode(tok[1], "secret");
        const id_user = decoded.userId;
        console.log(id_user);
        if (id_user === id_admin) {
          return {
            ...state,
            status: "CHECKINGAUTHSTATE",
            userToken: token,
            isadmin: true,
          };
        }
      }

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
  isadmin: false,
};

const AuthContextProvider = (props) => {
  const [state, dispatch] = useReducer(AuthReducer, Initialstate);
  let value = { state, dispatch };
  console.log(state.isadmin);
  useEffect(() => {
    dispatch({ type: "CHECKAUTHSTATE" });
    dispatch({ type: "CHECKADMINSTATE" });
  }, [state.token]);
  return (
    <AuthContext.Provider value={value}>
      {!state.loading && props.children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider, AuthContext };
