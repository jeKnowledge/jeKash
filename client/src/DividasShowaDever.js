import React from "react";
import DividasComponent from "./components/DividasShowComponent";
import TopBar from "./components/TopBar";
import SideBar from "./components/Sidebarcomp";
import { AuthContext } from "./components/GlobalComponent";
import { AdminContext } from "./components/checkAdmin";
import "./style/css/font.css";


const DividasShowaDever = () => {
  const authcontext = React.useContext(AuthContext);
  const admincontext = React.useContext(AdminContext);

  const handleifAdmin = () => {
    admincontext.dispatch({ type: "CHECKADMINSTATE" });
  };
  return (
    <div>
      <div id="bggov">
        <div className="topbar-mobile">
          <TopBar
            color="normalTopBarCOLOR"
            height="13vh" //parece ser 18 na sidebar (13% é o normal)
            linkto="/home"
            logo="normal"
          />
        </div>
      <div className="criar-divida-tituloDEV">
        <h1>O que me devem</h1>
      </div>
        <DividasComponent user="toouser" color="#F08A6E" button="true" />
      </div>
      <div className="sidebar-mobile">
        <SideBar />
      </div>
    </div>
  );
};

export default DividasShowaDever;
