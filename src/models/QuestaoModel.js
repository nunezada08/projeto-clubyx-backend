import prisma from '../lib/services/prismaClient.js';

export default class QuestaoModel {
    constructor({ id = null, enunciado, explicacao = null, simuladoId } = {}) {
        this.id = id;
        this.enunciado = enunciado;
        this.explicacao = explicacao;
        this.simuladoId = simuladoId;
    }

    async criar() {
        return prisma.questao.create({
            data: {
                enunciado: this.enunciado,
                explicacao: this.explicacao,
                simuladoId: this.simuladoId,
            },
        });
    }

    async atualizar() {
        return prisma.questao.update({
            where: { id: this.id },
            data: {
                enunciado: this.enunciado,
                explicacao: this.explicacao,
                simuladoId: this.simuladoId,
            },
        });
    }

    async deletar() {
        return prisma.questao.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.enunciado) {
            where.enunciado = { contains: filtros.enunciado, mode: 'insensitive' };
        }

        if (filtros.explicacao) {
            where.explicacao = { contains: filtros.explicacao, mode: 'insensitive' };
        }

        if (filtros.simuladoId !== undefined) {
            const parsedSimuladoId = parseInt(filtros.simuladoId, 10);
            if (!Number.isNaN(parsedSimuladoId)) {
                where.simuladoId = parsedSimuladoId;
            }
        }

        return prisma.questao.findMany({
            where, include: {
            alternativas: true,
            },
        });

    }

    static async buscarPorId(id) {
        const data = await prisma.questao.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new QuestaoModel(data);
    }
}
