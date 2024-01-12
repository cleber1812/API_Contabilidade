const { Usuario } = require('../models');


class UsuariosController {

    async listarUsuarios(req, res) {
        let usuarios = await Usuario.findAll();
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
        try {
            let usuarioParaInserir = req.body
            console.log(usuarioParaInserir);
            const usuarioResultado = await Usuario.create(usuarioParaInserir)
            return res.status(200).json(usuarioResultado);
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