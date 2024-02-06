//const sequelize = require("sequelize");
//const { Sequelize, DataTypes } = require("sequelize");
const { DataTypes } = require("sequelize");

// module.exports = (sequelize, Sequelize) =>{
module.exports = (sequelize) =>{
    const Lancamento = sequelize.define("Lancamento", {
        // fk_id_empresa: Sequelize.INTEGER, 
        // data: Sequelize.DATE, 
        // descricao: Sequelize.STRING,
        // fk_id_conta_debito: Sequelize.INTEGER,
        // fk_id_conta_credito: Sequelize.INTEGER,
        // valor: Sequelize.FLOAT,
        // fk_id_usuario: Sequelize.INTEGER, 
        // // Virtual para que não seja persistido no banco
        // valorDebitado: {type: DataTypes.VIRTUAL,},
        // valorCreditado: {type: DataTypes.VIRTUAL,}, 
        fk_id_empresa: DataTypes.INTEGER, 
        data: DataTypes.DATE, 
        descricao: DataTypes.STRING,
        fk_id_conta_debito: DataTypes.INTEGER,
        fk_id_conta_credito: DataTypes.INTEGER,
        valor: DataTypes.FLOAT,
        fk_id_usuario: DataTypes.INTEGER, 
        valorDebitado: { type: DataTypes.VIRTUAL },
        valorCreditado: { type: DataTypes.VIRTUAL },      
    })

    // Lancamento.associate = (models) => {
    //     Lancamento.belongsTo(models.Usuario, { foreignKey: 'fk_id_usuario', as: 'usuario' });
    // };

    Lancamento.associate = (models) => {
        // Associação com a tabela Conta para conta de débito
        Lancamento.belongsTo(models.Contas, { 
            foreignKey: 'fk_id_conta_debito', 
            as: 'contaDebito',
            subQuery: false, // Evita incluir todos os campos da tabela Conta 
        });

        // Associação com a tabela Conta para conta de crédito
        Lancamento.belongsTo(models.Contas, { 
            foreignKey: 'fk_id_conta_credito', 
            as: 'contaCredito',
            subQuery: false, // Evita incluir todos os campos da tabela Conta
         });

        // Associação com a tabela Usuario
        Lancamento.belongsTo(models.Usuario, { foreignKey: 'fk_id_usuario', as: 'usuario' });
    };

    return Lancamento
}