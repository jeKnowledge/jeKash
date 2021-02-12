import '../style/css/DividasShowComponent.css';
import React, {useState,useCallback,useEffect } from 'react';
import axios from "axios";

const url = "http://localhost:8000/dividas/getall";
let credor,devedor,quantia;

const DividasComponent = (props) => {

    const color = props.color;
    const config = {
        params: {
            department: props.page
        }
    };
    

    //* The useCallback React hook is used here as we want to memoize the loadDividas function and not recreate it with every render.
    const loadDividas = useCallback(async() => { 
        const res = await axios.get(url, config);
        const dividas =res.data;
        console.log(res.data)
        setdividas(dividas);
    },[]) 
    
    //Dividas são carregadas incialmente
    useEffect(() =>{
        loadDividas();
    }, [loadDividas]);

    const [dividas, setdividas] = useState([]);
    const nrdividas = dividas.count;
    //! Esta algo de mal porque quando atualizo a pagina GET deixa de funcionar

    
    for(const i in nrdividas){
        if(dividas.Dividas[0].paga === false){
            
        }
    }
    
    credor = dividas.Dividas[0].credor;
    devedor = dividas.Dividas[0].devedor;
    quantia = dividas.Dividas[0].quantia;
    


    console.log(dividas);    

    return (
        <div className="dividasshow">
            <div className="Ppagar" style={{background: color}}>
                <span id="text1">Por Pagar</span>
            </div>

                <div id="dividaspresent">
                    <p id="titlepresent" style={{color: color}}>Descrição da divida</p>

                    <span id="line" style={{borderColor: color}}></span>
                    <div id="descricaodiv">
                        <p><span id="text2" style={{color: color}}>Credor</span> {credor}</p>
                        <p><span id="text2" style={{color: color}}>Devedor</span> {devedor}</p>
                        <p><span id="text2" style={{color: color}}>Valor a pagar</span> {quantia}</p>
                    </div>
                </div>

            <div className="Ppagar" style={{background: color}} >
                <span id="text1">Pago</span>
            </div>

            {/*desenhar aqueles 3 pontos*/}

            <div id="dividaspresent">
                <p id="titlepresent" style={{color: color}}>Descrição da divida</p>

                <span id="line" style={{borderColor: color}}></span>
                <div id="descricaodiv">
                    <p> <span id="text2" style={{color: color}}>Credor</span> {credor}</p>
                    <p> <span id="text2" style={{color: color}}>Devedor</span> {devedor}</p>
                    <p> <span id="text2" style={{color: color}}>Valor a pagar</span> {quantia}</p>
                </div>
            </div>

            {/*desenhar aqueles 3 pontos*/}
        </div>
     );
}

export default DividasComponent;