const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { matchedData } = require('express-validator');
const { compare } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handlerJwt");
const { handleHttpError } = require("../utils/handleError");

exports.loginUsuario = async (req, res) =>{ 
    try {
        req = matchedData(req);
        const user = await Usuario.findOne({user: req.usuario});
        
        if(!user){
            handleHttpError(res, "USUARIO NO EXISTE")
            return
        }
        
        const hashPassword = user.get("password");
        const check = await compare(req.password, hashPassword);
        if(!check){
            handleHttpError(res, "PASSWORD INVALIDO", 401)
            return
        }
        
        user.set('password', undefined, {strict: false});
        
        const data = {
            token: await tokenSign(user),
            user
        }
        
        res.status(200)
        res.send({data})

    } catch (error) {
        res.status(401)
        handleHttpError(res, "ERROR_LOGIN_USER")
    }
}

exports.actualizarUsuario = async (req, res) => {
    try {
        const usuario = req.body;

        // Buscar usuario por _id 
        const userDB = await Usuario.findById(usuario._id);
        if (!userDB) return handleHttpError(res, "Usuario no encontrado", 404);

        
        // Verificar contraseña actual
        const esPasswordValido = await bcrypt.compare(usuario.password, userDB.password);
        if (!esPasswordValido) return handleHttpError(res, "La contraseña actual no es correcta", 400);
        
        // Actualizar campos
        userDB.nombre = usuario.nombre;
        userDB.user = usuario.user;
        
        // Si hay nueva contraseña, hashearla y actualizar
        if (usuario.newPassword && usuario.newPassword.trim() !== '') userDB.password = await bcrypt.hash(usuario.newPassword, 10);
        
        await userDB.save();

        res.status(200);
        res.json({ message: 'Datos actualizados correctamente' });

    } catch (error) {
        handleHttpError(res, "Error al actualizar datos del usuario", 500);
    }
}