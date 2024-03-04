import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    categoria: {
        type: String,
        required: [true, 'Se necesita una Categoria']
    },
    descripcion: {
        type: String,
        required: [true, 'No puede publicar sin texto']
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    estado: {
        type: Boolean,
        default: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});
comentarioSchema.methods.toJSON = function () {
    const { __v, _id, createdAt, ...comentario } = this.toObject();
    comentario.pid = createdAt; // Utilizamos la fecha de creación como identificador
    return comentario;
}

 export default mongoose.model('Comentario', comentarioSchema);