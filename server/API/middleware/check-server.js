module.exports = (req, res, next) => {
    try {
        //vou ler um header que e o server
        const pw = req.headers.server;
        //se esse header corresponder à nossa serverKey
        //quer dizer que sou o server!
        if (pw == process.env.LOCAL_SERVERKEY) {
            //prossigo
            next();
        } else {
            return res.status(401).json({
                //não consigo provar que sou o server, apresento um error message
                message: 'Not Permitted'
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: 'Not Permitted'
        });
    }
};