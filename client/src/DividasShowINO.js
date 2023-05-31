import React from "react";
import DividasComponent from "./components/DividasShowComponent";
import TopBar from "./components/TopBar";
import { AuthContext } from "./components/GlobalComponent";
import { AdminContext } from "./components/checkAdmin";
import SideBar from "./components/Sidebarcomp";
import "./style/css/font.css";


const DividasShow = () => {
  const admincontext = React.useContext(AdminContext);

  const handleifAdmin = () => {
    admincontext.dispatch({ type: "CHECKADMINSTATE" });
  };

  return (
    <div>
      <div id="bggov">
      <TopBar
        color="normalTopBarCOLOR"
        height="13vh" //parece ser 18 na sidebar (13% é o normal)
        linkto="/home"
        logo="normal"
      />

      <div className="criar-divida-tituloDSC">
        <h1>Dívidas Inovação</h1>
      </div>

      <DividasComponent color="#FCC17A" page="Ino" />
    </div>
      <div className="sidebar-mobile">
        <SideBar />
      </div>
    </div>
    
    
  );
};

export default DividasShow;
