import '../style/css/DividasShowComponent.css';
import React, {useState,useEffect } from 'react';
import axios from "axios";
import Slider from "react-slick";

const dividasPagas =[];
const dividasNaoPagas = [];
let lastget = [];

function PagoColorselect(color){
    switch(color){
        case "#F05B78":
            return "#F391A4";
        case "#FCC17A":
            return "#FFD8AB";
        case "#51A450":
            return "#9FCA9E";
    }
}


const DividasComponent = (props) => {
    const color = props.color;
    let Pagocolor = PagoColorselect(color);

    const url = "http://localhost:8000/dividas/" + props.page;
    const [dividas, setdividas] = useState([]);
    const settings = {
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1
    };

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
        //console.log(dividasNaoPagas);    
        //console.log(dividasPagas);
    }

    function GetRequest(url)
    {
        setdividas(lastget);
        axios.get(url).then((res)=>{
            lastget = res.data;
            setdividas(lastget);
            
        })
        .catch((err)=>{
            console.log(err);
        })
        DividasPagaNaoPaga();
    }

    
    //Dividas são carregadas incialmente
    useEffect(() =>{
        
        GetRequest(url)
        console.log("dividas:" + dividas);

    }, []);

    
    return (

            <div className="dividasshow">
                <div className="Ppagar" style={{background: color}}>
                    <span id="text1">Por Pagar</span>
                </div>

                <Slider {...settings}>
                    <div id="slider">
                        <div id="dividaspresent">
                            <p id="titlepresent" style={{color: color}}>Descrição da divida</p>

                            <span id="line" style={{borderColor: color}}></span>
                                
                                    {
                                    dividasNaoPagas.map(dividadiv =>{
                                        if(dividasNaoPagas.length ===0 ){
                                            return(
                                                <div id="descricaodiv">
                                                    <p id="titlepresent" style={{color: color}}>Não existem dividas!</p>
                                                </div> 
                                            );
                                        }
                                        else{
                                            return(
                                                <div id="descricaodiv">
                                                    <p><span id="text2" style={{color: color}}>Credor</span>{dividadiv.credorS}23</p>
                                                    <p><span id="text2" style={{color: color}}>Devedor</span>{dividadiv.devedorS}</p>
                                                    <p><span id="text2" style={{color: color}}>Valor a pagar</span>{dividadiv.quantia+"€"}</p>
                                                </div>
                                            );
                                        }
                                        
                                    })}
                                    
                            </div>
                        </div>
                    </Slider>

                <div className="Ppagar" style={{background: Pagocolor}} >
                    <span id="text1">Pago</span>
                </div>

                {/*desenhar aqueles 3 pontos*/}
                <Slider {...settings}>
                    <div id="slider">
                        <div id="dividaspresent">
                            <p id="titlepresent" style={{color: color}}>Descrição da divida</p>

                            <span id="line" style={{borderColor: color}}></span>
                                
                                    {
                                    dividasPagas.map(dividadiv =>{
                                        if(dividasPagas.length ===0 ){
                                            return(
                                                <p id="titlepresent" style={{color: color}}>Não existem dividas!</p>
                                            );
                                        }
                                        else{
                                            return(
                                                    <div id="descricaodiv">
                                                        <p><span id="text2" style={{color: color}}>Credor</span>{dividadiv.credorS}</p>
                                                        <p><span id="text2" style={{color: color}}>Devedor</span>{dividadiv.devedorS}</p>
                                                        <p><span id="text2" style={{color: color}}>Valor a pagar</span>{dividadiv.quantia+"€"}</p>
                                                    </div>
                                            );
                                        }
                                        
                                    })}
                                    
                            </div>
                    </div>
                </Slider>
        </div>
    );
}

export default DividasComponent;