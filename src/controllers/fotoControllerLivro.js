import LivroModel from '../models/LivroModel.js';
import fs from 'fs';
import { processarFoto, removerFoto } from '../utils/fotoHelper.js';

export const uploadFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
        }

        const { id } = req.params;

        if (isNaN(id))
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });

        const livro = await LivroModel.buscarPorId(parseInt(id));
        if (!livro) {
            removerFoto(req.file.path);
            return res.status(404).json({ error: 'Registro do livro não encontrado.' });
        }

        if (livro.foto) {
            await fs.unlink(livro.foto).catch(() => {});
        }

        livro.foto = await processarFoto(req.file.path);
        await livro.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: livro.foto });
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro da foto.' });
    }
};

export const verFoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const livro = await LivroModel.buscarPorId(parseInt(id));

        if (!livro) {
            return res.status(404).json({ error: 'Registro do livro não encontrado.' });
        }

        if (!livro.foto) {
            return res.status(404).json({ error: 'Foto do livro não encontrada.' });
        }

        return res.sendFile(livro.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar foto do livro:', error);
        return res.status(500).json({ error: 'Erro ao buscar foto do livro.' });
    }
};
