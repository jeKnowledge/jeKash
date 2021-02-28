import React, { useReducer } from "react";
import { AuthContext } from "./components/GlobalComponent";
import axios from "axios";
import "./style/css/CriarDivida.css";
import LabelsInputs from "./components/LabelsInputs";
import Buttons from "./components/Buttons";
import TopBar from "./components/TopBar";
import Popup from "./components/Popup";
import SideBar from "./components/Sidebarcomp";

const initialState = {
  credor: "",
  devedor: "",
  quantia: "",
  descricao: "",
};

const dividaReducer = (divida, action) => {
  switch (action.type) {
    case "CHANGE":
      const { name, value } = action;
      return { ...divida, [name]: value };
    case "RESET":
      return { ...divida, ...initialState };
    default:
      return divida;
  }
};

// Stateless Functional COmponent
const CriarDivida = () => {
  const authcontext = React.useContext(AuthContext);

  const [divida, dispatch] = useReducer(dividaReducer, initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "CHANGE", name, value });
  };

  const handleSubmit = (e) => {
    // impede que a pagina seja reloadada apos o clique no botao
    e.preventDefault();
    divida.quantia = parseFloat(divida.quantia);
    console.log(divida);
    authcontext.dispatch({ type: "CHECKAUTHSTATE" });

    let popup = document.getElementById("myPopup");
    let popuptext = document.getElementById("myPopupText");
    let circle = document.getElementById("myCircle");
    let check = document.getElementById("myCheck");
    popup.classList.toggle("show");
    popuptext.classList.toggle("show");
    circle.classList.toggle("show");
    check.classList.toggle("show");
    document.getElementById("myCampos").style.filter = "blur(2px)";

    axios
      .post("http://localhost:8000/dividas/", { divida })
      .then(() => console.log("Divida Criada"))
      .catch((err) => {
        console.log("err");
      });
  };

  const clearState = () => {
    dispatch({ type: "RESET" });
    document.getElementById("myCampos").style.filter = "blur(0)";
    let popup = document.getElementById("myPopup");
    let popuptext = document.getElementById("myPopupText");
    let circle = document.getElementById("myCircle");
    let check = document.getElementById("myCheck");
    popup.classList.toggle("show");
    popuptext.classList.toggle("show");
    circle.classList.toggle("show");
    check.classList.toggle("show");
  };

  return (
    <div>
      <div className="topbar-mobile">
        <TopBar
          color="normalTopBarCOLOR"
          height="11vh" //parece ser 18 na sidebar (13% é o normal)
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
          <div className="inputs">
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
              ></textarea>
            </div>
          </div>
          <div className="button-criar-divida">
            <Buttons name="Criar Dívida" type="submit" title="button" />
          </div>
        </div>
        <div className="popup">
          <Popup
            title="Dívida criada com sucesso!"
            name1="popupzito"
            name2="popuptext"
            id1="myPopup"
            id2="myPopupText"
          />
          <span className="circle" id="myCircle" onClick={clearState}></span>
          <span className="check" id="myCheck" onClick={clearState}></span>
        </div>
      </form>
    </div>
  );
};

export default CriarDivida;
