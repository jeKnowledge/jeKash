import React from "react";
import DividasTotaisComp from "./components/DividasTotaisComp";
import TopBar from "./components/TopBar";

const DividasTotais = () => {
  return (
    <div id="bg">
      <TopBar
        color="normalTopBarCOLOR"
        height="11vh" //parece ser 18 na sidebar (13% é o normal)
        linkto="/home"
        logo="normal"
      />
      <div className="criar-divida-titulo">
        <h1>Dívidas Globais</h1>
      </div>
      <DividasTotaisComp />
    </div>
  );
};

export default DividasTotais;
