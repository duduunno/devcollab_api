/* criar rotas para a entrada e saida de informaçoes */

import express from 'express';
import knexDB from './knex.js';
import cors from 'cors';
const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

app.get("/", (req,res) =>{
    res.send("estou funcionando !");
})

/* ROTA CRIAR USUARIO */
app.post ('/register', async (req, res) =>{
    const {nome, nome_usuario, cpf, data_nascimento, email, telefone, senha,tipo_user} = req.body
    const hash_password = await bcrypt.hash(senha,10);
    console.log(hash_password);

    await knexDB('usuarios').insert({nome, nome_usuario, cpf, data_nascimento, email, telefone, senha: hash_password,tipo_user});
    res.status(200).json('Conta Criada')
})

/*ROTA PARA LOGIN*/
app.post("/login", async (req,res) =>{
    const {email,senha} = req.body;
    const data = await knexDB("usuarios").select("*").where({email});

    if(!data) return res.status(400).json({"message": "Ops, algum dado foi digitado incorretamente !"});
    if(!email || !senha) return res.status(400).json({"message": "Dados preenchidos de forma incoreeta !"});
    if(!await bcrypt.compare(senha,data[0].senha)) return res.status(401).json({"message": "Email ou senha digitado incorretamente !"});

    console.log(data.id);

    const token = jwt.sign({
        id: data.id,
        nome: data.nome
    }, "peixe", { expiresIn: "24h" });

    res.status(200).json({
        "token" : token,
        "userId" : data[0].id
    });
})

/* ROTA PAGINA DO PERFIL DO USUARIO */
app.get ('/perfil/:id', async (req, res) =>{
    const {id} = req.params
    const perfil = await knexDB('usuarios')
            .select('usuarios.*', 'equipe.nome as nome_equipe', 'projetos.titulo as titulo_projeto')
            .leftJoin('equipe_membros', 'usuarios.id', 'equipe_membros.id_usuario')
            .leftJoin('equipe', 'equipe_membros.id_equipe', 'equipe.id')
            .leftJoin('projetos', 'usuarios.id', 'projetos.usuario_criador')
            .where('usuarios.id', id);

    res.status(200).json({perfil})
})

/* ROTA PAGINA DE CRIAR PROJETOS */

app.post ('/criarProjeto', async (req, res) =>{
    const { titulo, valor, descricao, usuario_criador } = req.body
    await knexDB('projetos').insert({titulo, valor, descricao})
    res.status(200).json('Projeto Criado')
})

app.get("/projetos",async (req,res) =>{
    const projetos = await knexDB("projetos").select("*");
    return res.status(200).json({"projects": projetos});
})

/* ROTA PAGINA DE MOSTRAR PRJETOS (CERTO) */ 
app.get ('/ProjetosCriados/', async (req, res) =>{
     const projs = await knexDB('projetos').select('id', 'valor', 'descricao')
     res.status(200).json({projs})
})

/* ROTA PAGINA MOSTRAR PROFISSIONAIS (CERTO) */
app.get('/profissionais/usuarios', async (req, res) =>{
    const profusuarios = await knexDB('usuarios').select('id')
    res.status(200).json({profusuarios})
})

/* ROTA PAGINA MOSTRAR EQUIPES (CERTO) */
app.get('/profissionais/equipes', async (req, res) =>{
    const profequipes = await knexDB('equipe').select('id')
    res.status(200).json({profequipes})
})

/* ROTA MOSTRAR EQUIPES DO USUARIO (CERTO) */
app.get('/minhasEquipes', async (req, res) =>{
    const minhaeqps = await knexDB('equipe').select('id')
    res.status(200).json({minhaeqps})
})

/* PARTE PROJETOS REALIZADOS (CERTO) */
app.get ('/projetosRealizados', async (req, res) =>{
    const projrealizados = await knexDB('projetos').select('id')
    res.status(200).json({projrealizados})
})



/* ROTA CRIAR EQUIPE */ 
app.post('/equipe', async (req, res) => {
    const { nome, usuario_criador_eq, ids_cadastro } = req.body;

        // Inserir a equipe e obter o ID gerado
        const id_equipe = await knexDB('equipe').insert({ nome, usuario_criador_eq });

        // Preparar os dados dos membros
        const membros = ids_cadastro.map(id_cadastro => ({ id_equipe, id_usuario: id_cadastro }));

        // Inserir os membros na tabela de associação equipe_membros
        await knexDB('equipe_membros').insert(membros);

        // Responder ao cliente com sucesso
        res.status(200).json('Equipe e membros adicionados com sucesso');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})