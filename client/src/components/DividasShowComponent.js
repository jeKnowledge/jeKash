import '../style/css/DividasShowComponent.css';
import React, {useState,useCallback,useEffect, } from 'react';
import Carousel from 'react-elastic-carousel';
import axios from "axios";

const url = "http://localhost:8000/dividas/getall";
const dividasPagas =[];
const dividasNaoPagas = [];

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
        setdividas(dividas);
    },[]) 
    
    const [dividas, setdividas] = useState([]);

    //Dividas são carregadas incialmente
    useEffect(() =>{
        
        const nrdividas = dividas.count;
        //! Esta algo de mal porque quando atualizo a pagina GET deixa de funcionar
        
        for(let i =0; i <nrdividas; i++){
            console.log(i);
            if(dividas.Dividas[i].paga === false){
                console.log("paga")
                dividasNaoPagas.push(dividas.Dividas[i]);
            }
            else {
                console.log("npaga")
                dividasPagas.push(dividas.Dividas[i]);
            }
        }
        
        //console.log(dividas)
        console.log(dividasNaoPagas);    
        //console.log(dividasPagas);


        loadDividas();
    }, [loadDividas]);

        

    return (
        <div id="bg">
            <div className="dividasshow">
                <div className="Ppagar" style={{background: color}}>
                    <span id="text1">Por Pagar</span>
                </div>
                <Carousel
                    itemsToShow={1}>
                            {dividasNaoPagas.map(dividadiv =>{
                                return(
                                    <div id="dividaspresent">
                
                                        <p id="titlepresent" style={{color: color}}>Descrição da divida</p>
                                        <span id="line" style={{borderColor: color}}></span>
                                        <div id="descricaodiv">
                                            <p><span id="text2" style={{color: color}}>Credor</span>{dividadiv.credor}</p>
                                            <p><span id="text2" style={{color: color}}>Devedor</span>{dividadiv.devedor}</p>
                                            <p><span id="text2" style={{color: color}}>Valor a pagar</span>{dividadiv.quantia}</p>
                                        </div>

                                    </div>
                                );
                            })}
                    </Carousel>
                        

                    

                <div className="Ppagar" style={{background: color}} >
                    <span id="text1">Pago</span>
                </div>

                {/*desenhar aqueles 3 pontos*/}

                <div id="dividaspresent">
                    <p id="titlepresent" style={{color: color}}>Descrição da divida</p>

                    <span id="line" style={{borderColor: color}}></span>
                    <Carousel>
                            {dividasPagas.map(dividadiv =>{
                                return(
                                    <div id="descricaodiv">
                                        <p><span id="text2" style={{color: color}}>Credor</span>{dividadiv.credor}</p>
                                        <p><span id="text2" style={{color: color}}>Devedor</span>{dividadiv.devedor}</p>
                                        <p><span id="text2" style={{color: color}}>Valor a pagar</span>{dividadiv.quantia}</p>
                                    </div> 
                                );
                            })}
                    </Carousel>
                </div>

                {/*desenhar aqueles 3 pontos*/}
            </div>
        </div>
    );
}

export default DividasComponent;