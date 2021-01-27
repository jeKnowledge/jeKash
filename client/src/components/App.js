import { BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Intro from '.';
import Login from '../Login';
import Signup from '../Signup';

function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
            <Route exact path="/">
              <Intro/>
            </Route>
            <Route exact path="/users/login">
              <Login/>
            </Route>
            <Route exact path="/users/signup">
              <Signup />
            </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
