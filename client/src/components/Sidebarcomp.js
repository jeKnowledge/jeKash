import { Link, useHistory } from "react-router-dom";
import "../style/css/Sidebar.css";
import { AuthContext } from "./GlobalComponent";
import React from "react";
import "../style/css/Sidebar.css";
import logomais from "../style/logo/logoplus.svg";
import logopessoa from "../style/logo/logoman.svg";
import logoarrowUP from "../style/logo/logoarrowUP.svg";
import logoMoney from "../style/logo/logomoney.svg";

import TopBar from "./TopBar";

function toggleNavTOP(x) {
  let top = document.getElementById("menu").style.top;

  if (top === "100%") {
    document.getElementById("menu").style.top = "-300%";
    document.getElementById("logoUP").style.transform = "rotate(180deg)";
  } else {
    document.getElementById("menu").style.top = "100%";
    document.getElementById("logoUP").style.transform = "rotate(0deg)";
  }
  //alert(document.getElementById("menu").style.top);
}

function toggleNav(x) {
  let top = document.getElementById("transdivsMINHASDIVIDAS").style.top;

  if (top === "-200%") {
    document.getElementById("logoUP1").style.transform = "rotate(180deg)";
    document.getElementById("dividastotaisdiv").style.top = "24%";
    document.getElementById("transdivsMINHASDIVIDAS").style.top = "0%";
  } else {
    document.getElementById("logoUP1").style.transform = "rotate(0deg)";
    document.getElementById("dividastotaisdiv").style.top = "8%";
    document.getElementById("transdivsMINHASDIVIDAS").style.top = "-200%";
  }
}

function toggleNavBOT(x) {
  let top = document.getElementById("BottomSec").style.top;

  if (top === "-100%") {
    document.getElementById("BottomSec").style.top = "0%";
    document.getElementById("logoUPBOT").style.transform = "rotate(180deg)";
  } else {
    document.getElementById("BottomSec").style.top = "-100%";
    document.getElementById("logoUPBOT").style.transform = "rotate(0deg)";
  }
}

const SideBAR = () => {
  const history = useHistory();
  const authcontext = React.useContext(AuthContext);

  return (
    <div id="sbbg">
      <TopBar
        color="sidebarTopBarCOLOR "
        height="18%" //parece ser 18 na sidebar (10% é o normal)
        linkto="dividas/criar"
        logo="whitebg"
      />
      <div id="criardivida">
        <Link to="/dividas/criar">
          <img src={logomais} className="App-logo-plus" alt="logoplus" />
          <span id="primbotSTR">Criar dívida</span>
        </Link>
      </div>

      <div id="mydividasdiv">
        <div id="mydividas" onClick={toggleNav}>
          <img src={logopessoa} className="App-logo-pessoa" alt="logopess" />
          <span id="primbotSTR">Minhas dívidas</span>

          <img
            src={logoarrowUP}
            className="App-logo-UP"
            id="logoUP1"
            alt="arrowup"
            style={{ transform: "rotate(0deg)" }}
          />
        </div>

        <div id="transdivsMINHASDIVIDAS" style={{ top: "-200%" }}>
          <div id="primbot">
            <Link to="/dividas/minhasdividas">
              <span id="subbotSTR">O que devo</span>
            </Link>
          </div>

          <div id="primbot">
            <Link to="/dividas/adever">
              <span id="subbotSTR">O que me devem</span>
            </Link>
          </div>
        </div>
      </div>

      <div id="dividastotaisdiv" style={{ top: "8%" }}>
        <div id="dividastotais" onClick={toggleNavTOP}>
          <img src={logoMoney} className="App-logo-Money" alt="logomoney" />
          <span id="primbotSTR">Dívidas Totais</span>

          <img
            src={logoarrowUP}
            className="App-logo-UP"
            id="logoUP"
            alt="arrouup"
            style={{ transform: "rotate(0deg)" }}
          />
        </div>

        <div id="menu" className="menu-hidden" style={{ top: "-300%" }}>
          <div id="botao">
            <Link to="/dividas/Interno" style={{ marginTop: "-100%" }}>
              <span id="subbotSTR">Interno</span>
            </Link>
          </div>

          <div id="botao">
            <Link to="/dividas/Inovacao">
              <span id="subbotSTR">Inovação</span>
            </Link>
          </div>

          <div id="botao">
            <Link to="/dividas/Tech">
              <span id="subbotSTR">Tech</span>
            </Link>
          </div>

          <div id="botao">
            <Link to="/dividas/all">
              <span id="subbotSTR">Totais</span>
            </Link>
          </div>
        </div>
      </div>

      <div id="bottomBar">
        <div id="BottomPrimary" onClick={toggleNavBOT}>
          <span id="bottomBarSTR">Nome de Usuário</span>
          <img
            src={logoarrowUP}
            className="App-logo-UPBottom"
            id="logoUPBOT"
            alt="arrowup"
            style={{ transform: "rotate(180deg)" }}
          />
        </div>

        <div
          id="BottomSec"
          style={{ top: "0%" }}
          onClick={() => {
            authcontext.dispatch({ type: "LOGOUT" });
            console.log("Logged Out! Redirecting...");
            history.push("/");
          }}
        >
          <span id="subbotSTR">Log Out</span>
        </div>
      </div>
    </div>
  );
};
export default SideBAR;
