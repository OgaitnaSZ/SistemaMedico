const Usuario = require('../models/Usuario');
const { matchedData } = require('express-validator');
const { compare, encrypt } = require("../utils/handlePassword");
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
        res.status(500)
        handleHttpError(res, "ERROR_LOGIN_USER")
    }
}

exports.actualizarUsuario = async (req, res) => {
    try {
        req = matchedData(req);
        const userDB = await Usuario.findOne({user: req.user});

        console.log(userDB);

        if (!userDB) return handleHttpError(res, "Usuario no encontrado", 404);
        
        // Verificar contraseña actual
        const esPasswordValido = await compare(req.password, userDB.password);
        if (!esPasswordValido) return handleHttpError(res, "La contraseña actual no es correcta", 400);
        
        // Actualizar campos
        userDB.nombre = req.nombre;
        userDB.user = req.user;
        
        // Si hay nueva contraseña, hashearla y actualizar
        if (req.newPassword && req.newPassword.trim() !== '') userDB.password = await bcrypt.hash(req.newPassword, 10);
        
        await userDB.save();

        res.status(200);
        res.json({ message: 'Datos actualizados correctamente' });

    } catch (error) {
        handleHttpError(res, "Error al actualizar datos del usuario", 500);
    }
}