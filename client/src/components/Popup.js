import "../style/css/CriarDivida.css";
import "../style/css/font.css";

const Popup = ({ title, name1, name2, button, func }) => {
  if (button) {
    return (
      <div className="popup">
        <span className={name1}></span>
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
    );
  }
  return (
    <div className="popup">
      <span className={name1}></span>
      <span className={name2}>{title}</span>
    </div>
  );
};

export default Popup;
