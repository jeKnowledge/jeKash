import '../style/css/LabelsInputs.css';

const LabelsInputs = (props) => {
    const title = props.title;
    const name = props.name;
    const type = props.type;
    const placeHolder = props.placeholder;
    const onChangeFunc = props.onChange;
    const valor = props.value;

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