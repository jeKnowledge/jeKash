import React, { useReducer, useEffect, createContext } from "react";
import jwt from "jsonwebtoken";

//* um context e um componente que tem componentes filhos
//* pode nao ser um context pode ser apenas um componente global

//TODO tirar a porta do front end
//TODO e defenir a porta como o base url aqui
let AdminContext = createContext();
const id_admin = "60328f4b2ff1fe39404a88ef";

//O context só dá render da App quando tiver guardado o token no State
const AdminReducer = (state = {}, action) => {
  const token = localStorage.getItem("Authorization");

  switch (action.type) {
    case "CHECKADMINSTATE":
      if (token) {
        const tok = token.split(" ");
        const decoded = jwt.decode(tok[1], "secret");
        const id_user = decoded.userId;
        console.log(id_user);
        if (id_user === id_admin) {
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
  console.log(state.isadmin);
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
