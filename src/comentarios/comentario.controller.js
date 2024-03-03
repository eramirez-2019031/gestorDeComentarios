import Comentario from  './comentario.model';
import usercomentario from '../models/userHasComment';


export const crearPublicacion = async (req, res) => {
    try {
        const { titulo, categoria, descripcion } = req.body;
        const comentario = new Comentario({
            titulo,
            categoria,
            descripcion,
            user: req.usuario._id
        });
        await comentario.save();
        res.status(201).json({
            msg: 'Se publicó la publicación',
            comentario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

export const putPublicacion = async (req, res) => {
    try {
        const { fecha } = req.params; 
        const { titulo, categoria, descripcion } = req.body;

        const comentario = await Comentario.findOne({ fecha }); // va a buscar la publicacion por fecha  en vez de ID para evitar conflictos
        if (!comentario) {
            return res.status(404).json({
                msg: 'La publicacion no se encontro',
            });
        }
        if (comentario.user.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({
                msg: 'No puedes editar esta publicación',
            });
        }

        comentario.titulo = titulo;
        comentario.categoria = categoria;
        comentario.descripcion = descripcion;
        await comentario.save();

        res.status(200).json({
            msg: 'La Publicación fue editada con exito',
            comentario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'comuniquese con el admin',
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const { userId } = req.params;
        const { comentarioId, titulo, descripcion } = req.body; 

        const nuevoComentario = new usercomentario({
            user: userId,
            comentario: comentarioId,
            titulo: titulo, 
            descripcion: descripcion 
        });

        await nuevoComentario.save(); 

        res.status(200).json({
            msg: 'Comentario enviado',
            comentario: nuevoComentario, 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

export const getComentarioComments = async (req, res) => {
    try {
        // Buscar todos los comentarios
        const comentarios = await Comentario.find();

        // Para cada comentario, encontrar los comentarios asociados
        for (let comentario of comentarios) {
            // Buscar comentarios asociados al comentario actual
            const comments = await usercomentario.find({ comentario: comentario._id });
            comentario.comments = comments; 
        }

        res.status(200).json({
            msg: 'publicaciones encontradas con sus comentarios',
            comentarios,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'error, hable con el admin',
        });
    }
};


