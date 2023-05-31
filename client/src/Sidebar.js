import React from "react";
import { BrowserView, MobileView } from "react-device-detect";
import SideBarCOMP from "./components/Sidebarcomp";
import CriarDivida from "./CriarDivida";
import "./style/css/font.css";

const Sidebar = () => {

  return (
    <>
      <BrowserView>
        <CriarDivida />
      </BrowserView>

      <MobileView>
        <SideBarCOMP />
      </MobileView>
    </>
  );
};

export default Sidebar;
