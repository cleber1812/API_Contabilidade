const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) =>{
    const Grupo = sequelize.define("Grupo", {
        grupo: Sequelize.INTEGER, 
        nome_grupo: Sequelize.STRING, 
        fk_id_usuario: Sequelize.INTEGER,        
    })

    return Grupo
}