const { Router} = require('express');
const routes = Router();
const UsuariosController = require('../controller/usuariosController');
const EmpresasController = require('../controller/empresasController');
const ContasController = require('../controller/contasController');
const LancamentosController = require('../controller/lancamentosController');
const verificar = require('../middlewares/autenticacao');
//let dados = require('../dados/dados.json');

routes.get('/', (req, res) => {    
    res.status(200).json({mensagem: "Hellow 4"});
    
});

//routes.get('/usuarios', UsuariosController.listarUsuarios);
routes.get('/usuarios', UsuariosController.listarUsuarios);
routes.get('/usuario/:id', UsuariosController.listarUsuario);
routes.get('/meusdados', verificar(), UsuariosController.meusDados);
routes.post('/usuario', UsuariosController.inserirUsuario);
routes.post('/login', UsuariosController.login);
routes.put('/usuario/:id', UsuariosController.atualizarUsuario);
routes.delete('/usuario/:id', UsuariosController.deletarUsuario);

routes.get('/index', EmpresasController.index);
routes.get('/empresas', EmpresasController.listarEmpresas);
routes.get('/empresa/:id', EmpresasController.listarEmpresa);
routes.post('/empresa', EmpresasController.inserirEmpresa);
routes.post('/empresa2', EmpresasController.inserirEmpresa2);
routes.put('/empresa/:id', EmpresasController.atualizarEmpresa);
routes.delete('/empresa/:id', EmpresasController.deletarEmpresa);
//routes.delete('/empresa2/:id', verificar(), EmpresasController.deletarEmpresa2);
routes.delete('/empresa3', verificar(), EmpresasController.deletarEmpresa2);

routes.get('/contas', ContasController.listarContas);
routes.get('/conta/:id', ContasController.listarConta);
routes.post('/conta', ContasController.inserirConta);
routes.put('/conta/:id', ContasController.atualizarConta);
routes.delete('/conta/:id', ContasController.deletarConta);

routes.get('/lancamentos', LancamentosController.listarLancamentos);
routes.get('/lancamento/:id', LancamentosController.listarLancamento);
routes.post('/lancamento', LancamentosController.inserirLancamento);
routes.put('/lancamento/:id', LancamentosController.atualizarLancamento);
routes.delete('/lancamento/:id', LancamentosController.deletarLancamento);

module.exports = routes;