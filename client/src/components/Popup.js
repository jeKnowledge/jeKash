import "../style/css/CriarDivida.css";
import logoCerto from "../style/logo/circlelog.svg";
import "../style/css/font.css";

const Popup = ({ title, name1, name2, button, handleResp, hideClick }) => {
  if (button) {
    return (
      <div className="popup">
        <div className={name1}>
          <span className={name2}>{title}</span>
          <div className="div-buttons-popup">
            <button className="button-yes" onClick={handleResp("sim")}>
              Sim
            </button>
            <button className="button-no" onClick={handleResp("n")}>
              Não
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="popup" onClick={hideClick}>
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
