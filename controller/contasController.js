const { Contas } = require('../models');


class ContasController {

    async listarContas(req, res) {
        let contas = await Contas.findAll(
            // {attributes: ['id', 'conta',]}
        );
        // console.log(contas);
        res.status(200).json(contas);
    }

    async listarConta(req, res) {
        try {            
            let contaResposta = await Contas.findByPk(req.params.id)
            if (!contaResposta) {
                contaResposta = {mensagem: "Conta não encontrada"};
            }
            console.log(contaResposta);
            return res.status(200).json(contaResposta);
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async inserirConta(req, res) {
        try {
            let contaParaInserir = req.body
            console.log(contaParaInserir);
            const contaResultado = await Contas.create(contaParaInserir)
            return res.status(200).json(contaResultado);
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async atualizarConta(req, res) {
        try {
            let contaUpdate = await Contas.findByPk(req.params.id);
            if (contaUpdate) {
                await contaUpdate.update(req.body);
                return res.status(200).json(contaUpdate)
            }
            else {
                return res.status(200).json({mensagem:"Conta não encontrada"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async deletarConta(req, res) {
        try {
            let contaDeletar = await Contas.findByPk(req.params.id);
            if (contaDeletar) {
                await contaDeletar.destroy();
                let mensag = ("conta deletada com sucesso");
                return res.status(200).json({contaDeletar, mensag})
            }
            else {
                return res.status(200).json({mensagem:"Conta não encontrada"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }     

}

module.exports = new ContasController;
//Aqui ele é exportado como INSTANCIA por que é uma class
//module.exports = LancamentosController;