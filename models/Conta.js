const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) =>{
    const Conta = sequelize.define("Contas", {
        fk_id_grupo: Sequelize.INTEGER,         
        subgrupo: Sequelize.INTEGER,
        elemento: Sequelize.INTEGER,
        conta: Sequelize.STRING,
        multiplicador: Sequelize.INTEGER,
        fk_id_usuario: Sequelize.INTEGER        
    });
    
    Conta.associate = (models) => {
        Conta.belongsTo(models.Grupo, { foreignKey: 'fk_id_grupo', as: 'grupo' });
        
        Conta.hasMany(models.Lancamento, { foreignKey: 'fk_id_conta_debito', as: 'lancamentosDebito' });
        Conta.hasMany(models.Lancamento, { foreignKey: 'fk_id_conta_credito', as: 'lancamentosCredito' });
    };

    return Conta
}