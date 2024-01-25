const { Empresa } = require('../models');


class EmpresaController {

    async listarEmpresas(req, res) {
        let empresas = await Empresa.findAll();
        console.log(empresas);
        res.status(200).json(empresas);
    }

    async listarEmpresa(req, res) {
        try {            
            let empresaResposta = await Empresa.findByPk(req.params.id)
            if (!empresaResposta) {
                empresaResposta = {mensagem: "Empresa não encontrada"};
            }
            console.log(empresaResposta);
            return res.status(200).json(empresaResposta);
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async inserirEmpresa(req, res) {
        try {
            let empresaParaInserir = req.body
            console.log(empresaParaInserir);
            const empresaResultado = await Empresa.create(empresaParaInserir)
            return res.status(200).json(empresaResultado);
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async atualizarEmpresa(req, res) {
        try {
            let empresaUpdate = await Empresa.findByPk(req.params.id);
            if (empresaUpdate) {
                await empresaUpdate.update(req.body);
                return res.status(200).json(empresaUpdate)
            }
            else {
                return res.status(200).json({mensagem:"Empresa não encontrada"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async deletarEmpresa(req, res) {
        try {
            let empresaDeletar = await Empresa.findByPk(req.params.id);
            if (empresaDeletar) {
                await empresaDeletar.destroy();
                let mensag = ("empresa deletada com sucesso");
                return res.status(200).json({empresaDeletar, mensag})
            }
            else {
                return res.status(200).json({mensagem:"Empresa não encontrada"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }   

}

module.exports = new EmpresaController;
//Aqui ele é exportado como INSTANCIA por que é uma class
//module.exports = LancamentosController;