import React from 'react';
import logo from '../style/logo/logo';

const Sidebar = () => {
    return (
        <div id ="sbbg">
            <img src={logo} className="App-logo" alt="logo" />
            <div id = "criardivida">
                <span id= "criardividaSTR">Criar dívida</span>
            </div>
            <div id = "mydividas">
                <span id ="mydividasSTR">Minhas dívidas</span>

                <div id ="oqdevo">
                    <span id ="oqdevoSTR">O que devo</span>
                    
                    <div id = "Ppagar">
                        <span id = "PpagarSTR">Por pagar</span>
                    </div>

                    <div id="Pago">
                        <span id = "PagoSTR"></span>
                    </div>
                </div>
                <div id = "oqdevem"> 
                    <span id ="oqdevemSTR">O que me devem</span>

                    <div id = "Ppagar">
                        <span id = "PpagarSTR">Por pagar</span>
                    </div>

                    <div id="Pago">
                        <span id = "PagoSTR"></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
