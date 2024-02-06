// const { Lancamento, Usuario, Empresa, Contas } = require('../models');
const { Lancamento, Usuario, Empresa, Contas, sequelize } = require('../models'); // Certifique-se de incluir 'sequelize' na importação
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

    //Livro Diário

    async listarLancamentos2(req, res) {
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
                }
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
                    where: {conta: 'Fornecedores',},
                }, {
                    model: Contas,
                    as: 'contaCredito', // Substitua 'ContaCredito' pelo alias correto para a associação de crédito
                    required: false, // Alterado para false                    
                    where: {conta: 'Fornecedores',},                    
                }],            
                where: {
                    fk_id_empresa: empresaId,
                    data: {
                        [Op.between]: ['2023-01-01', '2024-12-31']                        
                    },
                    [Op.or]: [
                        { '$contaDebito.id$': { [Op.not]: null } }, // Excluir lançamentos sem contaDebito
                        { '$contaCredito.id$': { [Op.not]: null } } // Excluir lançamentos sem contaCredito
                    ],                                  
                },                
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

}

module.exports = new LancamentosController;
//Aqui ele é exportado como INSTANCIA por que é uma class
//module.exports = LancamentosController;