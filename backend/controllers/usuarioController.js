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
        const { _id, nombre, user, password, newPassword } = req.body;

        // Validar campos obligatorios
        if (!_id || !nombre || !user || !password) return handleHttpError(res, "Faltan datos", 400);
        
        // Buscar usuario por _id 
        const usuario = await Usuario.findById(_id);
        if (!usuario) return handleHttpError(res, "Usuario no encontrado", 404);

        
        // Verificar contraseña actual
        const esPasswordValido = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValido) return handleHttpError(res, "La contraseña actual no es correcta", 400);
        
        // Actualizar campos
        usuario.nombre = nombre;
        usuario.user = user;
        
        // Si hay nueva contraseña, hashearla y actualizar
        if (newPassword && newPassword.trim() !== '') usuario.password = await bcrypt.hash(newPassword, 10);
        
        await usuario.save();

        res.status(200);
        res.json({ message: 'Datos actualizados correctamente' });

    } catch (error) {
        console.error("Error al guardar usuario:", error); // <-- Agrega esto
        handleHttpError(res, "Error al actualizar datos del usuario", 500);
    }
}