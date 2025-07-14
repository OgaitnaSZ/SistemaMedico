// Rutas para usuario
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// api/usuarios
// Login de usuario
router.post('/', usuarioController.loginUsuario);

// Obtener datos del usuario
router.get('/:id', usuarioController.obtenerUsuario);

// Actualizar usuario
router.put('/', usuarioController.actualizarUsuario);

module.exports = router