import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
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
import {BrowserView, MobileView} from 'react-device-detect';

const App = () => {
  const useAuth = React.useContext(AuthContext);
  console.log(useAuth);
  
  const userToken = useAuth.state.userToken;
  console.log(userToken)
  return (
    <Router>
        <Route exact path="/">
          <HomePage />
        </Route>
      
        {userToken ? (
          <Switch>
                <Route exact path="/dividas/criar">
                  {!userToken ? (<Redirect to="/users/login" />) : (<CriarDivida/>)}
                </Route>

                <Route exact path="/dividas/minhasdividas">
                  {!userToken ? (<Redirect to="/users/login" />) : (<DividasShowDevo/>)}
                </Route>

                <Route exact path="/dividas/adever">
                  {!userToken ? (<Redirect to="/users/login" />) : (<DividasShowaDever/>)}
                </Route>

                <Route exact path="/dividas/Interno">
                  {!userToken ? (<Redirect to="/users/login" />) : (<DividasShowInterno/>)}
                </Route>

                <Route exact path="/dividas/Inovacao">
                  {!userToken ? (<Redirect to="/users/login" />) : (<DividasShowInovacao/>)}
                </Route>

                <Route exact path="/dividas/Tech">
                  {!userToken ? (<Redirect to="/users/login" />) : (<DividasShowTech/>)}
                </Route>

                <Route exact path="/home">
                  {!userToken ? (<Redirect to="/users/login" />) : (
                    <Switch>
                      <BrowserView>
                        <Route render={() => (<Redirect to="/dividas/criar" />)}/> 
                      </BrowserView>

                      <MobileView>
                          <Route render={() => (<SideBar />)}/> 
                      </MobileView>
                    </Switch>
                  )}
                  
                </Route>

                <Route exact path="/dividas/all">
                  {!userToken ? (<Redirect to="/users/login" />) : (<DividasTotais/>)}
                </Route>

        </Switch>
        ) : (
          //* Não consegui identificar o usertoken portanto vou dar redirect para o /users/login.
           <Switch>
            <Route exact path="/users/login">
              {userToken ? (<Redirect to="/home" />) : (<Login/>)}
            </Route>

            <Route exact path="/users/signup">
              {userToken ? (<Redirect to="/home" />) : (<Signup/>)}
            </Route>
          </Switch>
        )}
    </Router>
  );
  
};

export default App;