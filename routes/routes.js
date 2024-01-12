const { Router} = require('express');
const routes = Router();
const LancamentosController = require('../controller/lancamentosController');
const UsuariosController = require('../controller/usuariosController');
const EmpresasController = require('../controller/empresasController');
//let dados = require('../dados/dados.json');

routes.get('/', (req, res) => {    
    res.status(200).json({mensagem: "Hellow 4"});
});

routes.get('/usuarios', UsuariosController.listarUsuarios);
routes.get('/usuario/:id', UsuariosController.listarUsuario);
routes.post('/usuario', UsuariosController.inserirUsuario);
routes.put('/usuario/:id', UsuariosController.atualizarUsuario);
routes.delete('/usuario/:id', UsuariosController.deletarUsuario);
routes.get('/empresas', EmpresasController.listarEmpresas);
routes.post('/empresas', EmpresasController.inserirEmpresa);
routes.get('/lancamentos', LancamentosController.listarLancamentos);

module.exports = routes;