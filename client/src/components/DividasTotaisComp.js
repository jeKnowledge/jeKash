import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import "../style/css/DividasTotais.css";
import { AuthContext } from "./GlobalComponent";

const inicialstate = {
  dividasIno: 0,
  dividasInt: 0,
  dividasTech: 0,
  dividasPIno: 0,
  dividasPInt: 0,
  dividasPTech: 0,
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "dividas":
      return {
        ...state,
        dividasIno: action.ino,
        dividasInt: action.int,
        dividasTech: action.tech,
        dividasPIno: action.ino_pay,
        dividasPInt: action.int_pay,
        dividasPTech: action.tech_pay,
        loading: false,
      };
    default:
      return state;
  }
};

const DividasTotaisComp = (props) => {
  const authcontext = React.useContext(AuthContext);

  let url = "http://localhost:8000/dividas/alldep";

  const [state, dispatch] = useReducer(reducer, inicialstate);

  //Dividas são carregadas inicialmente
  useEffect(() => {
    authcontext.dispatch({ type: "CHECKAUTHSTATE" });
    axios
      .get(url)
      .then((res) => {
        //console.log(res.data);
        let ino = res.data.ino;
        let int = res.data.int;
        let tech = res.data.tech;
        let ino_pay = res.data.ino_pay;
        let int_pay = res.data.int_pay;
        let tech_pay = res.data.tech_pay;
        dispatch({
          type: "dividas",
          ino,
          int,
          tech,
          ino_pay,
          int_pay,
          tech_pay,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(state)


  return (
    <div className="dividasshow">
      <div className="partecima">
        
      <div className="caixa box1">
        <div className="Ino">
          <p className="titulo">Departamento Inovação</p>
          <span id="line"></span>
        </div>
        <div className="textIno">
          <p>
            <span>
              <strong className="color1">Dividas Totais:</strong>{" "}
            </span>
            {state.dividasIno} €
          </p>
          <p>
            <span>
              <strong className="color1">Total Pago:</strong>{" "}
            </span>
            {state.dividasPIno} €
          </p>
        </div>
      </div>

      <div className="caixa box2">
        <div className="Int">
          <p className="titulo">Departamento Interno</p>
          <span id="line"></span>
        </div>
        <div className="textInt">
          <p>
            <span>
              <strong className="color2">Dividas Totais:</strong>{" "}
            </span>
            {state.dividasInt} €
          </p>
          <p>
            <span>
              <strong className="color2">Total Pago:</strong>{" "}
            </span>
            {state.dividasPInt} €
          </p>
        </div>
      </div>

      </div>
      <div className="caixa box3">
        <div className="Tech">
          <p className="titulo">Departamento Tecnologia</p>
          <span id="line"></span>
        </div>
        <div className="textTech">
          <p>
            <span>
              <strong className="color3">Dividas Totais:</strong>{" "}
            </span>
            {state.dividasTech} €
          </p>
          <p>
            <span>
              <strong className="color3">Total Pago:</strong>{" "}
            </span>
            {state.dividasPTech} €
          </p>
        </div>
      </div>
    </div>
  );
};

export default DividasTotaisComp;
