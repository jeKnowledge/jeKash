import "../style/css/CriarDivida.css";

const Popup = ({ title, name1, name2, id1, id2, id3, button, func }) => {
  if (button) {
    return (
      <div className="popup">
        <div>
          <span className={name1} id={id1}></span>
          <span className={name2} id={id2}>
            {title}
          </span>
          <div className="div-buttons-popup" id={id3}>
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
      <span className={name1} id={id1}></span>
      <span className={name2} id={id2}>
        {title}
      </span>
    </div>
  );
};

export default Popup;
