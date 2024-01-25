const { Lancamento } = require('../models');


class LancamentosController {

    async listarLancamentos(req, res) {
        let lancamentos = await Lancamento.findAll();
        console.log(lancamentos);
        res.status(200).json(lancamentos);
    }

    async listarLancamento(req, res) {
        try {            
            let lancamentoResposta = await Lancamento.findByPk(req.params.id)
            if (!lancamentoResposta) {
                lancamentoResposta = {mensagem: "Lançamento não encontrado"};
            }
            console.log(lancamentoResposta);
            return res.status(200).json(lancamentoResposta);
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async inserirLancamento(req, res) {
        try {
            let lancamentoParaInserir = req.body
            console.log(lancamentoParaInserir);
            const lancamentoResultado = await Lancamento.create(lancamentoParaInserir)
            return res.status(200).json(lancamentoResultado);
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async atualizarLancamento(req, res) {
        try {
            let lancamentoUpdate = await Lancamento.findByPk(req.params.id);
            if (lancamentoUpdate) {
                await lancamentoUpdate.update(req.body);
                return res.status(200).json(lancamentoUpdate)
            }
            else {
                return res.status(200).json({mensagem:"Lançamento não encontrado"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async deletarLancamento(req, res) {
        try {
            let lancamentoDeletar = await Lancamento.findByPk(req.params.id);
            if (lancamentoDeletar) {
                await lancamentoDeletar.destroy();
                let mensag = ("lançamento deletado com sucesso");
                return res.status(200).json({lancamentoDeletar, mensag})
            }
            else {
                return res.status(200).json({mensagem:"Lançamento não encontrado"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }   

}

module.exports = new LancamentosController;
//Aqui ele é exportado como INSTANCIA por que é uma class
//module.exports = LancamentosController;