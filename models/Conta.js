const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) =>{
    const Conta = sequelize.define("Contas", {
        fk_id_grupo: Sequelize.INTEGER,         
        subgrupo: Sequelize.INTEGER,
        elemento: Sequelize.INTEGER,
        conta: Sequelize.STRING,
        multiplicador: Sequelize.INTEGER,
        fk_id_usuario: Sequelize.INTEGER        
    })
    return Conta
}