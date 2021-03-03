import "../style/css/DividasShowComponent.css";
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Slider from "infinite-react-carousel";
import { Redirect, useHistory } from "react-router-dom";
import { AuthContext } from "./GlobalComponent";
import Popup from "./Popup";
import "../style/css/PopUp.css";
const inicialstate = {
  dividasPagas: [],
  dividasNPagas: [],
  loading: true,
  pop: 0,
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
    case "pop1":
      return {
        ...state,
        pop: action.pop,
      };
    default:
      return state;
  }
};

const DividasComponent = (props) => {
  const authcontext = React.useContext(AuthContext);
  const history = useHistory();

  const color = props.color;
  const button = props.button;
  const user = props.user;
  let Pagocolor = PagoColorselect(color);

  let url = "dividas/" + props.page;

  const [state, dispatch] = useReducer(reducer, inicialstate);
  const [count, setCount] = useState(0);

  if (user === "usertoo") {
    url = "dividas/usertoo";
  } else if (user === "toouser") {
    url = "dividas/toouser";
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

  const handlePay = () => {
    dispatch({ type: "pop1", pop: 1 });
  };
  console.log(state.pop);
  const handleResp = (resp) => {
    console.log(count);
    if (resp === "sim") {
      if (state.dividasNPagas.length > 0) {
        const url_div = "dividas/" + state.dividasNPagas[count]._id;

        axios.post(url_div).then((res) => {
          dispatch({ type: "pop1", pop: 2 });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        });
      } else {
        console.log("Nao ha dividas");
      }
    } else {
      dispatch({ type: "pop1", pop: 0 });
    }
  };

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

  const slider = (dividas, isPay = false) => {
    return (
      <Slider {...settings} afterChange={(i) => isPay && setCount(i)}>
        {dividas.map((dividadiv, i) => {
          return (
            <div id="descricaodiv" key={i}>
              {!button && (
                <p>
                  <span id="text2" style={{ color: color }}>
                    <strong>Credor:</strong>{" "}
                  </span>
                  {dividadiv.credorS}
                </p>
              )}
              {!props.credor && (
                <p>
                  <span id="text2" style={{ color: color }}>
                    <strong>Devedor:</strong>{" "}
                  </span>
                  {dividadiv.devedorS}
                </p>
              )}
              <p>
                <span id="text2" style={{ color: color }}>
                  <strong>Valor a pagar:</strong>{" "}
                </span>
                {dividadiv.quantia + "€"}
              </p>
              <div className="div-button">
                {button && isPay && (
                  <button
                    type="submit"
                    className="pay-button"
                    onClick={handlePay}
                  >
                    Pagar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </Slider>
    );
  };

  return (
    <div className="dividasshow" id="dividasshowid">
      <div id="dividasshowid">
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
              slider(state.dividasNPagas, true)}
            {!state.dividasNPagas.length && (
              <p className="not-dividas-create">
                Ainda não há dividas por pagar ...
              </p>
            )}
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
            {!state.dividasPagas.length && (
              <p className="not-dividas-create">
                Ainda não há dividas pagas ...
              </p>
            )}
            {}
          </div>
        </div>
      </div>
      {state.pop == 1 && (
        <div className="popup">
          <Popup
            title="Queres confirmar o pagamento desta divida?"
            name1="popupzito1"
            name2="buttontext"
            id1="myPopup"
            id2="myPopupText"
            id3="buttonsPopUp"
            button="true"
            func={handleResp}
          />
        </div>
      )}
      {state.pop == 2 && (
        <div className="popup">
          <Popup
            title="Divida paga com sucesso!"
            name1="popupzito1"
            name2="popuptext"
            id1="myPopup"
            id2="myPopupText"
          />
          <span className="circle"></span>
          <span className="check"></span>
        </div>
      )}
    </div>
  );
};

export default DividasComponent;
