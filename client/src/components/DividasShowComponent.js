import "../style/css/DividasShowComponent.css";
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Slider from "infinite-react-carousel";
import { useHistory } from "react-router-dom";
import { AuthContext } from "./GlobalComponent";
const inicialstate = {
  dividasPagas: [],
  dividasNPagas: [],
  loading: true,
};

function PagoColorselect(color) {
  switch (color) {
    case "#F05B78":
      return "#F391A4";
    case "#FCC17A":
      return "#FFD8AB";
    case "#51A450":
      return "#9FCA9E";
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case "dividas":
      return {
        ...state,
        dividasPagas: action.auxPagas,
        dividasNPagas: action.auxNPagas,
        loading: false,
      };
    default:
      return state;
  }
};

const DividasComponent = (props) => {
  const authcontext = React.useContext(AuthContext);

  const color = props.color;
  const button = props.button;
  const user = props.user;
  let Pagocolor = PagoColorselect(color);

  let url = "http://localhost:8000/dividas/" + props.page;

  const [state, dispatch] = useReducer(reducer, inicialstate);

  if (user === "usertoo") {
    url = "http://localhost:8000/dividas/usertoo";
  } else if (user === "toouser") {
    url = "http://localhost:8000/dividas/toouser";
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const DividasPagaNaoPaga = (dividas) => {
    console.log(dividas);
    const nrdividas = dividas.length;
    const auxNPagas = [];
    const auxPagas = [];

    console.log(dividas);
    for (let i = 0; i < nrdividas; i++) {
      // ? console.log(i);
      if (dividas[i].paga === false) {
        //console.log("paga")
        auxNPagas.push(dividas[i]);
      } else {
        auxPagas.push(dividas[i]);
      }
    }
    dispatch({ type: "dividas", auxNPagas, auxPagas });
  };

  const slider = (dividas) => {
    return (
      <Slider {...settings}>
        {dividas.map((dividadiv, i) => {
          console.log(dividadiv);
          return (
            <div id="descricaodiv" key={i}>
              <p>
                <span id="text2" style={{ color: color }}>
                  <strong>Credor:</strong>{" "}
                </span>
                {dividadiv.credorS}
              </p>
              <p>
                <span id="text2" style={{ color: color }}>
                  <strong>Devedor:</strong>{" "}
                </span>
                {dividadiv.devedorS}
              </p>
              <p>
                <span id="text2" style={{ color: color }}>
                  <strong>Valor a pagar:</strong>{" "}
                </span>
                {dividadiv.quantia + "€"}
              </p>
            </div>
          );
        })}
      </Slider>
    );
  };

  //Dividas são carregadas inicialmente
  useEffect(() => {
    authcontext.dispatch({ type: "CHECKAUTHSTATE" });
    console.log(url);
    axios
      .get(url)
      .then((res) => {
        const lastget = res.data;
        console.log(res.data);
        DividasPagaNaoPaga(lastget);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="dividasshow">
      <div className="Ppagar" style={{ background: color }}>
        <span id="text1">Por Pagar</span>
      </div>

      <div cal="slider">
        <div id="dividaspresent">
          <p id="titlepresent" style={{ color: color }}>
            Descrição da divida
          </p>

          <span id="line" style={{ borderColor: color }}></span>
          {!state.loading &&
            state.dividasNPagas.length &&
            slider(state.dividasNPagas)}
          <div className="div-button">
            {button && (
              <button type="submit" className="pay-button">
                Pago
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="Ppagar" style={{ background: Pagocolor }}>
        <span id="text1">Pago</span>
      </div>

      {/*desenhar aqueles 3 pontos*/}

      <div className="slider2">
        <div id="dividaspresent">
          <p id="titlepresent" style={{ color: color }}>
            Descrição da divida
          </p>

          <span id="line" style={{ borderColor: color }}></span>
          {!state.loading &&
            state.dividasPagas.length &&
            slider(state.dividasPagas)}
        </div>
      </div>
    </div>
  );
};

export default DividasComponent;
