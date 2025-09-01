const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const { validatorConsulta, validatorId } = require("../validators/consulta");
const authMiddleware = require("../middleware/session");

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /consultas/Crear:
 *      post:
 *          tags:
 *              - consultas
 *          summary: "Crear Consulta"
 *          description: "Ruta para crear consulta"
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/consultaNew"
 *          responses:
 *              '201':
 *                  description: Consulta creada 
 *              '401':
 *                  description: No inicio session
 *              '500':
 *                  description: Error del servidor 
 */
router.post('/Crear', authMiddleware, validatorConsulta, consultaController.crearConsulta);

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /consultas/Paciente/{id}:
 *      post:
 *          tags:
 *              - consultas
 *          summary: "Obtener consultas de un paciente"
 *          description: "Ruta para obtener consultas de un paciente"
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *          - name: id
 *            in: path
 *            description: ID del paciente
 *            required: true
 *            schema:
 *              type: string
 *          responses:
 *              '200':
 *                  description: Consultas de paciente 
 *              '401':
 *                  description: No inicio session
 *              '404':
 *                  description: No existen consultas para este paciente
 *              '500':
 *                  description: Error del servidor 
 */
router.get('/Paciente/:id', authMiddleware, validatorId, consultaController.listarPorPaciente);

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /consultas/Actualizar:
 *      put:
 *          tags:
 *              - consulta
 *          summary: "Actualizar Consulta"
 *          description: "Ruta para actualizar consulta"
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/consultaUpdate"
 *          responses:
 *              '200':
 *                  description: Consulta actualizada 
 *              '401':
 *                  description: No inicio session
 *              '404':
 *                  description: Consulta no encontrada
 *              '500':
 *                  description: Error del servidor 
 */
router.put('/Actualizar', authMiddleware, validatorConsulta, consultaController.actualizarConsulta);

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /consultas/Eliminar/{id}:
 *      delete:
 *          tags:
 *              - consulta
 *          summary: "Eliminar Consulta"
 *          description: "Ruta para eliminar consulta"
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *          - name: id
 *            in: path
 *            description: ID de la consulta
 *            required: true
 *            schema:
 *              type: string
 *          responses:
 *              '200':
 *                  description: consulta eliminada
 *              '401':
 *                  description: No inicio session
 *              '404':
 *                  description: consulta no encontrada
 *              '500':
 *                  description: Error del servidor 
 */
router.delete('/Eliminar/:id', authMiddleware, validatorId, consultaController.eliminarConsulta);

module.exports = router;