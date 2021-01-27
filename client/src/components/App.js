//* usual stuff
import React from 'react';
import { BrowserRouter as Router,Route,Switch} from 'react-router-dom';

import Home from '../components/HomePage';
import Login from '../components/Login';
import Signup from '../components/Signup';

function App(){
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/'>
            <Home/>
          </Route>
          <Route exact path='/login'>
            <Login/>
          </Route>
          <Route exact path='/signup'>
            <Signup/>
          </Route>
        </Switch>
    </div>
    </Router>
    
  );
}

export default App;