import prisma from '../lib/services/prismaClient.js';

export default class LivroModel {
    constructor({
        id = null,
        nome,
        resumo,
        personagens,
        contextoHist,
        publicacao,
        autorId,
        foto = null,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.resumo = resumo;
        this.personagens = personagens;
        this.contextoHist = contextoHist;
        this.publicacao = publicacao;
        this.autorId = autorId;
        this.foto = foto;
    }

    async criar() {
        return prisma.livro.create({
            data: {
                nome: this.nome,
                resumo: this.resumo,
                personagens: this.personagens,
                contextoHist: this.contextoHist,
                publicacao: this.publicacao,
                autorId: this.autorId,
                foto: this.foto,
            },
        });
    }

    async atualizar() {
        return prisma.livro.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                resumo: this.resumo,
                personagens: this.personagens,
                contextoHist: this.contextoHist,
                publicacao: this.publicacao,
                foto: this.foto,
            },
        });
    }

    async deletar() {
        return prisma.livro.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.resumo) {
            where.resumo = { contains: filtros.resumo, mode: 'insensitive' };
        }
        if (filtros.personagens) {
            where.personagens = { contains: filtros.personagens, mode: 'insensitive' };
        }
        if (filtros.contextoHist) {
            where.contextoHist = { contains: filtros.contextoHist, mode: 'insensitive' };
        }
        if (filtros.publicacao) {
            where.publicacao = { contains: filtros.publicacao, mode: 'insensitive' };
        }

        return prisma.livro.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.livro.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new LivroModel(data);
    }
}
