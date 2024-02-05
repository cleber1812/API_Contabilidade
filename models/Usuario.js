const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) =>{
    const Usuario = sequelize.define("Usuario", {
        nome: Sequelize.STRING, 
        email: Sequelize.STRING, 
        senha: Sequelize.STRING,        
    })

    // Usuario.associate = (models) => {
    //     Usuario.hasMany(models.Lancamento, { foreignKey: 'fk_id_usuario', as: 'lancamentos' });
    // };

    return Usuario
}