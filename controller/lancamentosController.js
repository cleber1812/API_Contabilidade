// const { Lancamento, Usuario, Empresa, Contas } = require('../models');
const { Lancamento, Usuario, Empresa, Contas, Grupo, sequelize } = require('../models'); // Certifique-se de incluir 'sequelize' na importação
const { Op } = require('sequelize');

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

    /*Nesta rota, o lançamento pega o ID em userID VERIFICAR() + id da empresa 
    na rota (params) e o restante do body. Só pode lançar na mesma empresa que ele criou*/
    async inserirLancamento2(req, res) {
        try {
            const pessoa_encontrada = await Usuario.findByPk(req.userId);
            const empresaLancar = await Empresa.findByPk(req.params.id); 
            //const fk_id_empresa = req.params.id;            
            /*Esta const foi criada apenas para pegar o ID da empresa e validar o id do usuário*/
            //const empresaLancar = await Empresa.findByPk(fk_id_empresa); 
            const {data, descricao, fk_id_conta_debito, fk_id_conta_credito, valor } = req.body;
            //const lancamentoParaInserir = req.body;            
            console.log(pessoa_encontrada, /*fk_id_empresa,*/ /*lancamentoParaInserir */);            

            if (String(pessoa_encontrada.id) !== String(empresaLancar.fk_id_usuario))
            return res.status(401).json({error: "Não autorizado"}) 

            //const lancamentoResultado = await Lancamento.create(lancamentoParaInserir)
            const lancamentoResultado = await Lancamento.create({
                fk_id_usuario: pessoa_encontrada.id,
              //  lancamentoParaInserir
              // fk_id_empresa,
                fk_id_empresa: empresaLancar.id,
                data, descricao, fk_id_conta_debito, fk_id_conta_credito, valor
            })
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