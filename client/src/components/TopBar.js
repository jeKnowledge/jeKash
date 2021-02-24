import React from 'react';
import { Link, } from 'react-router-dom';
import logo from '../style/logo/logoJek.svg';
import logoHamburguerSB from '../style/logo/logohamburguer.svg';
import logoHamburguerN from '../style/logo/logoHamburguer2.svg'
import logoJekL from '../style/logo/logoJekLetras.svg';
import logoJekO from '../style/logo/logoJekLetrasColor.svg';
import "../style/css/TopBar.css";
let logoApp;
let hamburguer;

export const TopBar = (props) => {
    const height = props.height; // da jeito adicionara height como parametro.
    const linkto = props.linkto;
    const color = props.color;
    
    
    if(props.logo === "whitebg") {
        logoApp = logoJekL;
        hamburguer = logoHamburguerSB;
    }
    else{
        logoApp = logoJekO;
        hamburguer = logoHamburguerN;
    }
    return(
        <div id ="bg" className={color} style = {{height: height}} >

            <Link to={linkto}>
                <img src={hamburguer} className="Hamburguer" alt="logoHamburguer" />
            </Link>
            
            <img src={logoApp} className="AppLogo" alt="logoJek" />
            <img src={logo} className="logoMain" alt="logoJek" />

        </div>
    );
};

export default TopBar;