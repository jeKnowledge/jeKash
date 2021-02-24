import React from 'react';
import { useHistory } from "react-router-dom";
const history = usehistory();

function TokenNotFoundSideBar(){
    throw {
    name: 'Token Not Found Or Inexistent',
    message: 'Redirecting to Home Page...'
  };
}

function TokenNotValid(){
    throw {
    name: 'Invalid Token...',
    message: 'Whoops Looks like something is wrong with your key. Redirecting to Home Page...'
  };
}
//for login verification, vejo se ainda está lá, se não estiver ou estiver mexido (unreadable) dou redirect para a home page.
try{
    const token = localStorage.getItem("Authorization");
    if(token=== null || token===undefined){
        history.push("/");

        throw new TokenNotFoundSideBar();
    }
    // ?console.log("Validado com sucesso!")
}
catch(e){
    if(e instanceof TypeError){
        throw new TokenNotValid();
    }
    else{
        console.log(e)
    }
    history.push("/")
}
