import React, { useReducer } from "react";
import { AuthContext } from "./components/GlobalComponent";
import axios from "axios";
import "./style/css/CriarDivida.css";
import LabelsInputs from "./components/LabelsInputs";
import Buttons from "./components/Buttons";
import TopBar from "./components/TopBar";
import Popup from "./components/Popup";
import SideBar from "./components/Sidebarcomp";
import jwt from "jsonwebtoken";
import { AdminContext } from "./components/checkAdmin";

const initialState = {
  credor: "",
  devedor: "",
  quantia: "",
  descricao: "",
  pop: 0,
  errors: false,
};

const dividaReducer = (divida, action) => {
  switch (action.type) {
    case "CHANGE":
      const { name, value } = action;
      return { ...divida, [name]: value };
    case "RESET":
      return { ...divida, ...initialState };
    case "pop1":
      return {
        ...divida,
        pop: action.pop,
      };
    case "errors":
      return {
        ...divida,
        errors: action.errors,
      };
    default:
      return divida;
  }
};

// Stateless Functional Component
const CriarDivida = () => {
  const authcontext = React.useContext(AuthContext);
  const admincontext = React.useContext(AdminContext);

  const [divida, dispatch] = useReducer(dividaReducer, initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "CHANGE", name, value });
  };

  const analiseDivida = (divid) => {
    const tok = authcontext.state.userToken.split(" ");
    const decoded = jwt.decode(tok[1], "secret");
    const email = decoded.email;
    let check = false;

    if (divid.credor === email) {
      check = true;
    } else {
      const devedores = divid.devedor.split(",");
      console.log(devedores);
      for (let i = 0; i < devedores.length; i++) {
        if (devedores[i] === email) {
          check = true;
        }
      }
    }

    if (divid.descricao.length >= 10) {
      check = false;
    }

    return check;
  };

  const handleSubmit = (e) => {
    // impede que a pagina seja reloadada apos o clique no botao
    e.preventDefault();
    divida.quantia = parseFloat(divida.quantia);
    console.log(divida);
    authcontext.dispatch({ type: "CHECKAUTHSTATE" });
    admincontext.dispatch({ type: "CHECKADMINSTATE" });
    if (authcontext.state.isadmin) {
      console.log(divida);
      axios
        .post("/dividas/", { divida })
        .then(() => {
          dispatch({ type: "pop1", pop: 1 });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((err) => {
          dispatch({ type: "errors", errors: true });
        });
    } else if (analiseDivida(divida)) {
      axios
        .post("/dividas/", { divida })
        .then(() => {
          dispatch({ type: "pop1", pop: 1 });
          setTimeout(() => {
            window.location.reload();
          }, 20000000);
        })
        .catch((err) => {
          dispatch({ type: "errors", errors: true });
          console.log(err);
        });
    } else {
      dispatch({ type: "errors", errors: true });
    }
  };

  return (
    <div>
      <div className="topbar-mobile">
        <TopBar
          color="normalTopBarCOLOR"
          height="13vh" //parece ser 18 na sidebar (13% é o normal)
          linkto="/home"
          logo="normal"
        />
      </div>
      <div className="sidebar-mobile">
        <SideBar />
      </div>
      <form className="criar-divida" onSubmit={handleSubmit}>
        <div className="campos" id="myCampos">
          <div className="criar-divida-titulo">
            <h1>Cria uma nova dívida</h1>
          </div>
          <div className="inputs-criar-divida">
            <div className="credor-devedor-quantia-css">
              <div className="credor-css">
                <LabelsInputs
                  title="Credor"
                  name="credor"
                  type="text"
                  placeholder="exemplo@jeknowledge.pt"
                  onChange={handleInputChange}
                  value={divida.credor}
                />
              </div>
              <div className="devedor-css">
                <LabelsInputs
                  title="Devedor"
                  name="devedor"
                  type="text"
                  placeholder="exemplo@jeknowledge.pt"
                  onChange={handleInputChange}
                  value={divida.devedor}
                />
                <span className="devedoresWatermark">
                  No caso de serem vários devedores, efetua a divisão por
                  virgulas.
                </span>
              </div>
              <div className="quantia-css">
                <LabelsInputs
                  title="Quantia"
                  name="quantia"
                  type="number"
                  placeholder="Quantia da dívida"
                  onChange={handleInputChange}
                  value={divida.quantia}
                />
              </div>
            </div>
            <div className="descricao-css">
              <label className="descricao-label">Descrição</label>
              <textarea
                className="input-descricao"
                name="descricao"
                type="text"
                placeholder="Descrição da dívida"
                onChange={handleInputChange}
                value={divida.descricao}
                maxLength = "16"
              ></textarea>
              <span className="devedoresWatermark">
                No máximo 16 caracteres!
              </span>
            </div>
          </div>
          <div className="button-criar-divida">
            <Buttons name="Criar Dívida" type="submit" title="button" />
            {divida.errors && (
              <div className="Errors">
                <p className="error-create-div">
                  Erro ao criar a tua divida! Tenta novamente.
                </p>
              </div>
            )}
          </div>
        </div>
        {divida.pop == 1 && (
          <div className="popup-criar-divida">
            <Popup
              title="Dívida criada com sucesso!"
              name1="popupzito"
              name2="popuptext"
              id1="myPopup"
              id2="myPopupText"
            />
            <div className="circle-div">
              <span className="circle"></span>
              <span className="check"></span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CriarDivida;
