import express from 'express';
import 'dotenv/config';
import alternativasRoutes from './routes/alternativaRoute.js';
import equipesRoutes from './routes/equipeRoute.js';
import integrantesRoutes from './routes/integranteRoute.js';
import livroRoutes from './routes/livroRoutes.js'
import questaosRoutes from './routes/questaoRoute.js'
import simuladosRoutes from './routes/simuladoRoute.js'
import usuariosRoutes from './routes/usuarioRoute.js'
import livroRoutes from './routes/livroRoutes.js';
import conteudoRoutes from './routes/conteudoRoutes.js'
import autorRoutes from './routes/autorRoutes.js'
import { apiKey } from './lib/middlewares/APIkey.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/', apiKey, alternativasRoutes)

app.use('/', apiKey, equipesRoutes);

app.use('/', apiKey, integrantesRoutes);

app.use('/', apiKey, livroRoutes);

app.use('/', apiKey, questaosRoutes);

app.use('/', apiKey, simuladosRoutes);

app.use('/', apiKey, usuariosRoutes);

app.use('/', apiKey, conteudoRoutes);

app.use('/', apiKey, autorRoutes);



app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
