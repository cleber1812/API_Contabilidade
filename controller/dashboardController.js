const { Lancamento, Usuario, Empresa, Contas, Grupo, sequelize } = require('../models'); // Certifique-se de incluir 'sequelize' na importação
const { Op } = require('sequelize');

class DashboardController {

    // async show(req,res) {
    //     const pessoa_encontrada = await Usuario.findByPk(req.userId);
    //     const empresas = await Empresa.findAll({ where: {
    //         fk_id_usuario: pessoa_encontrada.id}});
   
    //     console.log(pessoa_encontrada, empresas);       
       
    //     //return res.status(200).json({pessoa_encontrada, empresas});
    //     return res.status(200).json(empresas);
   
    // }

    async show(req, res) {
        const { id } = req.params;

        try {
            // Certifique-se de que o ID do usuário na rota seja um número
            const userId = parseInt(id, 10);

            // Verificar se o ID do usuário na rota é válido
            if (isNaN(userId)) {
                return res.status(400).json({ mensagem: "ID do usuário inválido" });
            }

            // Buscar as empresas associadas ao usuário
            const empresas = await Empresa.findAll({
                where: {
                    fk_id_usuario: userId
                }
            });

            return res.status(200).json(empresas);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro ao buscar empresas", error: error.message });
        }
    }

    async lancamentosEmpresa(req, res) {
        const { fk_id_empresa } = req.params;

        try {
            // Certifique-se de que o ID da empresa na rota seja um número
            const empresaId = parseInt(fk_id_empresa, 10);

            // Verificar se o ID da empresa na rota é válido
            if (isNaN(empresaId)) {
                return res.status(400).json({ mensagem: "ID da empresa inválido" });
            }

            // Buscar os lançamentos associadas à empresa
            const lancamentos = await Lancamento.findAll({
                where: {
                    fk_id_empresa: empresaId
                },
                order: [['data']],
            });

            return res.status(200).json(lancamentos);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro ao buscar lançamentos da empresa", error: error.message });
        }        
    }

    //Livro Diário

    async diario(req, res) {
        try {
            const empresaId = req.params.fk_id_empresa;
            const startDate = req.query.startDate; // Você pode ajustar como recebe os parâmetros conforme necessário
            const endDate = req.query.endDate;

            let whereClause = {};
            if (startDate && endDate) {
                whereClause = {
                    data: {
                        [Op.between]: [startDate, endDate],
                    },
                };
            }

            const lancamentos = await Lancamento.findAll({
                attributes: ['id', 'data', 'descricao', 'valor'],
                include: [
                    {
                        model: Contas,
                        as: 'contaDebito',
                        attributes: ['conta'],
                        // where: { id: Sequelize.literal('Lancamento.fk_id_conta_debito') }
                        // where: { id: Sequelize.col('Lancamento.fk_id_conta_debito') }
                    },
                    {
                        model: Contas,
                        as: 'contaCredito',
                        attributes: ['conta'],
                        // where: { id: Sequelize.col('Lancamento.fk_id_conta_credito') }
                    },
                    {
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['nome'],
                    }
                ],
                where: {
                    fk_id_empresa: empresaId,
                    // data: {
                    //     // [Op.between]: ['2023-04-01', '2024-12-31']
                    //     [Op.between]: [startDate, endDate]
                    // }
                    ...whereClause,
                },
                order: [['data']],
            });

            // res.status(200).json(lancamentos);

            // Transformar os resultados antes de enviar como resposta
            const resultadosFormatados = lancamentos.map(lancamento => ({
                id: lancamento.id,
                data: lancamento.data,
                descricao: lancamento.descricao,
                valor: lancamento.valor,
                contaDebito: lancamento.contaDebito.conta,
                contaCredito: lancamento.contaCredito.conta,
                usuario: lancamento.usuario.nome,
            }));

            res.status(200).json(resultadosFormatados);


        } catch (error) {
            console.error('Erro ao buscar lançamentos:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    //Livro Razão
    async razao(req, res) {
        try {
            const empresaId = req.params.fk_id_empresa;
            const startDate = req.query.startDate; // Você pode ajustar como recebe os parâmetros conforme necessário
            const endDate = req.query.endDate;
            const contaConsultada = req.query.contaConsultada;
            
            const lancamentos = await Lancamento.findAll({
                attributes: [
                    'id', 
                    'data', 
                    'descricao', 
                    [sequelize.literal('CASE WHEN `fk_id_conta_debito` = `contaDebito`.`id` THEN `valor` ELSE 0 END'), 'valorDebitado'],
                    [sequelize.literal('CASE WHEN `fk_id_conta_credito` = `contaCredito`.`id` THEN `valor` ELSE 0 END'), 'valorCreditado']
                ],   
                include: [{
                    model: Contas,
                    as: 'contaDebito', // Substitua 'ContaDebito' pelo alias correto para a associação de débito
                    required: false, // Alterado para false                    
                    // where: {conta: 'Fornecedores',},
                    where: {conta: contaConsultada},
                }, {
                    model: Contas,
                    as: 'contaCredito', // Substitua 'ContaCredito' pelo alias correto para a associação de crédito
                    required: false, // Alterado para false                    
                    // where: {conta: 'Fornecedores',},
                    where: {conta: contaConsultada},                    
                }],            
                where: {
                    fk_id_empresa: empresaId,
                    data: {
                        // [Op.between]: ['2023-01-01', '2024-12-31']                        
                        [Op.between]: [startDate, endDate]
                    },                    
                    [Op.or]: [
                        { '$contaDebito.id$': { [Op.not]: null } }, // Excluir lançamentos sem contaDebito
                        { '$contaCredito.id$': { [Op.not]: null } } // Excluir lançamentos sem contaCredito
                    ],                                                     
                },
                order: [['data']],                
                raw: true, // Retorna resultados como objetos simples
            });

            // res.status(200).json(lancamentos);

            // Mapear e filtrar os campos desejados
            const resultadoFiltrado = lancamentos.map(lancamento => {
                return {
                    id: lancamento.id,
                    data: lancamento.data,
                    descricao: lancamento.descricao,
                    valorDebitado: lancamento.valorDebitado,
                    valorCreditado: lancamento.valorCreditado
                };
            });
            res.status(200).json(resultadoFiltrado);

        } catch (error) {
            console.error('Erro ao buscar lançamentos:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    //BALANCO

    async balanco(req, res) {
        try {
            const empresaId = req.params.fk_id_empresa;            
            const startDate = req.query.startDate; // Você pode ajustar como recebe os parâmetros conforme necessário
            const endDate = req.query.endDate;
            // console.log(empresaId)

            // let whereClause = {};
            // if (startDate && endDate) {
            //     whereClause = {
            //         data: {
            //             [Op.between]: [startDate, endDate],
            //         },
            //     };
            // }

            const balanco = await Contas.findAll({
                attributes: [
                    'id', 'fk_id_grupo', 'subgrupo', 'elemento', 'conta',                    
                                        
                    [sequelize.literal(`
                        COALESCE((                                
                            SELECT SUM(lancamentosDebito.valor)
                            FROM lancamentos AS lancamentosDebito
                            WHERE
                                lancamentosDebito.fk_id_empresa = ${empresaId}                                        
                                AND lancamentosDebito.data BETWEEN '${startDate}' AND '${endDate}'
                                AND lancamentosDebito.fk_id_conta_debito = Contas.id
                        ), 0)`),
                        'valorD',
                    ],

                    [sequelize.literal(`
                        COALESCE((                        
                            SELECT SUM(lancamentosCredito.valor)
                            FROM lancamentos AS lancamentosCredito
                            WHERE lancamentosCredito.fk_id_empresa = ${empresaId}                            
                                AND lancamentosCredito.data BETWEEN '${startDate}' AND '${endDate}' 
                                AND lancamentosCredito.fk_id_conta_credito = Contas.id
                            ), 0)`),
                        'valorC',                    
                    ],
                    
                    [sequelize.literal(`
                        COALESCE((
                            SELECT SUM(lancamentosDebito.valor)
                            FROM lancamentos AS lancamentosDebito
                            WHERE lancamentosDebito.fk_id_empresa = ${empresaId} 
                                AND lancamentosDebito.data BETWEEN '${startDate}' AND '${endDate}'
                                AND lancamentosDebito.fk_id_conta_debito = Contas.id
                        ), 0)
                        -
                        COALESCE((
                            SELECT SUM(lancamentosCredito.valor)
                            FROM lancamentos AS lancamentosCredito
                            WHERE lancamentosCredito.fk_id_empresa = ${empresaId}                            
                                AND lancamentosCredito.data BETWEEN '${startDate}' AND '${endDate}'
                                AND lancamentosCredito.fk_id_conta_credito = Contas.id
                        ), 0)`),
                        'valor',                    
                    ],                    
                ],
                include: [ 
                    {
                        model: Lancamento,
                        as: 'lancamentosDebito',
                        attributes: ['valor', 'fk_id_conta_debito'],
                        where: {
                            fk_id_empresa: empresaId,
                                data: {
                                    // [Op.between]: ['2023-01-01', '2024-12-31'],
                                    [Op.between]: [startDate, endDate],
                                    // ...whereClause,
                                },                                         
                        },                        
                        required: false,
                    }, 
                    {
                        model: Lancamento,
                        as: 'lancamentosCredito',
                        attributes: ['valor', 'fk_id_conta_credito'],
                        where: {
                            fk_id_empresa: empresaId,
                            data: {
                                // [Op.between]: ['2023-01-01', '2024-12-31'],
                                [Op.between]: [startDate, endDate],
                                // ...whereClause,                            
                            }, 
                        },
                        required: false,
                    },   
                    {
                        model: Grupo,    
                        as: 'grupo', // Use o alias que você configurou na associação                    
                        attributes: ['nome_grupo', 'grupo'],                        
                    },
                ],
                where: {
                //     fk_id_empresa: empresaId,                    
                //     data: {
                //         [Op.between]: ['2023-04-01', '2024-12-31']
                //         // [Op.between]: [startDate, endDate]
                //     },
                //     // ...whereClause,
                [Op.or]: [
                    { '$lancamentosDebito.fk_id_conta_debito$': { [Op.not]: null } }, // Excluir lançamentos sem contaDebito
                    { '$lancamentosCredito.fk_id_conta_credito$': { [Op.not]: null } } // Excluir lançamentos sem contaCredito
                ],
                
                },
                group: ['Contas.id', 'grupo.id'], // Use o alias ao agrupar
                // group: ['Contas.id'], // Use o alias ao agrupar
                order: [[{Model: Grupo}, 'grupo'], ['subgrupo'], ['elemento']],
                // order: [['subgrupo'], ['elemento']],
                raw: true, // Retorna resultados como objetos JS em vez de instâncias de modelo Sequelize
                nest: true, // Agrupa os resultados aninhados
            });

            // res.status(200).json(balanco);

            // Transformar os resultados antes de enviar como resposta
            const resultadosFormatados = balanco.map(lancamento => ({
                id: lancamento.id,
                grupo: lancamento.grupo.grupo,                
                subgrupo: lancamento.subgrupo,
                elemento: lancamento.elemento,
                nome_grupo: lancamento.grupo.nome_grupo,
                conta: lancamento.conta,
                valor: lancamento.valor,
                valorD: lancamento.valorD,
                valorC: lancamento.valorC,
            }));

            res.status(200).json(resultadosFormatados);


        } catch (error) {
            console.error('Erro ao buscar lançamentos:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

}

module.exports = new DashboardController;
//export default new DashboardController();