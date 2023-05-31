import React from "react";
import {
  Route,
  Routes
} from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./Login";
import Signup from "./Signup";
import CriarDivida from "./CriarDivida";
import SideBar from "./Sidebar";
import DividasShowInterno from "./DividasShowINT";
import DividasShowInovacao from "./DividasShowINO";
import DividasShowTech from "./DividasShowTEC";
import DividasShowaDever from "./DividasShowaDever";
import DividasShowDevo from "./DividasShowDevo";
import DividasTotais from "./DividasTotais";
import { AuthContext } from "./components/GlobalComponent";
import Protected from "./Protected";

const App = () => {
  const useAuth = React.useContext(AuthContext);

  const userToken = useAuth.state.userToken;
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />

      <Route exact path="/dividas/criar" element={
        <Protected isLoggedIn={userToken}>
          <CriarDivida />
        </Protected>
      } />

      <Route exact path="/dividas/minhasdividas" element={
        <Protected isLoggedIn={userToken}>
          <DividasShowDevo />
        </Protected>
      } />

      <Route exact path="/dividas/adever" element={
        <Protected isLoggedIn={userToken}>
          <DividasShowaDever />
        </Protected>
      } />

      <Route exact path="/dividas/Interno" element={
        <Protected isLoggedIn={userToken}>
          <DividasShowInterno />
        </Protected>
      } />

      <Route exact path="/dividas/Inovacao" element={
        <Protected isLoggedIn={userToken}>
          <DividasShowInovacao />
        </Protected>
      } />

      <Route exact path="/dividas/Tech" element={
        <Protected isLoggedIn={userToken}>
          <DividasShowTech />
        </Protected>
      } />

      <Route path="/home" element={
        <Protected isLoggedIn={userToken}>
          <SideBar />
        </Protected>
      } />

      <Route exact path="/dividas/all" element={
        <Protected isLoggedIn={userToken}>
          <DividasTotais />
        </Protected>
      } />


      {/* Rotas que não precisam de token. */}
      <Route exact path="/users/login" element={<Login />} />

      <Route exact path="/users/signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
