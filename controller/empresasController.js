const { Empresa } = require('../models');
const { Usuario } = require('../models');


class EmpresaController {

    async index(req,res){
        const { fk_id_usuario } = req.query;
        if (!fk_id_usuario) {
            let empresas = await Empresa.findAll();
            console.log(empresas);
            res.status(200).json(empresas);
        }
        else {
        //const empresas = await Empresa.find({ fk_id_usuario });
        //const empresas = await Empresa.findAll({ where: {fk_id_usuario: fk_id_usuario}});
        const empresas = await Empresa.findAll({ where: {fk_id_usuario}});
        res.status(200).json(empresas);
        console.log(fk_id_usuario)
        }
    }

    async listarEmpresas(req, res) {
        let empresas = await Empresa.findAll();
        console.log(empresas);
        res.status(200).json(empresas);
    }

    async listarEmpresa(req, res) {
        try {            
            let empresaResposta = await Empresa.findByPk(req.params.id)
            if (!empresaResposta) {
                empresaResposta = {mensagem: "Empresa não encontrada"};
            }
            console.log(empresaResposta);
            return res.status(200).json(empresaResposta);
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async inserirEmpresa(req, res) {
        try {
            let empresaParaInserir = req.body
            console.log(empresaParaInserir);
            const empresaResultado = await Empresa.create(empresaParaInserir)
            return res.status(200).json(empresaResultado);
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async inserirEmpresa2(req, res) {
        try {
            const { nome_empresa } = req.body
            // const { usuario } = req.headers
            const id = req.userId;
            console.log(id)
            const empresaResultado = await Empresa.create({
                fk_id_usuario: id,
                nome_empresa                
            })            
            return res.status(200).json(empresaResultado);
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async atualizarEmpresa(req, res) {
        try {
            let empresaUpdate = await Empresa.findByPk(req.params.id);
            if (empresaUpdate) {
                await empresaUpdate.update(req.body);
                return res.status(200).json(empresaUpdate)
            }
            else {
                return res.status(200).json({mensagem:"Empresa não encontrada"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async atualizarEmpresa2(req, res) {
        try {
            const pessoa_encontrada = await Usuario.findByPk(req.userId);
            let empresaUpdate = await Empresa.findByPk(req.params.id);

            if (String(pessoa_encontrada.id) !== String(empresaUpdate.fk_id_usuario))
            return res.status(401).json({error: "Não autorizado"}) 

            if (empresaUpdate) {
                await empresaUpdate.update(req.body);
                return res.status(200).json(empresaUpdate)
            }
            else {
                return res.status(200).json({mensagem:"Empresa não encontrada"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }

    async deletarEmpresa(req, res) {
        try {
            let empresaDeletar = await Empresa.findByPk(req.params.id);
            if (empresaDeletar) {
                await empresaDeletar.destroy();
                let mensag = ("empresa deletada com sucesso");
                return res.status(200).json({empresaDeletar, mensag})
            }
            else {
                return res.status(200).json({mensagem:"Empresa não encontrada"})
            }
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }  
    
    async deletarEmpresa2(req, res) {
        try {
            /*Esse pega o id do usuário através da função VERIFICAR, na rota */
            const pessoa_encontrada = await Usuario.findByPk(req.userId);
            /*Esse pega o id do usuário através do HEADERS */
            //const { usuario } = req.headers;
            /*Depois que pega o headers como usuário, salva em outra const */
            //const usuarioLogado = await Usuario.findByPk(usuario);                        
            /*Esse pega o id do empresa através da rota */            
            const empresaDeletar = await Empresa.findByPk(req.params.id);
            /*Esse pega o id da empresa através do params como query (sem ID depois da rota) */
            // const { id } = req.query;            
            // const empresaDeletar = await Empresa.findByPk(id);

            //console.log(usuario, empresaDeletar, pessoa_encontrada, usuarioLogado);
            // console.log(empresaDeletar, pessoa_encontrada);

            //if (usuarioLogado.id !== empresaDeletar.fk_id_usuario) 
            //if (String(usuarioLogado.id) !== String(empresaDeletar.fk_id_usuario))
            if (String(pessoa_encontrada.id) !== String(empresaDeletar.fk_id_usuario))
                return res.status(401).json({error: "Não autorizado"}) 


            //if (empresaDeletar) {
                await empresaDeletar.destroy();
                let mensag = ("empresa deletada com sucesso");
                return res.status(200).json({empresaDeletar, mensag})
            //}
            //else {
            //    return res.status(200).json({mensagem:"Empresa não encontrada"})
            //}
        }
        catch (err) {
            return res.status(400).json({error: err.message})
        }
    }   

}

module.exports = new EmpresaController;
//Aqui ele é exportado como INSTANCIA por que é uma class
//module.exports = LancamentosController;