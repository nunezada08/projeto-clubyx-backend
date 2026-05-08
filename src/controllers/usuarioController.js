import UsuarioModel from '../models/UsuarioModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, email, senha, foto } = req.body;

        if (!nome) {
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }

        if (!email) {
            return res.status(400).json({ error: 'O campo "email" é obrigatório!' });
        }
        if (!email.includes('@')) {
            return res
                .status(400)
                .json({ error: 'O campo "senha" precisa ter um @ (ex: joao@email.com) ' });
        }

        if (!senha) {
            return res.status(400).json({ error: 'O campo "senha" é obrigatório' });
        }

        const usuario = new UsuarioModel({ nome, email, senha });
        const data = await usuario.criar();

        return res.status(201).json({ message: 'Usuário criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o Usuário.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await UsuarioModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum Usuário encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Usuários.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        return res.status(200).json({ data: usuario });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar Usuário.' });
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

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            usuario.nome = req.body.nome;
        }
        if (req.body.email !== undefined) {
            usuario.email = req.body.email;
        }
        if (req.body.senha !== undefined) {
            usuario.senha = req.body.senha;
        }
        if (req.body.foto !== undefined) {
            usuario.foto = req.body.foto
        }

        const data = await usuario.atualizar();

        return res
            .status(200)
            .json({ message: `O Usuário "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Já existe um usuário com este email.' });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Usuário não encontrado para atualizar.' });
        }
        return res.status(500).json({ error: 'Erro ao atualizar Usuário.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado para deletar.' });
        }

        await usuario.deletar();

        return res.status(200).json({
            message: `O Usuário "${usuario.nome}" foi deletado com sucesso!`,
            deletado: usuario,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
};
