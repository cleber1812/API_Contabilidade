let express = require('express');
const router = express.Router();
let dados = require('../dados/dados.json');

router.get('/', (req, res) => {
    res.statusCode = 200;
    res.json(dados);
})

module.exports = router;