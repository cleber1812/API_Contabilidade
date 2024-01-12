const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) =>{
    const Empresa = sequelize.define("Empresa", {
        nome_empresa: Sequelize.INTEGER,         
        fk_id_usuario: Sequelize.INTEGER        
    })
    return Empresa
}