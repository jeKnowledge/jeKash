import React from "react";
import DividasComponent from "./components/DividasShowComponent";
import TopBar from "./components/TopBar";
import { AuthContext } from "./components/GlobalComponent";

const DividasShow = () => {
  const authcontext = React.useContext(AuthContext);

  return (
    <div id="bg">
      <TopBar
        color="normalTopBarCOLOR"
        height="11vh" //parece ser 18 na sidebar (13% é o normal)
        linkto="/home"
        logo="normal"
      />

      <div className="criar-divida-tituloDSC">
        <h1>Dívidas Inovação</h1>
      </div>

      {authcontext.state.isadmin && (
        <DividasComponent color="#FCC17A" page="Ino" button="true" />
      )}
      {!authcontext.state.isadmin && (
        <DividasComponent color="#FCC17A" page="Ino" />
      )}
    </div>
  );
};

export default DividasShow;
