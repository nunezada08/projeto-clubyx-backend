import supabase from '../lib/services/supabase.js';
import prisma from '../utils/prismaClient.js';
import fs from 'fs';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';

// configura o caminho do ffmpeg provido por ffmpeg-static
if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
}

export const uploadVideo = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

        const file = req.file;
        const bucket = process.env.SUPABASE_VIDEO_BUCKET || 'videoaulas';
        const safeName = file.filename || `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
        const localPath = path.resolve(file.path);

        // Antes de enviar, transcodifica/comprime o vídeo para reduzir tamanho (evitar 413)
        const tmpDir = path.resolve('uploads', 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
        const tmpPath = path.join(tmpDir, `transcoded_${safeName}`);

        const transcode = () =>
            new Promise((resolve, reject) => {
                // parâmetros razoáveis para reduzir tamanho: 720p, bitrate baixo
                ffmpeg(localPath)
                    .outputOptions([
                        '-c:v libx264',
                        '-preset fast',
                        '-b:v 800k',
                        '-maxrate 800k',
                        '-bufsize 1600k',
                        '-vf scale=-2:720',
                        '-c:a aac',
                        '-b:a 128k',
                    ])
                    .on('end', () => resolve())
                    .on('error', (err) => reject(err))
                    .save(tmpPath);
            });

        try {
            await transcode();
        } catch (transErr) {
            console.warn(
                'Transcoding failed, will attempt original file upload:',
                transErr.message || transErr,
            );
        }

        // Função auxiliar para tentar upload usando stream (cria nova stream a cada tentativa)
        const tryUploadStream = async (sourcePath) => {
            const stream = fs.createReadStream(sourcePath);
            return await supabase.storage.from(bucket).upload(safeName, stream, {
                contentType: file.mimetype,
                upsert: false,
            });
        };

        // Tentativa inicial de upload
        // preferir o arquivo transcodificado se existe
        const uploadSource = fs.existsSync(tmpPath) ? tmpPath : localPath;

        let { data: uploadData, error: uploadError } = await tryUploadStream(uploadSource);

        // Se bucket não existir, criar e tentar novamente
        if (
            uploadError &&
            (uploadError.status === 400 ||
                uploadError.status === 404 ||
                uploadError.statusCode === '404')
        ) {
            try {
                await supabase.storage.createBucket(bucket, { public: true });
            } catch (createErr) {
                console.warn('createBucket:', createErr.message || createErr);
            }

            const retry = await tryUploadStream(uploadSource);
            uploadData = retry.data;
            uploadError = retry.error;
        }

        if (uploadError) throw uploadError;

        // Obter URL pública
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(safeName);
        const publicUrl = publicData?.publicUrl || null;

        // Salvar metadados no banco
        const uploaderId = req.body.uploaderId ? parseInt(req.body.uploaderId, 10) : undefined;
        const title = req.body.title || file.originalname;

        const video = await prisma.video.create({
            data: {
                title,
                filename: safeName,
                url: publicUrl,
                mime: file.mimetype,
                size: file.size,
                uploaderId: uploaderId || null,
            },
        });

        // Remover arquivos temporários locais após upload (tentar, caso falhe apenas logamos)
        try {
            if (fs.existsSync(localPath)) await fs.promises.unlink(localPath);
        } catch (unlinkErr) {
            console.warn('Erro ao remover arquivo local:', unlinkErr.message || unlinkErr);
        }

        try {
            if (fs.existsSync(tmpPath)) await fs.promises.unlink(tmpPath);
        } catch (unlinkErr) {
            console.warn(
                'Erro ao remover arquivo transcodificado:',
                unlinkErr.message || unlinkErr,
            );
        }

        return res.status(201).json({ video });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Erro no upload' });
    }
};

export default { uploadVideo };
