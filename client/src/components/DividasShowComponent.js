import "../style/css/DividasShowComponent.css";
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Slider from "infinite-react-carousel";

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
  const color = props.color;
  let Pagocolor = PagoColorselect(color);

  let url = "http://localhost:8000/dividas/" + props.page;

  const [state, dispatch] = useReducer(reducer, inicialstate);

  if (props.user) {
    let url = "http://localhost:8000/dividas/user";
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
                  Credor:{" "}
                </span>
                {dividadiv.credorS}
              </p>
              <p>
                <span id="text2" style={{ color: color }}>
                  Devedor:{" "}
                </span>
                {dividadiv.devedorS}
              </p>
              <p>
                <span id="text2" style={{ color: color }}>
                  Valor a pagar:{" "}
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
    axios
      .get(url)
      .then((res) => {
        const lastget = res.data;
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

      <div id="slider">
        <div id="dividaspresent">
          <p id="titlepresent" style={{ color: color }}>
            Descrição da divida
          </p>

          <span id="line" style={{ borderColor: color }}></span>
          {!state.loading &&
            state.dividasNPagas.length &&
            slider(state.dividasNPagas)}
        </div>
      </div>

      <div className="Ppagar" style={{ background: Pagocolor }}>
        <span id="text1">Pago</span>
      </div>

      {/*desenhar aqueles 3 pontos*/}

      <div id="slider">
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
