const { Usuario } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');


class UsuariosController {

    /*ID do usuário está em : req.userId */
    async meusDados(req,res) {
        try {
            const pessoa_encontrada = await Usuario.findByPk(req.userId);
            if (pessoa_encontrada)
                return res.status(200).json(pessoa_encontrada)                
            else
                return res.status(200).json({mensagem: "Pessoa não encontrada"}); 
        }
        catch(err){
            return res.status(400).json({error: err.message});
        }
    }

    /*Login é usado numa rota POST para enviar email e senha.
    O JWT devolve um token válido para ser usado em outras 
    rotas com o middleware VERIFICAR() */
    async login(req,res) {
        let email = req.body.email;
        let senha = req.body.senha;

        try {            
            const pessoa_encontrada = await Usuario.findOne({
                attributes: ['id','nome', 'email','createdAt','updatedAt'],
                where: {
                    [Op.and]: [
                        {email: {[Op.eq]: email,}}, 
                        {senha: {[Op.eq]: senha,}}
                    ]
                }
            });             

            if (pessoa_encontrada) {
                const token = jwt.sign(
                    {id: pessoa_encontrada.id},
                    process.env.ACCESS_SECRET, 
                    {expiresIn: 15000});

                return res.status(200).json({
                    auth: true,
                    token: token,
                    nome: pessoa_encontrada.nome, email, 
                    id: pessoa_encontrada.id,
                });  
            }                
            else 
                return res.status(200).json({mensagem: "Usuário ou senha inválidos"})                     
        }
        catch(err) {
            return res.status(400).json({error: err.message});        
        }
    }


    async listarUsuarios(req, res) {
        let usuarios = await Usuario.findAll({
            attributes: ['id','nome', 'email','createdAt']
        });
        console.log(usuarios);
        res.status(200).json(usuarios);
    }

    async listarUsuario(req, res) {
        try {            
            let usuarioResposta = await Usuario.findByPk(req.params.id)
            if (!usuarioResposta) {
                usuarioResposta = {mensagem: "Usuário não encontrado"};                
            }
            console.log(usuarioResposta);
            return res.status(200).json(usuarioResposta);
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async inserirUsuario(req, res) {
        let email = req.body.email;

        try {
            const pessoa_encontrada = await Usuario.findOne({
                attributes: ['id', 'nome', 'email'],
                where: {
                    email: {[Op.eq]: email}
                }
            });
            if (!pessoa_encontrada) {
                const usuarioResultado = await Usuario.create(req.body);
                return res.status(200).json(usuarioResultado);
            }
            else
                return res.status(401).json({mensagem: "Email já cadastrado"})
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async atualizarUsuario(req, res) {
        try {
            let usuarioUpdate = await Usuario.findByPk(req.params.id);
            if (usuarioUpdate) {
                await usuarioUpdate.update(req.body);
                return res.status(200).json(usuarioUpdate)
            }
            else {
                return res.status(200).json({mensagem:"Usuário não encontrado"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async deletarUsuario(req, res) {
        try {
            let usuarioDeletar = await Usuario.findByPk(req.params.id);
            if (usuarioDeletar) {
                await usuarioDeletar.destroy();
                let mensag = ("usuario deletado com sucesso");
                return res.status(200).json({usuarioDeletar, mensag})
            }
            else {
                return res.status(200).json({mensagem:"Usuário não encontrado"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

}

module.exports = new UsuariosController;
//Aqui ele é exportado como INSTANCIA por que é uma class
//module.exports = LancamentosController;