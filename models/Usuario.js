const sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) =>{
    const Usuario = sequelize.define("Usuario", {
        nome: Sequelize.STRING, 
        email: Sequelize.STRING, 
        senha: Sequelize.STRING,        
    })
    return Usuario
}