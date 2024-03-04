import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { crearPublicacion, putPublicacion, addComment, getComentarioComments } from './comentario.controller.js';

const router = Router();

router.post('/', [
    validarJWT,
    validarCampos,
    crearPublicacion 
]);

router.put('/:fecha', [
    validarJWT,
    validarCampos,
    putPublicacion 
]);

router.post('/comentario/:userId', [
    validarJWT,
    check('postId', 'El ID del post es requerido').notEmpty(),
    validarCampos
], addComment);

router.get('/', [
    getComentarioComments
]);

export default router;

