const { Router} = require('express');
const routes = Router();
const UsuariosController = require('../controller/usuariosController');
const EmpresasController = require('../controller/empresasController');
const ContasController = require('../controller/contasController');
const LancamentosController = require('../controller/lancamentosController');
const DashboardController = require('../controller/dashboardController');
const verificar = require('../middlewares/autenticacao');
//let dados = require('../dados/dados.json');

routes.get('/', (req, res) => {    
    res.status(200).json({message: "Hellow 4"});
    //res.status(200).json("Hellow World");
});

routes.get('/hellow', (req, res) => {        
    res.status(200).json("Hellow World");    
});

//ROTAS INICIAIS
routes.post('/usuario', UsuariosController.inserirUsuario);
routes.post('/login', UsuariosController.login);

//ROTAS TESTES
routes.get('/usuarios', UsuariosController.listarUsuarios);
routes.get('/usuario/:id', UsuariosController.listarUsuario);
routes.get('/meusdados', verificar(), UsuariosController.meusDados);
// routes.put('/usuario/:id', UsuariosController.atualizarUsuario);
routes.put('/usuario', verificar(), UsuariosController.atualizarUsuario3);
routes.put('/alterarsenha', verificar(), UsuariosController.alterarsenha);
routes.delete('/usuario/:id', UsuariosController.deletarUsuario);
routes.get('/enviaremail', UsuariosController.enviarEmail);
routes.post('/esquecisenha', UsuariosController.esqueciSenha);
routes.post('/redefinirsenha/:token', UsuariosController.redefinirSenha);

routes.get('/index', EmpresasController.index);
routes.get('/empresas', EmpresasController.listarEmpresas);
routes.get('/empresa/:id', EmpresasController.listarEmpresa);

routes.get('/lancamentos', LancamentosController.listarLancamentos);
routes.get('/lancamento/:id', LancamentosController.listarLancamento);

routes.get('/contas', ContasController.listarContas);
routes.get('/conta/:id', ContasController.listarConta);
routes.post('/conta', ContasController.inserirConta);
routes.put('/conta/:id', ContasController.atualizarConta);
routes.delete('/conta/:id', ContasController.deletarConta);

//ROTAS VERIFICADAS
// routes.get('/dashboard', DashboardController.show);
// routes.get('/dashboard/:id', DashboardController.show);
// routes.get('/dashboard/:id', verificar(), DashboardController.show);
routes.get('/dashboard', verificar(), DashboardController.show);
// routes.post('/empresa', EmpresasController.inserirEmpresa);
routes.post('/empresa2', verificar(), EmpresasController.inserirEmpresa2);
// routes.put('/empresa/:id', EmpresasController.atualizarEmpresa);
routes.put('/empresa/:id', verificar(), EmpresasController.atualizarEmpresa2);
// routes.delete('/empresa/:id', EmpresasController.deletarEmpresa);
routes.delete('/empresa2/:id', verificar(), EmpresasController.deletarEmpresa2);

// routes.post('/lancamento', LancamentosController.inserirLancamento);
routes.post('/lancamento/:id', verificar(), LancamentosController.inserirLancamento2);
// routes.put('/lancamento/:id', LancamentosController.atualizarLancamento);
routes.put('/lancamento/:id', verificar(), LancamentosController.atualizarLancamento2);
// routes.delete('/lancamento/:id', LancamentosController.deletarLancamento);
routes.delete('/lancamento/:id', verificar(), LancamentosController.deletarLancamento2);

// routes.get('/lancamentosempresa/:fk_id_empresa', DashboardController.lancamentosEmpresa);
routes.get('/lancamentosempresa/:fk_id_empresa', verificar(), DashboardController.lancamentosEmpresa);
routes.get('/lancamentosempresapp/:fk_id_empresa', verificar(), DashboardController.lancamentosEmpresa2);

routes.get('/diarioempresa/:fk_id_empresa', verificar(), DashboardController.diario);
routes.get('/razaoempresa/:fk_id_empresa', verificar(), DashboardController.razao);
routes.get('/balanco/:fk_id_empresa', verificar(), DashboardController.balanco);
routes.get('/dre/:fk_id_empresa', verificar(), DashboardController.dre);


module.exports = routes;