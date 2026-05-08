import UsuarioModel from '../models/UsuarioModel.js';
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

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));
        if (!usuario) {
            removerFoto(req.file.path);
            return res.status(404).json({ error: 'Registro do usuario não encontrado.' });
        }

        if (usuario.foto) {
            await fs.unlink(usuario.foto).catch(() => {});
        }

        usuario.foto = await processarFoto(req.file.path);
        await usuario.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: usuario.foto });
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

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));

        if (!usuario) {
            return res.status(404).json({ error: 'Registro do usuario não encontrado.' });
        }

        if (!usuario.foto) {
            return res.status(404).json({ error: 'Foto do usuario não encontrada.' });
        }

        return res.sendFile(usuario.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar foto do usuario:', error);
        return res.status(500).json({ error: 'Erro ao buscar foto do usuario.' });
    }
};
