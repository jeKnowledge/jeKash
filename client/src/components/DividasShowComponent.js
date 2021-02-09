import '../style/css/DividasShowComponent.css'
import axios from "axios";

const DividasComponent = (props) => {
    const color =props.color;

    axios.get("http://localhost:8000/dividas/", { 
        params: {
            department: props.page
        }
     })
        .then((res) => {
            console.log('Dep found.');
            let dividas = res.data; //! todas as dividas do departamento.
        })

        .catch(err => {
            console.error(err);
        });

    return (
        <div className="dividasshow">
            <div className="Ppagar" style={{background: color}}>
                <span id="text">Por Pagar</span>
            </div>

            <div id="dividaspresent">
                <span id="titlepresent">Descrição da divida</span>
                {/*falta desenhar uma linha*/}
                <span id="BoldPresent">Credor</span>
                <span id="BoldPresent">Devedor</span>
                <span id="BoldPresent">Valor a pagar</span>
            </div>

            <div className="Ppagar" style={{background: color}} >
                <span id="text">Pago</span>
            </div>

            {/*desenhar aqueles 3 pontos*/}

            <div id="dividaspresent">
                <span id="titlepresent">Descrição da divida</span>
                {/*falta desenhar uma linha*/}
                <span id="BoldPresent">Credor</span>
                <span id="BoldPresent">Devedor</span>
                <span id="BoldPresent">Valor a pagar</span>
            </div>

            {/*desenhar aqueles 3 pontos*/}
        </div>
     );
}

export default DividasComponent;