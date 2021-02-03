import React from 'react';
import { Link } from 'react-router-dom';
import logoHamburguer from '../style/logo/logohamburguer.svg';
import logoJekL from '../style/logo/logoJekLetras.svg';
import "../style/css/TopBar.css";

export const TopBar = (props) => {
    const color = props.color;

    return(
        <div id ="bg">

            <Link to="dividas/criar">
                <img src={logoHamburguer} className="Hamburguer" alt="logoHamburguer" />
            </Link>
            
            <img src={logoJekL} className="App-logo" alt="logoJek" />

        </div>
    );
};

export default TopBar;