import React, { useReducer, useEffect, createContext } from "react";
import { decodeToken, isExpired } from "react-jwt";

//* um context e um componente que tem componentes filhos
//* pode nao ser um context pode ser apenas um componente global

//TODO tirar a porta do front end
//TODO e defenir a porta como o base url aqui
let AdminContext = createContext();

//O context só dá render da App quando tiver guardado o token no State
const AdminReducer = (action, state = {}) => {
  const token = localStorage.getItem("Authorization");

  switch (action.type) {
    case "CHECKADMINSTATE":
      if (token) {
        const tok = token.split(" ");
        const decoded = decodeToken(tok);
        const isExpiredToken = isExpired(tok);
        if (isExpiredToken) {
          return {
            ...state,
            status: "CHECKADMINSTATE",
            isadmin: false,
          };
        }
        
        const isAdminToken = decoded.admin;
        if (isAdminToken === true) {
          return {
            ...state,
            status: "CHECKADMINSTATE",
            isadmin: true,
          };
        }
      }
    default:
      return {
        ...state,
        status: "default",
        isadmin: false,
      };
  }
};
const Initialstate = {
  //* Initialstate:
  status: "InitalState",
  isadmin: false,
};

const AdminContextProvider = (props) => {
  const [state, dispatch] = useReducer(AdminReducer, Initialstate);
  let value = { state, dispatch };
  useEffect(() => {
    dispatch({ type: "CHECKADMINSTATE" });
  }, [state.isadmin]);
  return (
    <AdminContext.Provider value={value}>
      {!state.loading && props.children}
    </AdminContext.Provider>
  );
};

export { AdminContextProvider, AdminContext };
