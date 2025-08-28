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

exports.obtenerUsuario = async (req, res) => {
    try{
        let usuario = await Usuario.findById(req.params.id);
        if(!usuario) return res.status(404).json({msg: 'No existe el usuario'})
        
        res.json({
            nombre: usuario.nombre,
            user: usuario.user
        });

    }catch(error){
        console.log(error);
        res.status(500).send("Error al obtener usuario")
    }
}

exports.actualizarUsuario = async (req, res) => {
    try {
        const { idUsuario, nombre, user, password, newPassword } = req.body;

        // Validar campos obligatorios
        if (!idUsuario || !nombre || !user || !password) {
            return res.status(400).json({ msg: 'idUsuario, nombre, user y password son requeridos' });
        }
        
        // Buscar usuario por idUsuario 
        const usuario = await Usuario.findById(idUsuario);
        if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

        // Verificar contraseña actual
        const esPasswordValido = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValido)  return res.status(400).json({ msg: 'La contraseña actual no es correcta' });

        // Actualizar campos
        usuario.nombre = nombre;
        usuario.user = user;

        // Si hay nueva contraseña, hashearla y actualizar
        if (newPassword && newPassword.trim() !== '') usuario.password = await bcrypt.hash(newPassword, 10);
        
        await usuario.save();

        res.json({ message: 'Datos actualizados correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar datos del usuario' });
    }
}