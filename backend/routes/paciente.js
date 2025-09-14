const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const authMiddleware = require("../middleware/session");
const { validatorPaciente, validatorPacienteUpdate, validatorId } = require("../validators/paciente");

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /pacientes/Crear:
 *      post:
 *          tags:
 *              - pacientes
 *          summary: "Crear Paciente"
 *          description: "Ruta para crear paciente"
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/pacienteNew"
 *          responses:
 *              '201':
 *                  description: Paciente creado 
 *              '401':
 *                  description: No inicio session
 *              '500':
 *                  description: Error del servidor 
 */
router.post('/Crear', authMiddleware, validatorPaciente, pacienteController.crearPaciente);

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /pacientes/Pacientes:
 *      get:
 *          tags:
 *              - pacientes
 *          summary: "Obtener Pacientes"
 *          description: "Ruta para listar pacientes"
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *          - name: page
 *            in: query
 *            description: Pagina
 *            schema:
 *              type: string
 *          - name: limit
 *            in: query
 *            description: Limite de registros
 *            schema:
 *              type: number
 *          - name: search
 *            in: query
 *            description: Palabra clave por nombre o DNI
 *            schema:
 *              type: string
 *          responses:
 *              '200':
 *                  description: Listado de pacientes 
 *              '401':
 *                  description: No inicio session
 *              '500':
 *                  description: Error del servidor 
 */
router.get('/Pacientes', authMiddleware, pacienteController.obtenerPacientes);

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /pacientes/Actualizar:
 *      put:
 *          tags:
 *              - pacientes
 *          summary: "Actualizar Paciente"
 *          description: "Ruta para actualizar paciente"
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/pacienteUpdate"
 *          responses:
 *              '200':
 *                  description: Paciente actualizado 
 *              '401':
 *                  description: No inicio session
 *              '404':
 *                  description: Paciente no encontrado
 *              '500':
 *                  description: Error del servidor 
 */
router.put('/Actualizar', authMiddleware, validatorPacienteUpdate, pacienteController.actualizarPaciente);

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /pacientes/Paciente/{id}:
 *      get:
 *          tags:
 *              - pacientes
 *          summary: "Obtener Paciente"
 *          description: "Ruta para obtener datos de un paciente"
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
 *                  description: Datos del pacientes 
 *              '401':
 *                  description: No inicio session
 *              '404':
 *                  description: Paciente no encontrado
 *              '500':
 *                  description: Error del servidor 
 */
router.get('/Paciente/:id', authMiddleware, validatorId, pacienteController.obtenerPaciente);

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /pacientes/Eliminar/{id}:
 *      delete:
 *          tags:
 *              - pacientes
 *          summary: "Eliminar Paciente"
 *          description: "Ruta para eliminar paciente"
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
 *                  description: Paciente eliminado
 *              '401':
 *                  description: No inicio session
 *              '404':
 *                  description: Paciente no encontrado
 *              '500':
 *                  description: Error del servidor 
 */
router.delete('/Eliminar/:id', authMiddleware, validatorId, pacienteController.eliminarPaciente);

module.exports = router