import { BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import Signup from './Signup';
import CriarDivida from './CriarDivida'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
              <Route exact path="/">
                <HomePage/>
              </Route>
              <Route exact path="/users/login">
                <Login/>
              </Route>
              <Route exact path="/users/signup">
                <Signup />
              </Route>
              <Route exact path="/dividas/criar">
                <CriarDivida />
              </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
