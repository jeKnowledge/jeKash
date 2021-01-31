import '../style/css/Selects.css'
const Selects = (props) => {

    const label = props.title;
    const name = props.name;
    const placeHolder = props.placeholder;
    const onChangeFunc = props.onChange;
    const valor = props.value;
    const option1 = props.option1;
    const option2 = props.option2; 
    const option3 = props.option3;  
    




    return (
        <div className="SelectDepartments">
        <label>{ label }</label>
            <select name={name} onChange={onChangeFunc} value={valor}>
                <option value="false">{placeHolder}</option>
                <option value={option1}>{option1}</option>
                <option value={option2}>{option2}</option>
                <option value={option3}>{option3}</option>
                </select>
        </div>
     );
}

export default Selects;