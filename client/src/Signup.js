import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import './style/css/Signup.css'
import axios from 'axios';

 const initialState = {
    name:"",
    lastname:"",
    email:"",
    password:"",
    password2:"",
    department:""
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


const Signup = () => {

  const [user,dispatch] = useReducer(reducer,initialState);
  

    const handleInputChange = e => {
      const {name,value} = e.target;
      dispatch({type:"change",name,value});
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log(user);
      

        axios.post("http://localhost:8000/users/signup", { user })
          .then(() => console.log('User Created'))
          .catch(err => {
            console.error(err);
          });
      };

    return (

    <form onSubmit={handleSubmit}>
          <div className="signuppage">
        {/* <div className="jekash-logo">
          <img  className="img-logo" alt="logo"></img>
        </div> */}
        <div className="signupside">
          <h2 className="titlesg">Bem vindo/a ao jeKash!</h2>
          <h1 className="titlesg2">Efetua o teu Registo</h1>
          <div className="inputs1">
            <div className="name-lastname">
                <div className="name">
                  <label className="labelname">Nome</label><br/><br/>
                  <input className="input-name" name="name" placeholder="Nome" onChange={handleInputChange} value={user.name}></input>
                </div>
                <div className="lastname">
                  <label className="labellastname">Apelido</label><br/><br/>
                  <input className="input-lastname" name="lastname" placeholder="Apelido" onChange={handleInputChange} value={user.lastname}></input>
                </div>
            </div>
            <div className="email">
              <label className="label">Email</label><br/><br/>
              <input className="input-email" name="email" placeholder="exemplo@jeknowledge.pt" onChange={handleInputChange} value={user.email}></input>
            </div>
            <div className="password1">
            <label className="l l">Password</label><br/><br/>
            <input className="input-password" name="password" type="password" placeholder="Password" onChange={handleInputChange} value={user.password}></input>
            </div>
            <div className="password2">
            <label className="label">Confirma a Password</label><br/><br/>
            <input className="input-password" name="password2" type="password" placeholder="Password" onChange={handleInputChange} value={user.password2}></input>
            </div>
            <div className="department">
            <label className="label">Departamento</label><br/><br/>
            <select className="input-department" name="department" type="department" onChange={handleInputChange} value={user.department}>
                <option value="false">Escolhe o teu departamento</option>
                <option value="Departamento de Interno">Departamento de Interno</option>
                <option value="Departamento de Inovação">Departamento de Inovação</option>
                <option value="Departamento de Tecnologia">Departamento de Tecnologia</option>
                </select>
            </div>
          </div>

          <div className="button-login">
            <button className="button" type="submit">Registar</button>
          </div>

          <div className="link2signup">
            <p>Já tens conta? Faz login <Link className="link" to="/users/login">aqui</Link>.</p>
          </div>

        </div>
        </div> 
    </form>
      );
}
 
export default Signup;