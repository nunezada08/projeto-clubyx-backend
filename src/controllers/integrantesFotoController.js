import IntegranteModel from '../models/IntegranteModel.js';
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

        const integrante = await IntegranteModel.buscarPorId(parseInt(id));
        if (!integrante) {
            removerFoto(req.file.path);
            return res.status(404).json({ error: 'Registro do integrante não encontrado.' });
        }

        if (integrante.foto) {
            await fs.unlink(integrante.foto).catch(() => {});
        }

        integrante.foto = await processarFoto(req.file.path);
        await integrante.atualizar();

        return res.status(201).json({ message: 'Foto salva com sucesso!', foto: integrante.foto });
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

        const integrante = await IntegranteModel.buscarPorId(parseInt(id));

        if (!integrante) {
            return res.status(404).json({ error: 'Registro do integrante não encontrado.' });
        }

        if (!integrante.foto) {
            return res.status(404).json({ error: 'Foto do integrante não encontrada.' });
        }

        return res.sendFile(integrante.foto, { root: '.' });
    } catch (error) {
        console.error('Erro ao buscar foto do integrante:', error);
        return res.status(500).json({ error: 'Erro ao buscar foto do integrante.' });
    }
};
