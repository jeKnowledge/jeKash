import '../style/css/LabelsInputs.css';

const LabelsInputs = (props) => {
    const title = props.title;
    const name = props.name;
    const type = props.type;
    const placeHolder = props.placeholder;
    const onChangeFunc = props.onChange;
    const valor = props.value;
    const size = props.size;
    const name_input = name.concat("input"); 

    if(size === "true"){
        return ( 
        <div className="labelInput">
            <div className="nome-apelido-label">
                <label className={name}>{ title }</label>
            </div>
            <div className="nome-apelido-input">
                <input
                    className={name_input}
                    name={name}
                    type = {type}
                    required
                    placeholder = {placeHolder}
                    onChange = {onChangeFunc}
                    value = {valor}
                />
            </div>
        </div>
     );
    }
    return ( 
        <div className="labelInput">
            <label>{ title }</label>
            <input
                name={name}
                type = {type}
                required
                placeholder = {placeHolder}
                onChange = {onChangeFunc}
                value = {valor}
            />
        </div>
    );

    
}
 
export default LabelsInputs;