import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

let listaProdutos = [];


const app = express();
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'Ch4v3S3cr3t4',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15
    }
}));

app.use(cookieParser());

function usuarioEstaAutenticado(requisicao, resposta, next){
    if(requisicao.session.usuarioAutenticado){
        next();
    }
    else{
        resposta.redirect ('/login.html');
    }
}
function cadastroProdutos(requisicao, resposta){
    const barras = requisicao.body.barras;
    const descricao = requisicao.body.descricao;
    const custo = requisicao.body.custo;
    const precovenda = requisicao.body.precovenda;
    const validade = requisicao.body.validade;
    const quantidade = requisicao.body.quantidade;
    const fabricante = requisicao.body.fabricante;

    if(barras && descricao && custo && precovenda && validade && quantidade && fabricante ){
            listaProdutos.push({
            barras: barras,
            descricao: descricao,
            custo: custo,
            precovenda: precovenda,
            validade: validade,
            quantidade: quantidade,
            fabricante: fabricante,
        });
        resposta.redirect('/listaProdutos');
    }
    else{
        resposta.write(`
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Produtos</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        
        <body>
            <link rel="stylesheet" href="estilo.css">
            <div class="container m-2">
                <legend>Cadastro de Produtos</legend>
                <form method="POST" action='/cadastroProdutos'>
                    <div class="boder form-row">
                        <div class="col-md-4 mb-3">
                            <label for="barras">Código de barras do produto</label>
                            <input type="text" class="form-control" id="barras" name="barras" placeholder="Código de barras"> required>`);
        if(barras == "")
        {
            resposta.write(`
                        <div class="alert alert-danger" role="alert">
                            Informe o Código de barras!
                        </div>
            `);
        }
        resposta.write(` 
                     </div>
                     <div class="col-md-4 mb-3">
                        <label for="descricao">Descrição do produto</label>
                        <input type="text" class="form-control" id="descricao" name="descricao" value="${descricao}" placeholder="Descrição do produto"
                              required>`);
        if(descricao == "")
        {
            resposta.write(` 
                        <div class="alert alert-danger" role="alert">
                             Informe a descrição do produto!
                        </div>`);
        }
        resposta.write(`
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="custo">Preço de custo</label>
                             <input type="text" class="form-control" id="custo" name="custo" value="${custo}" placeholder="Preço de custo"
                            required>`);
        if(custo == "")
        {
            resposta.write(`
                        <div class="alert alert-danger" role="alert">
                            Informe o preço de custo do produto!
                        </div>`);
        }
        resposta.write(`
                        </div>
                        <div class="col-md-4 mb-3">
                            <label for="precovenda">Preço de venda</label>
                            <input type="text" class="form-control" id="precovenda" name="precovenda" value="${precovenda}" placeholder="Preço de venda"
                            required>`);
        if(precovenda == "")
        {
            resposta.write(`
                        <div class="alert alert-danger" role="alert">
                            Informe o preço de venda do produto!
                        </div>`);
        }
        resposta.write(`
                         </div>
                
                         <div class="form-row">
                            <div class="col-md-6 mb-3">
                                <label for="validade">Data de validade</label>
                                 <input type="text" class="form-control" id="validade" name="validade" value="${validade}" placeholder="Validade do produto" required>`);
         if(validade == "")
        {
            resposta.write(`
                        <div class="alert alert-danger" role="alert">
                            Informe a validade do produto!
                        </div>`);
        }
        resposta.write(`
                    </div>

                        <div class="col-md-3 mb-3">
                            <label for="quantidade">Quantidade em estoque</label>
                            <input type="text" class="form-control" id="quantidade" name="quantidade" value="${quantidade}" placeholder="Quantidade em estoque" required>`);
        if(quantidade == "")
        {
            resposta.write(`
                        <div class="alert alert-danger" role="alert">
                            Informe a quantidade de produtos em estoque!
                        </div>`);
        }
        resposta.write(`
                         </div>
                             </div>
                            <div class="col-md-4 mb-2">
                                 <label for="fabricante">Nome do fabricante</label>
                                    <input type="text" class="form-control" id="fabricante" name="fabricante" value="${fabricante}" placeholder="Nome do fabricante"
                                     required>`);
        if(fabricante == "")
        {
            resposta.write(`
                        <div class="alert alert-danger" role="alert">
                            Informe o nome do fabricante!
                        </div>`);
        }
         resposta.write(`
                        </div>
                            <button class="btn btn-primary" type="submit">Finalizar Cadastro</button>
                            <a class="btn btn-secondary" href="/">Voltar</a>
                </form>
            </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
    </html>`);
            resposta.end();
    }
}

function autenticarUsuario(requisicao, resposta){
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'admin' && senha == '123'){
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(),{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else{
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Falha ao realizar login</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<a href="/login.html">Voltar</a>');
        if (requisicao.cookies.dataUltimoAcesso){
            resposta.write('<p>');
            resposta.write('Seu último acesso foi em ' + requisicao.cookies.dataUltimoAcesso);
            resposta.write('</p>');
        }
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
}
app.post('/login', autenticarUsuario);

app.get('/login', (req,resp)=>{
    resp.redirect('/login.html');
});

app.get('/logout', (req,resp)=>{
    req.session.destroy();
    resp.redirect('/login.html');
});

app.use(express.static(path.join(process.cwd(), 'publico')));

app.use(usuarioEstaAutenticado, express.static(path.join(process.cwd(), 'protegido')));

app.post('/cadastroProdutos', usuarioEstaAutenticado, cadastroProdutos);

app.get('/listaProdutos', usuarioEstaAutenticado, (req,resp)=>{
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Cadastro</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de Produtos</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Código de barras do produto</th>');
    resp.write('<th>Descrição do produto</th>');
    resp.write('<th>Preço de custo</th>');
    resp.write('<th>Preço de venda</th>');
    resp.write('<th>Data de validade</th>');
    resp.write('<th>Quantidade em estoque</th>');
    resp.write('<th>Nome do fabricante</th>');
    resp.write('</tr>');
    for (let i=0; i<listaProdutos.length; i++){
        resp.write('<tr>');
        resp.write(`<td>${listaProdutos[i].barras}`);
        resp.write(`<td>${listaProdutos[i].descricao}`);
        resp.write(`<td>${listaProdutos[i].custo}`);
        resp.write(`<td>${listaProdutos[i].precovenda}`);
        resp.write(`<td>${listaProdutos[i].validade}`);
        resp.write(`<td>${listaProdutos[i].quantidade}`);
        resp.write(`<td>${listaProdutos[i].fabricante}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('</body>');
    if (req.cookies.dataUltimoAcesso){
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});

app.listen(porta,host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})