import { useReducer } from "react";
//import { DividaContext } from "../contexts/DividaContext";
import axios from 'axios';
import './style/css/CriarDivida.css';
import LabelsInputs from "./components/LabelsInputs";
import TopBar from './components/TopBar'

const initialState = {
    credor: "",
    devedor: "",
    quantia: "",
    descricao: "",
};


const dividaReducer = (divida, action) => {
    switch(action.type) {
        case "CHANGE":
            const {name,value} = action;
            return {...divida, [name]:value};
        default:
            return divida;
    }
}

// Stateless Functional COmponent
const CriarDivida = () => {
    const [divida, dispatch] = useReducer(dividaReducer, initialState);

    const handleInputChange = (e) => {
        const {name,value} = e.target;
        dispatch({type:"CHANGE",name,value});
      };

    const handleSubmit = (e) => {
        // impede que a pagina seja reloadada apos o clique no botao
        e.preventDefault();
        divida.quantia = parseFloat(divida.quantia)
        console.log(divida);

        axios.post("http://localhost:8000/dividas/", { divida })
          .then(() => console.log('Divida Criada'))
          .catch(err => {
            console.error(err);
          });
    
    }

    return (
        <div>
            <TopBar
            color ="normalTopBarCOLOR"
            height = "11vh" //parece ser 18 na sidebar (13% é o normal)
            linkto="/home"
            logo = "normal"
            />

            <form className="criar-divida" onSubmit={handleSubmit}>
            <div className="criar-divida-titulo">
                <h1>Cria uma nova dívida</h1>
            </div>
            <div className="credor-css">
                <LabelsInputs 
                    title = "Credor"
                    name="credor"
                    type = "text"
                    placeholder = "exemplo@jeknowledge.pt"
                    onChange = {handleInputChange}
                    value = {divida.credor}
                />
            </div>
            <div className="devedor-css">
                <LabelsInputs 
                    title = "Devedor"
                    name="devedor"
                    type = "text"
                    placeholder = "exemplo@jeknowledge.pt"
                    onChange = {handleInputChange}
                    value = {divida.devedor}
                />
            </div>
            <div className="quantia-css">
                <LabelsInputs 
                    title = "Quantia"
                    name="quantia"
                    type = "number"
                    placeholder = "Quantia da dívida"
                    onChange = {handleInputChange}
                    value = {divida.quantia}
                />
            </div>
            <div className="descricao-css">
                <label className="descricao-label">Descrição</label>
                    <textarea
                        className="input-descricao"
                        name="descricao"
                        type = "text"
                        placeholder = "Descrição da dívida"
                        onChange = {handleInputChange}
                        value = {divida.descricao}
                    ></textarea>
                <button className="button-criar-divida" type="submit">Criar dívida</button>
            </div>
        </form>

        </div>
        
     );
}
 
export default CriarDivida;
