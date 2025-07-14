const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.loginUsuario = async (req, res) =>{ 
    try {
        const { user, pass } = req.body;

        if (!user || !pass) {
            return res.status(400).json({ msg: 'Usuario y contraseña son requeridos' });
        }

        const usuario = await Usuario.findOne({ user });
        if (!usuario) {
            return res.status(401).json({ msg: 'Credenciales inválidas' });
        }

        const passwordValida = await bcrypt.compare(pass, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ msg: 'Credenciales inválidas' });
        }

        // Generar token random simple (32 chars hex)
        const token = crypto.randomBytes(16).toString('hex');

        return res.json({
            token,
            idUsuario: usuario._id,
            nombre: usuario.nombre
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error en el servidor' });
    }
}

exports.obtenerUsuario = async (req, res) => {
    try{
        let usuario = await Usuario.findById(req.params.id);

        if(!usuario){
            return res.status(404).json({msg: 'No existe el usuario'})
        }
        
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
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Verificar contraseña actual
        const esPasswordValido = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValido) {
            return res.status(400).json({ msg: 'La contraseña actual no es correcta' });
        }

        // Actualizar campos
        usuario.nombre = nombre;
        usuario.user = user;

        // Si hay nueva contraseña, hashearla y actualizar
        if (newPassword && newPassword.trim() !== '') {
            usuario.password = await bcrypt.hash(newPassword, 10);
        }

        await usuario.save();

        res.json({ message: 'Datos actualizados correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar datos del usuario' });
    }
}