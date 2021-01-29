import { useReducer } from "react";
//import { DividaContext } from "../contexts/DividaContext";
import axios from 'axios';
import '../style/css/CriarDivida.css';

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
        
        /*axios("http://localhost:8000/dividas/", {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            data: divida
        })
            .then(() => console.log('Divida Criada'))
            .catch(err => {
                console.error(err);
        });*/
    }

    return ( 
        <div className="criar-divida" onSubmit={handleSubmit}>
            <div className="criar-divida-titulo">
                <h1>Cria uma nova dívida</h1>
            </div>
            <form>
                <label className="credor-css">Credor</label>
                    <input
                        className="input-credor"
                        name="credor"
                        type = "text"
                        required
                        placeholder = "exemplo@jeknowledge.pt"
                        onChange = {handleInputChange}
                        value = {divida.credor}
                    />
                <label className="devedor-css">Devedor</label>
                    <input
                        className="input-devedor"
                        name="devedor"
                        type = "text"
                        required
                        placeholder = "exemplo@jeknowledge.pt"
                        onChange = {handleInputChange}
                        value = {divida.devedor}
                    />
                <label className="quantia-css">Quantia</label>
                    <input
                        className="input-quantia"
                        name="quantia"
                        type = "number"
                        required
                        placeholder = "Quantia da dívida"
                        onChange = {handleInputChange}
                        value = {divida.quantia}
                    />
                <label className="descricao-css">Descrição</label>
                    <textarea
                        className="input-descricao"
                        name="descricao"
                        type = "text"
                        placeholder = "Descrição da dívida"
                        onChange = {handleInputChange}
                        value = {divida.descricao}
                    ></textarea>
                <button className="button-criar-divida" type="submit">Criar dívida</button>
            </form>
        </div>
     );
}
 
export default CriarDivida;
