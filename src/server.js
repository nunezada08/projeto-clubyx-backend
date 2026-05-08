import express from 'express';
import 'dotenv/config';
import alternativasRoutes from './routes/alternativaRoute.js';
import equipesRoutes from './routes/equipeRoute.js';
import integrantesRoutes from './routes/integranteRoute.js';
import livroRoutes from './routes/livroRoutes.js'
import questaosRoutes from './routes/questaoRoute.js'
import simuladosRoutes from './routes/simuladoRoute.js'
import usuariosRoutes from './routes/usuarioRoute.js'
import conteudoRoutes from './routes/conteudoRoutes.js'
import autorRoutes from './routes/autorRoutes.js'
import { apiKey } from './lib/middlewares/APIkey.js';

// FOTOS --------------------------------------------------
import fotoRouteLivro from './routes/fotoRouteLivro.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/alternativas', apiKey, alternativasRoutes)

app.use('/equipes', apiKey, equipesRoutes);

app.use('/integrantes', apiKey, integrantesRoutes);

app.use('/livros', apiKey, livroRoutes);
app.use('/livro', apiKey, fotoRouteLivro);

app.use('/questoes', apiKey, questaosRoutes);

app.use('/simulados', apiKey, simuladosRoutes);

app.use('/', apiKey, usuariosRoutes);

app.use('/', apiKey, conteudoRoutes);

app.use('/', apiKey, autorRoutes);

app.use('/uploads', express.static('uploads'));



app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
