const jwt = require('jsonwebtoken');
TokenNotFound.prototype = new Error();
// ! Pagina que verifica se o user esta logged in !


// Handling specific errors:

//* Caso não exista token throw this:
function TokenNotFound(){
    throw {
    name: 'Token Not Found Or Inexistent',
    message: 'Token inexistente ocorreu!'
  };
}


module.exports = (req,res,next) =>{
    
    try {
        /*
            console.log(tokenheader);
        * @param TokenNotFound Caso não exista token header throw a função acima do erro.
            console.log("Token: "+ token);
        */
        if(req.headers.authorization === null || req.headers.authorization===undefined){
            console.log("Desculpa algo correu mal, não estas logged in!");
            throw new TokenNotFound;
        }

        const tokenheader = req.headers.authorization; 
        const token = tokenheader.split(" ")[1];
        const decoded = jwt.verify(token,"secret");
        req.userData = decoded;
        //console.log(decoded);
        next();
    }
    catch (error) {

        if(error instanceof TokenNotFound){
            console.log("Desculpa algo correu mal, não fizeste login.");
        }
        else if (error instanceof TypeError){
            console.log("Desculpa algo correu mal, o teu login token não é válido.");
            //console.log("O teu tokenheader é: "+ tokenheader);
        }
        else{
            console.log(error)
        }
        

    } 
};