import "../style/css/CriarDivida.css";
import logoCerto from "../style/logo/circlelog.svg";

const Popup = ({ title, name1, name2, button, func }) => {
  if (button) {
    return (
      <div className="popup">
        <div className={name1}>
          <span className={name2}>{title}</span>
          <div className="div-buttons-popup">
            <button className="button-yes" onClick={() => func("sim")}>
              Sim
            </button>
            <button className="button-no" onClick={() => func("nao")}>
              Não
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="popup">
      <div className={name1}>
         <span className={name2}>{title}</span>

         <div className="circle-div">
          <img src={logoCerto} className="circle" alt="logoright">
          </img>
        </div>
      </div>
    </div>
  );
};

export default Popup;
