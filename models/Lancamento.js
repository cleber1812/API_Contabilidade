const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) =>{
    const Lancamento = sequelize.define("Lancamento", {
        fk_id_empresa: Sequelize.INTEGER, 
        data: Sequelize.DATE, 
        descricao: Sequelize.STRING,
        fk_id_conta_debito: Sequelize.INTEGER,
        fk_id_conta_credito: Sequelize.INTEGER,
        valor: Sequelize.FLOAT,
        fk_id_usuario: Sequelize.INTEGER        
    })
    return Lancamento
}