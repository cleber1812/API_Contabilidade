const jwt = require('jsonwebtoken');

let verificar = function verificarJWT() {
    return (req,res,next) => {
        let token = req.headers['authorization'];
        let tokens = token.split(' ');
        token = tokens[1];
        
        if (!token)
            return res.status(401).json({mensagem: "Não autorizado 1"});
        
        else {
            jwt.verify(token, process.env.ACCESS_SECRET, function(err,decoded) {
                if (err) return res.status(401).json({
                    auth: false,
                    mensagem: "Não autorizado 2"
                })
                req.userId = decoded.id;
                next()
            });
        }           
    }
}

module.exports = verificar;
