const { Empresa } = require('../models');


class EmpresaController {

    async listarEmpresas(req, res) {
        let empresas = await Empresa.findAll();
        console.log(empresas);
        res.status(200).json(empresas);
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

}

module.exports = new EmpresaController;
//Aqui ele é exportado como INSTANCIA por que é uma class
//module.exports = LancamentosController;