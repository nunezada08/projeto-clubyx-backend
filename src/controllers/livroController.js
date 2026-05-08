import LivroModel from '../models/LivroModel.js';


export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, resumo, personagens, contextoHist, publicacao, autorId, foto } = req.body;

        if (!nome){
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }
        if (!resumo){
            return res.status(400).json({ error: 'O campo "resumo" é obrigatório!' });
        }
        if (!personagens){
            return res.status(400).json({ error: 'O campo "personagens" é obrigatório!' });
        }
        if (!contextoHist) {
            return res.status(400).json({ error: 'O campo "contextoHist" é obrigatório!' });
        }
        if (!publicacao) {
            return res.status(400).json({ error: 'O campo "publicacao" é obrigatório!' });
        }
        if (!autorId) {
            return res.status(400).json({ error: 'O campo "autorId" é obrigatório!' });
        }


        const livro = new LivroModel({ nome, resumo, personagens, contextoHist, publicacao, foto});
        const data = await livro.criar();

        return res.status(201).json({ message: 'Livro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o Livro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await LivroModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum livro encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar livros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const livro = await LivroModel.buscarPorId(parseInt(id));

        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado.' });
        }

        return res.status(200).json({ data: livro });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar livro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const livro = await LivroModel.buscarPorId(parseInt(id));

        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            livro.nome = req.body.nome;
        }
        if (req.body.resumo !== undefined) {
            livro.resumo = req.body.resumo;
        }
        if (req.body.personagens !== undefined) {
            livro.personagens = req.body.personagens;
        }
        if (req.body.contextoHist !== undefined) {
            livro.contextoHist = req.body.contextoHist;
        }
        if (req.body.publicacao !== undefined) {
            livro.publicacao = req.body.publicacao;
        }
        if (req.body.foto !== undefined) livro.foto = req.body.foto;

        const data = await livro.atualizar();

        return res.status(200).json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const livro = await LivroModel.buscarPorId(parseInt(id));

        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado para deletar.' });
        }

        await livro.deletar();

        return res.status(200).json({ message: `O registro "${livro.nome}" foi deletado com sucesso!`, deletado: livro });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
