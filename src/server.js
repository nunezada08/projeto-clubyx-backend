import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import alternativasRoutes from './routes/alternativaRoute.js';
import equipesRoutes from './routes/equipeRoute.js';
import integrantesRoutes from './routes/integranteRoute.js';
import livroRoutes from './routes/livroRoutes.js';
import questaosRoutes from './routes/questaoRoute.js';
import simuladosRoutes from './routes/simuladoRoute.js';
import usuariosRoutes from './routes/usuarioRoute.js';
import conteudoRoutes from './routes/conteudoRoutes.js';
import autorRoutes from './routes/autorRoutes.js';
import { apiKey } from './lib/middlewares/APIkey.js';
import videosRoutes from './routes/videoRoute.js';

// FOTOS --------------------------------------------------
import fotoRouteLivro from './routes/fotoRouteLivro.js';
import fotoRouteUsuario from './routes/fotoRouteUsuarios.js';
import fotoRouteAutor from './routes/fotoRouteAutor.js';
import fotoRouteIntegrantes from './routes/fotoRouteIntegrantes.js';

// ARQUIVO ----------------------------------------------------
import arquivoAutorRoutes from './routes/arquivoAutorRoute.js';
import arquivoLivroRoutes from './routes/arquivoLivroRoute.js';
import arquivoIntegranteRoutes from './routes/arquivoIntegranteRoute.js';
import arquivoUsuarioRoutes from './routes/arquivoUsuarioRoute.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/alternativas', apiKey, alternativasRoutes);

app.use('/equipes', apiKey, equipesRoutes);

app.use('/integrantes', apiKey, integrantesRoutes);
app.use('/integrantes', apiKey, fotoRouteIntegrantes);

app.use('/livros', apiKey, livroRoutes);
app.use('/livros', apiKey, fotoRouteLivro);

app.use('/questoes', apiKey, questaosRoutes);

app.use('/simulados', apiKey, simuladosRoutes);

app.use('/usuarios', apiKey, usuariosRoutes);
app.use('/usuarios', apiKey, fotoRouteUsuario);

app.use('/conteudo', apiKey, conteudoRoutes);

app.use('/autor', apiKey, autorRoutes);
app.use('/autor', apiKey, fotoRouteAutor);

app.use('/videos', apiKey, videosRoutes);

app.use('/uploads', express.static('uploads'));

app.use('/arquivos/autor', apiKey, arquivoAutorRoutes);
app.use('/arquivos/livro', apiKey, arquivoLivroRoutes);
app.use('/arquivos/integrante', apiKey, arquivoIntegranteRoutes);
app.use('/arquivos/usuario', apiKey, arquivoUsuarioRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
