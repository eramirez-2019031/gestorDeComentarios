import { Router } from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { userPut, registrarse, login } from './user.controller.js';
import { existenteEmail } from '../helpers/db-validators.js';


const router = new Router();

router.put("/:id", [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id'),
    validarCampos
], userPut
);

router.post(
    '/registro', [
    check('nameUser', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de más de 6 letras').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(existenteEmail),
    validarCampos
], registrarse
);


router.post('/login',
    [
        check('email', 'El email no es un correo valido').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ], login
    );



export default router;