//import Empresa from '../models/Empresas';
const { Empresa, Usuario } = require('../models');
//const { Usuario } = require('../models');

class DashboardController {

    async show(req,res) {
        const pessoa_encontrada = await Usuario.findByPk(req.userId);
        const empresas = await Empresa.findAll({ where: {
            fk_id_usuario: pessoa_encontrada.id}});
   
        console.log(pessoa_encontrada, empresas);       
       
        //return res.status(200).json({pessoa_encontrada, empresas});
        return res.status(200).json(empresas);
   
    }


}

module.exports = new DashboardController;
//export default new DashboardController();