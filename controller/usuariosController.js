const { Usuario } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const Yup = require('yup');
const bcrypt = require('bcrypt');


class UsuariosController {

    /*ID do usuário está em : req.userId */
    async meusDados(req,res) {
        try {
            const pessoa_encontrada = await Usuario.findByPk(req.userId);
            if (pessoa_encontrada){
                console.log(req.userId);               
                return res.status(200).json(pessoa_encontrada);                
                }
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

        const schema = Yup.object().shape({            
            email: Yup.string().email().required(),
            senha: Yup.string().required(),
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        // let email = req.body.email;
        // let senha = req.body.senha;
        const { email, senha } = req.body;

        try {   

            // const pessoa_encontrada = await Usuario.findOne({
            //     attributes: ['id','nome', 'email','createdAt','updatedAt'],
            //     where: {
            //         [Op.and]: [
            //             {email: {[Op.eq]: email,}}, 
            //             {senha: {[Op.eq]: senha,}}
            //         ]
            //     }
            // });   
            
            const pessoa_encontrada = await Usuario.findOne({ where: { email } });

            if (!pessoa_encontrada) {
                return res.status(400).send('Usuário não encontrado');
            }

             // Comparar a senha fornecida com o hash armazenado
            const isMatch = await bcrypt.compare(senha, pessoa_encontrada.senha);

            if (!isMatch) {
                return res.status(400).send('Senha incorreta');
            }
            
            // Se a senha estiver correta, prosseguir com o login

            // if (pessoa_encontrada) {
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
            // } 
            // else 
            //     return res.status(200).json({mensagem: "Usuário ou senha inválidos"})                     
        }
        catch(err) {
            return res.status(400).json({error: err.message});        
        }
    }

    async forgotPassword(req,res) {
        
        const schema = Yup.object().shape({            
            email: Yup.string().email().required(),            
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        try {
            const email = req.body.email;
            // Verificar se o email foi fornecido e convertê-lo para minúsculas
            // if (!email) {
            //     return res.status(400).send('Insira um Email');
            // }
            
            const pessoa_encontrada = await Usuario.findOne({ where: { email } });

            if (!pessoa_encontrada) {
                return res.status(400).send('Email não encontrado');
            }            

                return res.status(200).json({                    
                    nome: pessoa_encontrada.nome, 
                    email,
                    id: pessoa_encontrada.id,
                    senha: pessoa_encontrada.senha
                });              
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
        
        const schema = Yup.object().shape({
            nome: Yup.string().min(4).required(),
            email: Yup.string().min(4).email().required(),
            senha: Yup.string().max(10).min(4).required(),
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        // let email = req.body.email;
        // const { nome, email, senha } = req.body;
        const { nome, senha } = req.body;
        const email = req.body.email.toLowerCase();  // Convertendo para minúsculas

        try {
            const pessoa_encontrada = await Usuario.findOne({
                // attributes: ['id', 'nome', 'email'],
                // where: {
                //     email: {[Op.eq]: email}
                // }
                where: { email }
            });
            if (!pessoa_encontrada) {
                
                // Hash da senha
                const hashedPassword = await bcrypt.hash(senha, 7);

                // const usuarioResultado = await Usuario.create(req.body);
                const usuarioResultado = await Usuario.create({ nome, email, senha: hashedPassword });
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

    async atualizarUsuario2(req, res) {

        const schema = Yup.object().shape({
            nome: Yup.string().min(4),
            email: Yup.string().email(),
            senha: Yup.string().max(10).min(4),
        });

        if(!(await schema.isValid(req.body))){
            return res.status(402).json({ error: 'Insira dados válidos.'})
        }
        
        try {
            const idUsuario = req.userId;
            // const { nome, email, senha } = req.body;
            const { nome, senha } = req.body;
            let email = req.body.email;

            // Verificar se o email foi fornecido e convertê-lo para minúsculas
            if (email) {
                email = email.toLowerCase();
            }
            
            let usuarioUpdate = await Usuario.findByPk(idUsuario);
            if (usuarioUpdate) {

                // Verificação de e-mail
                if(email) {
                    const pessoa_encontrada = await Usuario.findOne({ where: { email } })                    

                    if(pessoa_encontrada && pessoa_encontrada.id !==  idUsuario){
                        return res.status(401).json({mensagem: "Email já cadastrado"})
                    }                    
                }

                // Hash da nova senha, se fornecida
                if(senha) {                
                    const hashedPassword = await bcrypt.hash(senha, 7);
                    await usuarioUpdate.update({ nome, email, senha: hashedPassword });                    
                }
                else{
                    // await usuarioUpdate.update(req.body);
                    await usuarioUpdate.update({ nome, email });
                }

                return res.status(200).json(usuarioUpdate)
            }
            else {
                return res.status(201).json({mensagem:"Usuário não encontrado"})
            }
        }
        catch (err) {
            return res.status(404).json({error: err.message})
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