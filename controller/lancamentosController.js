const { Lancamento } = require('../models');


class LancamentosController {

    async listarLancamentos(req, res) {
        let lancamentos = await Lancamento.findAll();
        console.log(lancamentos);
        res.status(200).json(lancamentos);
    }

    async inserirLancamentos(req, res) {

    }

}

module.exports = new LancamentosController;
//Aqui ele é exportado como INSTANCIA por que é uma class
//module.exports = LancamentosController;