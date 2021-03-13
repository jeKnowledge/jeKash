import React from "react";
import DividasTotaisComp from "./components/DividasTotaisComp";
import TopBar from "./components/TopBar";
import SideBar from "./components/Sidebarcomp";
import "./style/css/font.css";


const DividasTotais = () => {
  return (
    <div>
      <div id="bg">
        <TopBar
          color="normalTopBarCOLOR"
          height="13vh" //parece ser 18 na sidebar (13% é o normal)
          linkto="/home"
          logo="normal"
        />
        <div className="dividas-globais-titulo">
          <h1>Dívidas Globais</h1>
        </div>
        <DividasTotaisComp />
      </div>
      <div className="sidebar-mobile">
        <SideBar />
      </div>
    </div>
  );
};

export default DividasTotais;
