import { response, request } from  'express';
import bcryptjs from 'bcryptjs';
import User from './user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js'


export const userPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, ...resto } = req.body;

        const usuarioAutenticado = req.usuario;
        const idCoincide = usuarioAutenticado._id.toString() === id;
        const tienePermiso = usuarioAutenticado.role === 'USER_ROLE';

        if (!idCoincide || !tienePermiso) {
            return res.status(403).json({
                msg: 'No tienes permiso para actualizar este usuario',
            });
        }
        if (!password) {
            return res.status(400).json({
                msg: 'Debes proporcionar la contraseña anterior para actualizar',
            });
        }
        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario no encontrado',
            });
        }

        const contrasenaValida = await bcryptjs.compare(password, usuario.password);
        if (!contrasenaValida) {
            return res.status(400).json({
                msg: 'La contraseña anterior no es válida',
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, resto, { new: true });
        
        res.status(200).json({
            msg: 'Se actualizó el perfil correctamente',
            usuario: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
}


export const registrarse = async (req, res) => {
    const { nameUser, email, password, role } = req.body;
    const usuario = new User({ nameUser, email, password, role });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    res.status(200).json({
        usuario
    });
}

export const login = async (req, res) => {
    
    const { email, password } = req.body;
    
    try {
        
        const usuario = await User.findOne({ email });


        if (!usuario) {
            return res.status(400).json({
                msg: 'El correo no está registrado'
            });
        }
        

        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario no existe'
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña no coincide'
            });
        }
        

        const token = await generarJWT(usuario.id);


        res.status(200).json({
            msg: 'Se inicio secion',
            usuario,
            token
        });


    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({
            msg: 'Error, hablele al admin'
        });
    }
}
