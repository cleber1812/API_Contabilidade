let express = require('express');
const router = express.Router();
let dados = require('../dados/usuarios.json');

router.get('/', (req, res) => {
    //res.status(200).json({"id":1, "nome": "cleber"})
    //res.statusCode = 200;
    //res.json(dados);
    res.status(200).json(dados)
})

module.exports = router;