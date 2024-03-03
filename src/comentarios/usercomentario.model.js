import mongoose from 'mongoose';

const usercomentarioSchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts',
    required: true
    },
    titulo: {
        type: String,
        required: [true, 'No puede comentar sin texto']
    },
    descripcion: {
        type: String,
        required: [true, 'No puede comentar sin texto']
    },
});

export default mongoose.model('usercomentario', usercomentarioSchema);