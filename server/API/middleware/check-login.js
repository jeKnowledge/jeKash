const jwt = require("jsonwebtoken");
TokenNotFound.prototype = new Error();
// ! Pagina que verifica se o user esta logged in !

// Handling specific errors:

//* Caso não exista token throw this:
function TokenNotFound() {
  throw {
    name: "Token Not Found Or Inexistent",
    message: "Token inexistente ocorreu!",
  };
}

module.exports = (req, res, next) => {
  try {
    const url = req.url;
    const tokenheader = req.headers.authorization;
    // check if url is dividas/alldep
    if (
      req.headers.authorization === null ||
      req.headers.authorization === undefined ||
      req.headers.authorization === ""
    ) {
      console.log("Desculpa algo correu mal, não estas logged in!");
      throw new TokenNotFound();
    }
    if(url === "/"){
      if(req.headers.server === "true") {
        // verify the token
        const decoded = jwt.verify(tokenheader, process.env.SECRET_SV_KEY);
        if (decoded === process.env.LOCAL_SERVERKEY) {
          next();
          return;
        }
      }
      throw new TokenNotFound();
    }
    const token = tokenheader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_SV_KEY);
    console.log(decoded);
    req.userData = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenNotFound) {
      console.log("Desculpa algo correu mal, não fizeste login.");
    } else if (error instanceof TypeError) {
      console.log("Desculpa algo correu mal, o teu login token não é válido.");
      //console.log("O teu tokenheader é: "+ tokenheader);
    } else {
      console.log(error);
    }
    return res.status(401).json({
      message: "Not Permitted. Token invalido ou inexistente!",
    });
  }
};
