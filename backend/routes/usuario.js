const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { validatorLogin } = require("../validators/auth");
const { validatorUsuario } = require("../validators/usuario");
const authMiddleware = require("../middleware/session");

/**
 * http://localhost:4000/api
 * 
 * Route login user
 * @openapi
 * /usuarios/login:
 *      post:
 *          tags:
 *              - usuarios
 *          summary: "Iniciar session"
 *          description: "Ruta para iniciar session"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/usuarioLogin"
 *          responses:
 *              '200':
 *                  description: Datos correctos 
 *              '401': 
 *                  description: Password invalido 
 *              '404':
 *                  description: Usuario no existe 
 *              '500':
 *                  description: Error del servidor 
 */
router.post('/login', validatorLogin, usuarioController.loginUsuario);

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /usuarios/actualizar:
 *      put:
 *          tags:
 *              - usuarios
 *          summary: "Actualizar Datos"
 *          description: "Ruta para actualizar datos del usuario"
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/usuarioUpdate"
 *          responses:
 *              '200':
 *                  description: Datos actualizados correctamente 
 *              '401': 
 *                  description: Password invalido 
 *              '404':
 *                  description: Usuario no existe 
 *              '500':
 *                  description: Error del servidor 
 */
router.put('/actualizar', authMiddleware, validatorUsuario, usuarioController.actualizarUsuario);

module.exports = router