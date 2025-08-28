const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const {validatorLogin } = require("../validators/auth");

// api/usuarios
// Login de usuario
router.post('/login', validatorLogin, usuarioController.loginUsuario);

// Obtener datos del usuario
router.get('/:id', usuarioController.obtenerUsuario);

// Actualizar usuario
router.put('/', usuarioController.actualizarUsuario);

module.exports = router