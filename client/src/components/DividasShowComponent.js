import '../style/css/DividasShowComponent.css';
import React, {useState,useCallback,useEffect, } from 'react';
import Carousel from 'react-elastic-carousel';
import axios from "axios";


const dividasPagas =[];
const dividasNaoPagas = [];



const DividasComponent = (props) => {
    const color = props.color;
    const url = "http://localhost:8000/dividas/" + props.page;
    const [dividas, setdividas] = useState([]);

    function DividasPagaNaoPaga() {
        const nrdividas = dividas.length;
        //! Esta algo de mal porque quando atualizo a pagina GET deixa de funcionar
            
        for(let i =0; i <nrdividas; i++){
            // ? console.log(i);
            if(dividas[i].paga === false){
                //console.log("paga")
                dividasNaoPagas.push(dividas[i]);
            }
            else {
                //console.log("npaga")
                dividasPagas.push(dividas[i]);
            }
        }
        
        //console.log(dividas)
        console.log(dividasPagas);    
        //console.log(dividasPagas);
    }

    function GetRequest(url)
    {
        axios.get(url).then((res)=>{
            setdividas(res.data);
        })
        .catch((err)=>{
            console.log(err);
        })
        DividasPagaNaoPaga();
    }

    //Dividas são carregadas incialmente
    useEffect(() =>{
        GetRequest(url)
    }, []);


    return (
        <div id="bg">
            <div className="dividasshow">
                <div className="Ppagar" style={{background: color}}>
                    <span id="text1">Por Pagar</span>
                </div>

                <Carousel
                    enableSwipe="true"
                    itemsToShow="1">
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
                <Carousel>
                <div id="dividaspresent">
                    <p id="titlepresent" style={{color: color}}>Descrição da divida</p>

                    <span id="line" style={{borderColor: color}}></span>
                    
                            {dividasPagas.map(dividadiv =>{
                                return(
                                    <div id="descricaodiv">
                                        <p><span id="text2" style={{color: color}}>Credor</span>{dividadiv.credor}</p>
                                        <p><span id="text2" style={{color: color}}>Devedor</span>{dividadiv.devedor}</p>
                                        <p><span id="text2" style={{color: color}}>Valor a pagar</span>{dividadiv.quantia}</p>
                                    </div> 
                                );
                            })}
                    </div>
                </Carousel>
            </div>
        </div>
    );
}

export default DividasComponent;