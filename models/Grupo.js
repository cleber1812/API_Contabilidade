const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) =>{
    const Grupo = sequelize.define("Grupo", {
        grupo: Sequelize.INTEGER, 
        nome_grupo: Sequelize.STRING, 
        grupo_principal: Sequelize.INTEGER, 
        nome_grupo_principal: Sequelize.STRING, 
        fk_id_usuario: Sequelize.INTEGER,        
    })

    return Grupo
}