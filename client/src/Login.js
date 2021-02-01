import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import './style/css/Login.css';
import axios from 'axios';


const initialState = {
  email:"",
  password:""
};



const reducer = (user,action) => {

switch(action.type){
  case "change":
    const {name,value} =action;
    return {...user, [name]:value};

  default:
    return {...user};
}
}


const Login = () => {
  
const [user,dispatch] = useReducer(reducer,initialState);


const handleInputChange = e => {
  const {name,value} = e.target;
  dispatch({type:"change",name,value});
};

const handleSubmit = e => {
    e.preventDefault();
    console.log(user);


    axios.post("http://localhost:8000/users/login", { user })
      .then(() => console.log('User Loged in'))
      .catch(err => {
        console.error(err);
      });
  };

    return ( 
      <form onSubmit={handleSubmit}>
    <div className="loginpage">
    {/* <div className="jekash-logo">
      <img  className="img-logo" alt="logo"></img>
    </div> */}
    <div className="loginside">
      <h3 className="title1">Bem vindo/a ao jeKash!</h3>
      <h1 className="title2">Efetua o teu Login</h1>
      <div className="inputs">
        <div className="email">
          <label className="label">Email</label><br/><br/>
        <input className="input-email" name="email" placeholder="exemplo@jeknowledge.pt" onChange={handleInputChange} value={user.email} required></input>
        </div>
        <div className="password">
        <label className="label">Password</label><br/><br/>
        <input className="input-password" name="password" type="password" placeholder="Password" onChange={handleInputChange} value={user.password} required></input>
        </div>
      </div>

      <div className="button-login">
        <Link to="/home"> {/* Não tenho a certeza se devemos fazer isto mas fica para teste de modo a verem a homepage*/}
          <button className="button" type="submit">Login</button>
        </Link>
      </div>

      <div className="link2signup">
        <p>Ainda não tens conta? Regista-te <Link className="link" to="/users/signup">aqui</Link>.</p>
      </div>

    </div>
  </div> 
  </form>
  );
}
 
export default Login;