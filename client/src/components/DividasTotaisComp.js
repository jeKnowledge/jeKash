import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import "../style/css/DividasTotais.css";

const inicialstate = {
  dividasIno: [],
  dividasInt: [],
  dividasTec: [],
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
        dividasIno: action.auxIno,
        dividasInt: action.auxInt,
        dividasTec: action.auxTec,
        loading: false,
      };
    default:
      return state;
  }
};

const DividasTotaisComp = (props) => {
  const color = props.color;
  let Pagocolor = PagoColorselect(color);

  let url = "http://localhost:8000/dividas/alldep";

  const [state, dispatch] = useReducer(reducer, inicialstate);

  const DividasPagaNaoPaga = (dividas) => {
    console.log(dividas);
    const nrdividas = dividas.length;
    const auxIno = [];
    const auxInt = [];
    const auxTec = [];

    // for (let i = 0; i < nrdividas; i++) {

    //   if (dividas[i].d === false) {

    //     auxNPagas.push(dividas[i]);
    //   } else {
    //     auxPagas.push(dividas[i]);
    //   }
    // }

    dispatch({ type: "dividas", auxIno, auxInt, auxTec });
  };

  //Dividas são carregadas inicialmente
  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        const lastget = res.data.Dividas;
        console.log(lastget);
        DividasPagaNaoPaga(lastget);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="dividasshow">
      <div className="caixa">
        <div className="Ino">
          <p className="titulo">
            <strong>Departamento Inovação</strong>
          </p>
          <span id="line"></span>
        </div>
        <div className="textoIno">
          <p>
            <strong>Divida Total </strong>
            {}
          </p>
          <p>
            <strong>Total Pago </strong>
            {}
          </p>
        </div>
      </div>

      <div className="caixa">
        <div className="Int">
          <p className="titulo">
            <strong>
              <strong>Departamento Interno</strong>
            </strong>
          </p>
          <span id="line"></span>
        </div>
        <div className="textoInt">
          <p>
            <strong>Divida Total </strong>
            {}
          </p>
          <p>
            <strong>Total Pago </strong>
            {}
          </p>
        </div>
      </div>

      <div className="caixa">
        <div className="Tech">
          <p className="titulo">Departamento Tecnologia</p>
          <span id="line"></span>
        </div>
        <div className="textoTech">
          <p>
            <strong>Divida Total </strong>
            {}
          </p>
          <p>
            <strong>Total Pago </strong>
            {}
          </p>
        </div>
      </div>
      <br />
    </div>
  );
};

export default DividasTotaisComp;
