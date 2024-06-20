const { Lancamento, Usuario, Empresa, Contas, Grupo, sequelize } = require('../models'); // Certifique-se de incluir 'sequelize' na importação
const { Op } = require('sequelize');
const moment = require('moment');

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
        // const { id } = req.params;
        const id = req.userId;
        // console.log(id);
        // console.log(req.userId);

        // const user = await Usuario.findByPk(req.userId)
        // console.log(user);

        try {
            // Certifique-se de que o ID do usuário na rota seja um número
            // const userId = parseInt(id, 10);
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

            // Limita acesso apenas para as empresas do usuário
            let dadosEmpresa = await Empresa.findByPk(empresaId);            
            const idUsuario = req.userId;                                                
            if (idUsuario !== dadosEmpresa.fk_id_usuario) {     
                console.log(empresaId)    
                return res.status(401).json({error: "Não autorizado"}) 
            }

            // Buscar os lançamentos associadas à empresa
            const lancamentos = await Lancamento.findAll({
                attributes: [
                'id', 
                'fk_id_empresa',
                'data',
                'descricao',
                'fk_id_conta_debito',
                'fk_id_conta_credito',
                'valor',
                'fk_id_usuario',
                ],
                include: [
                    {
                        model: Contas,
                        as: 'contaDebito',
                        attributes: ['conta'],                        
                    },
                    {
                        model: Contas,
                        as: 'contaCredito',
                        attributes: ['conta'],                        
                    }
                ],
                where: {
                    fk_id_empresa: empresaId
                },
                order: [['data', 'DESC']],
                // raw: true, // Retorna resultados como objetos JS em vez de instâncias de modelo Sequelize
                // nest: true, // Agrupa os resultados aninhados
            });
            
            // return res.status(200).json(lancamentos);  
            
            // Transformar os resultados antes de enviar como resposta
            const resultadosFormatados = lancamentos.map(lancamento => ({
                id: lancamento.id,
                fk_id_empresa: lancamento.fk_id_empresa,
                // data: lancamento.data,
                // data: format(new Date(lancamento.data), 'dd/MM/yyyy'),
                // data: format(new Date(`${lancamento.data}T00:00:00Z`), 'dd/MM/yyyy', { timeZone: 'America/Sao_Paulo' }),
                // data: moment(lancamento.data).tz('America/Sao_Paulo').format('DD/MM/YYYY'),
                data: moment(lancamento.data).format('DD/MM/YYYY'),
                descricao: lancamento.descricao,
                contaDebito: lancamento.contaDebito.conta,
                contaCredito: lancamento.contaCredito.conta,
                valor: lancamento.valor,                
                fk_id_usuario: lancamento.fk_id_usuario,
            }));

            res.status(200).json(resultadosFormatados);

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

            //Limita acesso apenas para as empresas do usuário
            let dadosEmpresa = await Empresa.findByPk(empresaId);            
            const idUsuario = req.userId;                                                
            if (idUsuario !== dadosEmpresa.fk_id_usuario) {     
                console.log(empresaId)    
                return res.status(401).json({error: "Não autorizado"}) 
            }

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
                data: moment(lancamento.data).format('DD/MM/YYYY'),
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

            //Limita acesso apenas para as empresas do usuário
            let dadosEmpresa = await Empresa.findByPk(empresaId);            
            const idUsuario = req.userId;                                                
            if (idUsuario !== dadosEmpresa.fk_id_usuario) {     
                console.log(empresaId)    
                return res.status(401).json({error: "Não autorizado"}) 
            }
            
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
                    data: moment(lancamento.data).format('DD/MM/YYYY'),
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

    //BALANCO (Para consulta local usar FROM lancamentos (minúsculo) em COALESCE)

    async balanco(req, res) {
        try {
            const empresaId = req.params.fk_id_empresa; 
            // const startDate = req.query.startDate; // Você pode ajustar como recebe os parâmetros conforme necessário
            const startDate = new Date('2000-01-01'); // Você pode ajustar como recebe os parâmetros conforme necessário
            const endDate = req.query.endDate;            

            //Limita acesso apenas para as empresas do usuário
            let dadosEmpresa = await Empresa.findByPk(empresaId);            
            const idUsuario = req.userId;                                    
            // if (String(idUsuario) !== String(dadosEmpresa.fk_id_usuario))
            if (idUsuario !== dadosEmpresa.fk_id_usuario) {     
                console.log(empresaId)    
                return res.status(401).json({error: "Não autorizado"}) 
            }          
            
            // console.log(empresaId)

            // let whereClause = {};
            // if (startDate && endDate) {
            //     whereClause = {
            //         data: {
            //             [Op.between]: [startDate, endDate],
            //         },
            //     };
            // }

            //MODELOS DE CONSULTA AO BALANÇO
            // [sequelize.literal(`
            //             COALESCE((
            //                 SELECT SUM(lancamentosDebito.valor)
            //                 FROM Lancamentos AS lancamentosDebito
            //                 WHERE lancamentosDebito.fk_id_empresa = ${empresaId} 
            //                     AND lancamentosDebito.data < '${startDate}'
            //                     AND lancamentosDebito.fk_id_conta_debito = Contas.id
            //             ), 0)
            //             -
            //             COALESCE((
            //                 SELECT SUM(lancamentosCredito.valor)
            //                 FROM Lancamentos AS lancamentosCredito
            //                 WHERE lancamentosCredito.fk_id_empresa = ${empresaId}                            
            //                     AND lancamentosCredito.data < '${startDate}'
            //                     AND lancamentosCredito.fk_id_conta_credito = Contas.id
            //             ), 0)`),
            //             'saldoAnterior',                    
            //         ],

            //         [sequelize.literal(`
            //             COALESCE((                                
            //                 SELECT SUM(lancamentosDebito.valor)
            //                 FROM Lancamentos AS lancamentosDebito
            //                 WHERE
            //                     lancamentosDebito.fk_id_empresa = ${empresaId}                                        
            //                     AND lancamentosDebito.data BETWEEN '${startDate}' AND '${endDate}'
            //                     AND lancamentosDebito.fk_id_conta_debito = Contas.id
            //             ), 0)`),
            //             'valorD',
            //         ],

            //         [sequelize.literal(`
            //             COALESCE((                        
            //                 SELECT SUM(lancamentosCredito.valor)
            //                 FROM Lancamentos AS lancamentosCredito
            //                 WHERE lancamentosCredito.fk_id_empresa = ${empresaId}                            
            //                     AND lancamentosCredito.data BETWEEN '${startDate}' AND '${endDate}' 
            //                     AND lancamentosCredito.fk_id_conta_credito = Contas.id
            //                 ), 0)`),
            //             'valorC',                    
            //         ],
                    
            //         [sequelize.literal(`
            //             COALESCE((
            //                 SELECT SUM(lancamentosDebito.valor)
            //                 FROM Lancamentos AS lancamentosDebito
            //                 WHERE lancamentosDebito.fk_id_empresa = ${empresaId} 
            //                     AND lancamentosDebito.data BETWEEN '${startDate}' AND '${endDate}'
            //                     AND lancamentosDebito.fk_id_conta_debito = Contas.id
            //             ), 0)
            //             -
            //             COALESCE((
            //                 SELECT SUM(lancamentosCredito.valor)
            //                 FROM Lancamentos AS lancamentosCredito
            //                 WHERE lancamentosCredito.fk_id_empresa = ${empresaId}                            
            //                     AND lancamentosCredito.data BETWEEN '${startDate}' AND '${endDate}'
            //                     AND lancamentosCredito.fk_id_conta_credito = Contas.id
            //             ), 0)`),
            //             'valor',                    
            //         ],  

            const lancamentos = await Contas.findAll({
                attributes: [
                    'id', 'fk_id_grupo', 'subgrupo', 'elemento', 'conta',                    

                    [sequelize.literal(`
                        COALESCE((
                            SELECT SUM(lancamentosDebito.valor)
                            FROM Lancamentos AS lancamentosDebito
                            WHERE lancamentosDebito.fk_id_empresa = ${empresaId} 
                                AND lancamentosDebito.data <= '${endDate}'
                                AND lancamentosDebito.fk_id_conta_debito = Contas.id
                        ), 0)
                        -
                        COALESCE((
                            SELECT SUM(lancamentosCredito.valor)
                            FROM Lancamentos AS lancamentosCredito
                            WHERE lancamentosCredito.fk_id_empresa = ${empresaId}                            
                                AND lancamentosCredito.data <= '${endDate}'
                                AND lancamentosCredito.fk_id_conta_credito = Contas.id
                        ), 0)`),
                        'saldoAtual',                    
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
                        attributes: ['nome_grupo', 'grupo', 'grupo_principal', 'nome_grupo_principal'],                        
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
                    '$grupo.grupo$': { [Op.in]: [1, 2, 3, 4, 5] }, // Adicione esta linha para filtrar pelos grupos desejados
                },
                group: ['Contas.id', 'grupo.id'], // Use o alias ao agrupar
                // group: ['Contas.id'], // Use o alias ao agrupar
                order: [[{Model: Grupo}, 'grupo'], ['subgrupo'], ['elemento']],
                // order: [['subgrupo'], ['elemento']],
                raw: true, // Retorna resultados como objetos JS em vez de instâncias de modelo Sequelize
                nest: true, // Agrupa os resultados aninhados
            });

            // res.status(200).json(lancamentos);

            // Transformar os resultados antes de enviar como resposta
            const resultadosFormatados = lancamentos.map(lancamento => ({
                id: lancamento.id,
                grupo_principal: lancamento.grupo.grupo_principal,
                nome_grupo_principal: lancamento.grupo.nome_grupo_principal,
                grupo: lancamento.grupo.grupo,                
                subgrupo: lancamento.subgrupo,
                elemento: lancamento.elemento,
                nome_grupo: lancamento.grupo.nome_grupo,
                conta: lancamento.conta,
                // saldoAnterior: lancamento.saldoAnterior,
                // valor: lancamento.valor,
                // valorD: lancamento.valorD,
                // valorC: lancamento.valorC,
                // saldoAtual: lancamento.saldoAtual,
                saldoAtual: lancamento.grupo.grupo_principal === 2 ? lancamento.saldoAtual * -1 : lancamento.saldoAtual,
            }));

            res.status(200).json(resultadosFormatados);


        } catch (error) {
            console.error('Erro ao buscar lançamentos:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    //DRE  (Para consulta local usar FROM lancamentos)  (minúsculo)

    async dre(req, res) {
        try {
            const empresaId = req.params.fk_id_empresa;            
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;

            //Limita acesso apenas para as empresas do usuário
            let dadosEmpresa = await Empresa.findByPk(empresaId);            
            const idUsuario = req.userId;                                                
            if (idUsuario !== dadosEmpresa.fk_id_usuario) {     
                console.log(empresaId)    
                return res.status(401).json({error: "Não autorizado"}) 
            }
            
            const lancamentos = await Contas.findAll({
                attributes: [
                    'id', 'fk_id_grupo', 'subgrupo', 'elemento', 'conta',                    
                                        
                    [sequelize.literal(`
                        COALESCE((
                            SELECT SUM(lancamentosDebito.valor)
                            FROM Lancamentos AS lancamentosDebito
                            WHERE lancamentosDebito.fk_id_empresa = ${empresaId} 
                                AND lancamentosDebito.data < '${startDate}'
                                AND lancamentosDebito.fk_id_conta_debito = Contas.id
                        ), 0)
                        -
                        COALESCE((
                            SELECT SUM(lancamentosCredito.valor)
                            FROM Lancamentos AS lancamentosCredito
                            WHERE lancamentosCredito.fk_id_empresa = ${empresaId}                            
                                AND lancamentosCredito.data < '${startDate}'
                                AND lancamentosCredito.fk_id_conta_credito = Contas.id
                        ), 0)`),
                        'saldoAnterior',                    
                    ],

                    [sequelize.literal(`
                        COALESCE((                                
                            SELECT SUM(lancamentosDebito.valor)
                            FROM Lancamentos AS lancamentosDebito
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
                            FROM Lancamentos AS lancamentosCredito
                            WHERE lancamentosCredito.fk_id_empresa = ${empresaId}                            
                                AND lancamentosCredito.data BETWEEN '${startDate}' AND '${endDate}' 
                                AND lancamentosCredito.fk_id_conta_credito = Contas.id
                            ), 0)`),
                        'valorC',                    
                    ],
                    
                    [sequelize.literal(`
                        COALESCE((
                            SELECT SUM(lancamentosCredito.valor)
                            FROM Lancamentos AS lancamentosCredito
                            WHERE lancamentosCredito.fk_id_empresa = ${empresaId}                            
                                AND lancamentosCredito.data BETWEEN '${startDate}' AND '${endDate}'
                                AND lancamentosCredito.fk_id_conta_credito = Contas.id
                        ), 0)
                        -
                        COALESCE((                            
                            SELECT SUM(lancamentosDebito.valor)
                            FROM Lancamentos AS lancamentosDebito
                            WHERE lancamentosDebito.fk_id_empresa = ${empresaId} 
                                AND lancamentosDebito.data BETWEEN '${startDate}' AND '${endDate}'
                                AND lancamentosDebito.fk_id_conta_debito = Contas.id
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
                                    [Op.between]: [startDate, endDate],                                    
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
                                [Op.between]: [startDate, endDate],                                
                            }, 
                        },
                        required: false,
                    },   
                    {
                        model: Grupo,    
                        as: 'grupo', // Use o alias que você configurou na associação                    
                        attributes: ['nome_grupo', 'grupo', 'grupo_principal'],                        
                    },
                ],
                where: {                
                    [Op.or]: [
                        { '$lancamentosDebito.fk_id_conta_debito$': { [Op.not]: null } }, // Excluir lançamentos sem contaDebito
                        { '$lancamentosCredito.fk_id_conta_credito$': { [Op.not]: null } } // Excluir lançamentos sem contaCredito
                    ],
                    '$grupo.grupo$': { [Op.in]: [6, 7, 8] }, // Adicione esta linha para filtrar pelos grupos desejados
                },
                group: ['Contas.id', 'grupo.id'], // Use o alias ao agrupar                                
                order: [
                    // [{Model: Grupo}, 'grupo'], ['subgrupo'], ['elemento']
                    // [{ model: Grupo, as: 'grupo' }, 'grupo', 'DESC'], // Ordenar decrescente por 'grupo'
                    [{ Model: Grupo}, 'grupo', 'DESC'], // Ordenar decrescente por 'grupo'
                    ['subgrupo', 'ASC'], // Ordenar crescente por 'subgrupo'
                    ['elemento', 'ASC'], // Ordenar crescente por 'elemento'
                ],
                raw: true, // Retorna resultados como objetos JS em vez de instâncias de modelo Sequelize
                nest: true, // Agrupa os resultados aninhados
            });

            const resultadosFormatados = lancamentos.map(lancamento => ({
                id: lancamento.id,
                grupo_principal: lancamento.grupo.grupo_principal,
                grupo: lancamento.grupo.grupo,                
                subgrupo: lancamento.subgrupo,
                elemento: lancamento.elemento,
                nome_grupo: lancamento.grupo.nome_grupo,
                conta: lancamento.conta,
                saldoAnterior: lancamento.saldoAnterior,
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