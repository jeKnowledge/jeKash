import '../style/css/Buttons.css'
import "../style/css/font.css";


const Buttons = (props) => {
    const name =props.name;
    const className = props.title;
    const type = props.type;  

    return (
        <div className="buttons">
            <button className={className} type={type}>{name}</button>
        </div>
     );
}

export default Buttons;