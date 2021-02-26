import React from 'react';
import { BrowserRouter as Router, Route, Switch,Redirect } from "react-router-dom";
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
import { AuthContext } from './components/GlobalComponent';
import {BrowserView, MobileView} from 'react-device-detect';

const App = () => {
  const useAuth = React.useContext(AuthContext);
  const MediaQuery = require('react-responsive');

  console.log(useAuth)
  const userToken = useAuth.state.userToken;
  console.log(userToken);

  return (
    <Router>
        <Route exact path="/">
            <HomePage/>
          </Route>     
        <Route exact path="/users/login">
            <Login/>
          </Route>

          <Route exact path="/users/signup">
            <Signup/>
          </Route>
              {userToken ? (
                <Switch>
                <Route exact path="/dividas/criar">
                  <CriarDivida />
                </Route>

                <Route exact path="/dividas/minhasdividas">
                  <DividasShowDevo />
                </Route>

                <Route exact path="/dividas/adever">
                  <DividasShowaDever />
                </Route>

                <Route exact path="/dividas/Interno">
                  <DividasShowInterno />
                </Route>

                <Route exact path="/dividas/Inovacao">
                  <DividasShowInovacao />
                </Route>

                <Route exact path="/dividas/Tech">
                  <DividasShowTech />
                </Route>
                
                <Route exact path="/home">

                  <BrowserView>
                     <Route render={() => (<Redirect to="/dividas/criar" />)}/> 
                  </BrowserView>

                    <MobileView>
                        <Route render={() => (<SideBar />)}/> 
                    </MobileView>
                  
                </Route>
              </Switch> 
              ) : (
                //* Não consegui identificar o usertoken portanto vou dar redirect para o /users/login.
                <Route render={() => (<Redirect to="/" />)}/> 
              )}
    </Router>
  );
};

export default App;