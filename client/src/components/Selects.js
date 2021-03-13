import "../style/css/Selects.css";
import "../style/css/font.css";
const Selects = ({
  title,
  name,
  placeHolder,
  onChange,
  value,
  option1,
  option2,
  option3,
}) => {
  return (
    <div className="SelectDepartments">
      <label>{title}</label>
      <select name={name} onChange={onChange} value={value}>
        <option value="false">{placeHolder}</option>
        <option value="Ino">{option1}</option>
        <option value="Int">{option2}</option>
        <option value="Tech">{option3}</option>
      </select>
    </div>
  );
};

export default Selects;
