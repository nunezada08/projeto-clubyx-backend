import UsuarioModel from '../models/UsuarioModel.js';
import { upload as uploadStorage, deletar as deletarStorage } from '../lib/helper/arquivoHelper.js';

const uploadArquivo = (tipo) => async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        if (usuario[tipo]) {
            await deletarStorage(usuario[tipo]);
        }

        usuario[tipo] = await uploadStorage(id, req.file);

        const data = await usuario.atualizar();

        return res.status(200).json({
            message: `${tipo} enviado com sucesso!`,
            url: data[tipo],
        });
    } catch (error) {
        return res.status(500).json({
            error: `Erro ao fazer upload do ${tipo}.`,
        });
    }
};

const buscarArquivo = (tipo) => async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        if (!usuario[tipo]) {
            return res.status(404).json({
                error: `Nenhum ${tipo} cadastrado.`,
            });
        }

        return res.status(200).json({
            url: usuario[tipo],
        });
    } catch (error) {
        return res.status(500).json({
            error: `Erro ao buscar ${tipo}.`,
        });
    }
};

const deletarArquivo = (tipo) => async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        if (!usuario[tipo]) {
            return res.status(404).json({
                error: `Nenhum ${tipo} para remover.`,
            });
        }

        await deletarStorage(usuario[tipo]);

        usuario[tipo] = null;

        await usuario.atualizar();

        return res.status(200).json({
            message: `${tipo} removido com sucesso!`,
        });
    } catch (error) {
        return res.status(500).json({
            error: `Erro ao remover ${tipo}.`,
        });
    }
};

export const uploadFoto = uploadArquivo('foto');
export const buscarFoto = buscarArquivo('foto');
export const deletarFoto = deletarArquivo('foto');

export const uploadDocumento = uploadArquivo('documento');
export const buscarDocumento = buscarArquivo('documento');
export const deletarDocumento = deletarArquivo('documento');
