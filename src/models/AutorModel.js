import prisma from '../lib/services/prismaClient.js';

export default class AutorModel {
    constructor({ id = null, nome, biografiaAutor, dataNascimento, dataMorte, foto = null } = {}) {
        this.id = id;
        this.nome = nome;
        this.biografiaAutor = biografiaAutor;
        this.dataNascimento = dataNascimento;
        this.dataMorte = dataMorte;
        this.foto = foto;
    }

    async criar() {
        return prisma.autor.create({
            data: {
                nome: this.nome,
                biografiaAutor: this.biografiaAutor,
                dataNascimento: new Date(this.dataNascimento),
                dataMorte: this.dataMorte ? new Date(this.dataMorte) : null,
                foto: this.foto,
            },
        });
    }

    async atualizar() {
        return prisma.autor.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                biografiaAutor: this.biografiaAutor,
                dataNascimento: new Date(this.dataNascimento),
                dataMorte: this.dataMorte ? new Date(this.dataMorte) : null,
                foto: this.foto,
            },
        });
    }

    async deletar() {
        return prisma.autor.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.biografiaAutor) {
            where.biografiaAutor = { contains: filtros.biografiaAutor, mode: 'insensitive' };
        }
        if (filtros.dataNascimento) {
            where.dataNascimento = {
                equals: new Date(filtros.dataNascimento),
            };
        }
        if (filtros.dataMorte) {
            where.dataMorte = {
                equals: new Date(filtros.dataMorte),
            };
        }

        return prisma.autor.findMany({
            where,
            include: {
                livros: true,
            },
        });
    }

    static async buscarPorId(id) {
        const data = await prisma.autor.findUnique({
            where: { id },
            include: { livros: true },
        });
        if (!data) {
            return null;
        }
        const autor = new AutorModel(data);
        autor.livros = data.livros
        return autor
    }
}
