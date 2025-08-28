const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { validatorLogin } = require("../validators/auth");
const { validatorUsuario } = require("../validators/usuario");
const authMiddleware = require("../middleware/session");

// api/usuarios
// Login de usuario
router.post('/login', validatorLogin, usuarioController.loginUsuario);

// Actualizar usuario
router.put('/actualizar', authMiddleware, validatorUsuario, usuarioController.actualizarUsuario);

module.exports = router