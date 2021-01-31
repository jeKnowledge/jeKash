import { Link } from 'react-router-dom';

import '../style/css/Sidebar.css';
import logo from '../style/logo/logoJek.svg';
import logomais from '../style/logo/logoplus.svg';
import logopessoa from '../style/logo/logoman.svg';
import logoarrowUP from '../style/logo/logoarrowUP.svg';
import logoMoney from '../style/logo/logomoney.svg';

function toggleNavTOT(x) {
    let top = document.getElementById("menu").style.top;

    if (top === "-200%"){
        document.getElementById("menu").style.top = "100%";
        document.getElementById("logoUP").style.transform = "rotate(0)";
    }
    else{
        document.getElementById("menu").style.top = "-200%";
        document.getElementById("logoUP").style.transform = "rotate(180deg)";
    }
    //alert(document.getElementById("menu").style.top);
};

function toggleNav(x){
    let top = document.getElementById("transdivsMINHASDIVIDAS").style.top;

    if (top === "-200%"){
        document.getElementById("logoUP1").style.transform = "rotate(0deg)";
        document.getElementById("dividastotaisdiv").style.top= "24%";
        document.getElementById("transdivsMINHASDIVIDAS").style.top = "0%";
    }
    else{
        document.getElementById("logoUP1").style.transform = "rotate(180deg)";
        document.getElementById("dividastotaisdiv").style.top= "8%";
        document.getElementById("transdivsMINHASDIVIDAS").style.top ="-200%";
    }
}

export const SideBAR = (props) => {
    return(
        <div id ="sbbg">
            <img src={logo} className="App-logo" alt="logo" />
                    <Link to="dividas/criar">
                        <div id = "criardivida">
                            <img src={logomais} className="App-logo-plus" alt="logoplus"/>
                        <span id= "criardividaSTR">Criar dívida</span>
                        </div>
                    </Link>
            
            <div id = "mydividasdiv">
                <div id="mydividas" onClick={toggleNav}>
                    <img src={logopessoa} className="App-logo-pessoa" alt="logopess" />
                    <span id ="mydividasSTR">Minhas dívidas</span>

                    <img src={logoarrowUP} className="App-logo-UP" id="logoUP1" style={{transform: "rotate(180deg)"}}/>
                </div>

                <div id= "transdivsMINHASDIVIDAS" style={{top: "-200%"}}>
                    <Link to="dividas/minhasdividas">
                        <div id ="oqdevo" >
                            <span id ="oqdevoSTR">O que devo</span>  
                        </div>
                    </Link>

                    <Link to="dividas/adever">
                        <div id = "oqdevem">
                            <span id = "oqdevemSTR">O que me devem</span>
                        </div>
                    </Link>
                </div>
            </div>

            <div id="dividastotaisdiv" style={{top: "8%"}}>
                <div id= "dividastotais" onClick={toggleNavTOT}>
                    <img src={logoMoney} className="App-logo-Money" alt="logomoney"/>
                    <span id ="dividastotaisSTR">Dívidas Totais</span>

                    <img src={logoarrowUP} className="App-logo-UP" id="logoUP" style={{transform: "rotate(180deg)"}}/>
                </div>

               <div id="menu" class="menu-hidden" style={{top: "-200%"}}>
                    <Link to="dividas/Interno">
                        <div id = "Interno"> 
                            <span id ="InternoSTR">Interno</span>
                        </div>
                    </Link>
                    
                    <Link to="dividas/Inovacao">
                        <div id = "Inovacao">
                            <span id = "InovacaoSTR">Inovação</span>
                        </div>
                    </Link>

                    <Link to="dividas/Tech">
                        <div id = "Tech">
                            <span id = "TechSTR">Tech</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default SideBAR;