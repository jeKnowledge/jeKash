import { Link } from 'react-router-dom';


const Intro = () => {
    return ( 
        <div className="intro">
            <div className="title">
                <h1>jeKa$h</h1>
            </div>
            
            
            <div className="links">
                <Link to="users/login">Log in</Link><br></br>
                <Link to="users/signup">Registar</Link>
            </div>
        </div>
     );
}
 
export default Intro;