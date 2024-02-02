//import Empresa from '../models/Empresas';
const { Empresa, Lancamento } = require('../models');
//const { Usuario } = require('../models');

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
                }
            });

            return res.status(200).json(lancamentos);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro ao buscar lançamentos da empresa", error: error.message });
        }
    }

}

module.exports = new DashboardController;
//export default new DashboardController();