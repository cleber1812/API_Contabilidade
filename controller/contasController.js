const { Contas, Grupo } = require('../models');


class ContasController {

    // async listarContas(req, res) {
    //     let contas = await Contas.findAll({
    //         // attributes: ['id', 'conta'],
    //         order: [['conta']],
    //         }
    //     );
    //     // console.log(contas);
    //     res.status(200).json(contas);
    // }

    async planoContas(req, res) {
        let contas = await Contas.findAll({            
            // attributes: ['id', 'fk_id_grupo', 'subgrupo', 'elemento', 'conta'],
            include: [
                {
                    model: Grupo,    
                    as: 'grupo', // Use o alias que você configurou na associação                    
                    // attributes: ['nome_grupo_principal'],                        
                },
            ],
            group: ['Contas.id', 'grupo.id'], // Use o alias ao agrupar            
            order: [[{Model: Grupo}, 'grupo'], ['subgrupo'], ['elemento']],
            raw: true, // Retorna resultados como objetos JS em vez de instâncias de modelo Sequelize
            nest: true, // Agrupa os resultados aninhados
        });
        // console.log(contas);
        
        // res.status(200).json(contas);

                    // Transformar os resultados antes de enviar como resposta
                    const resultadosFormatados = contas.map(conta => ({
                        id: conta.id,
                        subgrupo: conta.subgrupo,
                        elemento: conta.elemento,
                        conta: conta.conta,
                        grupo_principal: conta.grupo.grupo_principal,
                        nome_grupo_principal: conta.grupo.nome_grupo_principal,
                        grupo: conta.grupo.grupo,
                        nome_grupo: conta.grupo.nome_grupo,
                    }));
        
                    res.status(200).json(resultadosFormatados);
    }

    async listarContas(req, res) {
        let contas = await Contas.findAll({            
            attributes: ['id', 'fk_id_grupo', 'subgrupo', 'elemento', 'conta'],
            include: [
                {
                    model: Grupo,    
                    as: 'grupo', // Use o alias que você configurou na associação                    
                    attributes: ['nome_grupo_principal'],                        
                },
            ],
            group: ['Contas.id', 'grupo.id'], // Use o alias ao agrupar
            order: [['conta']],
            raw: true, // Retorna resultados como objetos JS em vez de instâncias de modelo Sequelize
            nest: true, // Agrupa os resultados aninhados
        });
        // console.log(contas);
        
        // res.status(200).json(contas);

                    // Transformar os resultados antes de enviar como resposta
                    const resultadosFormatados = contas.map(conta => ({
                        id: conta.id,
                        fk_id_grupo: conta.fk_id_grupo,                        
                        subgrupo: conta.subgrupo,
                        elemento: conta.elemento,                        
                        conta: conta.conta,
                        nome_grupo_principal: conta.grupo.nome_grupo_principal,                        
                    }));
        
                    res.status(200).json(resultadosFormatados);
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