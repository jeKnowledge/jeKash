import "../style/css/CriarDivida.css";

const Popup = ({ title, name1, name2, id1, id2, button }) => {
  if (button) {
    return (
      <div className="popup">
        <div>
          <span className={name1} id={id1}></span>
          <span className={name2} id={id2}>
            {title}
          </span>
        </div>
        <div className="buttons-popup">
          <button>Sim</button>
          <button>Não</button>
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
