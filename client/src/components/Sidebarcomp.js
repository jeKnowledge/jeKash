import { Link } from 'react-router-dom';

import '../style/css/Sidebar.css';
import logomais from "../style/logo/logoplus.svg";
import logopessoa from '../style/logo/logoman.svg';
import logoarrowUP from '../style/logo/logoarrowUP.svg';
import logoMoney from '../style/logo/logomoney.svg';

import TopBar from './TopBar'
import { useHistory } from "react-router-dom";

function toggleNavTOP(x) {
    let top = document.getElementById("menu").style.top;

    if (top === "-200%"){
        document.getElementById("menu").style.top = "100%";
        document.getElementById("logoUP").style.transform = "rotate(180deg)";
    }
    else{
        document.getElementById("menu").style.top = "-200%";
        document.getElementById("logoUP").style.transform = "rotate(0deg)";
    }
    //alert(document.getElementById("menu").style.top);
};

function toggleNav(x){
    let top = document.getElementById("transdivsMINHASDIVIDAS").style.top;

    if (top === "-200%"){
        document.getElementById("logoUP1").style.transform = "rotate(180deg)";
        document.getElementById("dividastotaisdiv").style.top= "24%";
        document.getElementById("transdivsMINHASDIVIDAS").style.top = "0%";
    }
    else{
        document.getElementById("logoUP1").style.transform = "rotate(0deg)";
        document.getElementById("dividastotaisdiv").style.top= "8%";
        document.getElementById("transdivsMINHASDIVIDAS").style.top ="-200%";
    }
}

function toggleNavBOT(x) {
    let top = document.getElementById("BottomSec").style.top;

    if (top === "-100%"){
        document.getElementById("BottomSec").style.top = "0%";
        document.getElementById("logoUPBOT").style.transform = "rotate(180deg)";
    }
    else{
        document.getElementById("BottomSec").style.top = "-100%";
        document.getElementById("logoUPBOT").style.transform = "rotate(0deg)";
    }
}

export const SideBAR = (props) => {

    const history = useHistory();


    //? é preciso de fazer algo para ver se estou logged in aqui? Nos gets das paginas é mas para chegar a esta pagina é?


    return(
        <div id ="sbbg">
            <TopBar
            color ="sidebarTopBarCOLOR "
            height = "18%" //parece ser 18 na sidebar (10% é o normal)
            linkto = "dividas/criar"
            logo = "whitebg"
            />
            <Link to="dividas/criar">
                <div id = "criardivida">
                    <img src={logomais} className="App-logo-plus" alt="logoplus"/>
                <span id= "primbotSTR">Criar dívida</span>
                </div>
            </Link>
            
            <div id = "mydividasdiv">
                <div id="mydividas" onClick={toggleNav}>
                    <img src={logopessoa} className="App-logo-pessoa" alt="logopess" />
                    <span id ="primbotSTR">Minhas dívidas</span>

                    <img src={logoarrowUP} className="App-logo-UP" id="logoUP1" alt= "arrowup" style={{transform: "rotate(0deg)"}}/>
                </div>

                <div id= "transdivsMINHASDIVIDAS" style={{top: "-200%"}}>
                    <Link to="dividas/minhasdividas">
                        <div id ="primbot" >
                            <span id ="subbotSTR">O que devo</span>  
                        </div>
                    </Link>

                    <Link to="dividas/adever">
                        <div id = "primbot">
                            <span id = "subbotSTR">O que me devem</span>
                        </div>
                    </Link>
                </div>
            </div>

            <div id="dividastotaisdiv" style={{top: "8%"}}>
                <div id= "dividastotais" onClick={toggleNavTOP}>
                    <img src={logoMoney} className="App-logo-Money" alt="logomoney"/>
                    <span id ="primbotSTR">Dívidas Totais</span>

                    <img src={logoarrowUP} className="App-logo-UP" id="logoUP" alt="arrouup" style={{transform: "rotate(0deg)"}}/>
                </div>

               <div id="menu" className="menu-hidden" style={{top: "-200%"}}>
                    <Link to="dividas/Interno">
                        <div id = "botao"> 
                            <span id ="subbotSTR">Interno</span>
                        </div>
                    </Link>
                    
                    <Link to="dividas/Inovacao">
                        <div id = "botao">
                            <span id = "subbotSTR">Inovação</span>
                        </div>
                    </Link>

                    <Link to="dividas/Tech">
                        <div id = "botao">
                            <span id = "subbotSTR">Tech</span>
                        </div>
                    </Link>
                </div>
            </div>

            
            <div id="bottomBar">
                <div id="BottomPrimary" onClick={toggleNavBOT}>
                    <span id ="bottomBarSTR">Nome de Usuário</span>
                    <img src={logoarrowUP} className="App-logo-UPBottom" id="logoUPBOT" alt= "arrowup" style={{transform: "rotate(180deg)"}}/>
                </div>

                <div id="BottomSec" style={{top: "0%"}} onClick={() =>{ 
                    localStorage.removeItem('Authorization');

                    console.log("Logged Out! Redirecting...");
                    
                    history.push('/');
                    
                }}>
                    <span id = "subbotSTR">Log Out</span>
                </div>
            </div>  
        </div>
    );
};
export default SideBAR;