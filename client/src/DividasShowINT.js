import React from "react";
import DividasComponent from "./components/DividasShowComponent";
import TopBar from "./components/TopBar";
import SideBar from "./components/Sidebarcomp";
import "./style/css/font.css";


const DividasShow = () => {
  return (
    <div>
       <div id="bg">
        <TopBar
          color="normalTopBarCOLOR"
          height="13vh" //parece ser 18 na sidebar (13% é o normal)
          linkto="/home"
          logo="normal"
        />

        <div className="criar-divida-tituloDSC">
          <h1>Dívidas Interno</h1>
        </div>
        <DividasComponent color="#F05B78" page="Int" />
        {/* Usar o dividas Component para mudar a estetica de como as dividas aparecem
              Por outras palavras, não mexer neste HTML para mudar algo nesta pagina. Mexer no componente.
              */}
      </div>
      <div className="sidebar-mobile">
        <SideBar />
      </div>
    </div>
   
  );
};

export default DividasShow;
