const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const { validatorTurno, validatorTurnoUpdate, validatorId } = require("../validators/turno");
const authMiddleware = require("../middleware/session");

/**
 * http://localhost:4000/api
 * 
 * @openapi
 * /turnos/Crear:
 *      post:
 *          tags:
 *              - turnos
 *          summary: "Crear Turno"
 *          description: "Ruta para crear un turno médico"
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/turnoNew"
 *          responses:
 *              '201':
 *                  description: Turno creado correctamente
 *              '400':
 *                  description: Turno superpuesto u horario inválido
 *              '401':
 *                  description: No inicio sesión
 *              '404':
 *                  description: Paciente no encontrado
 *              '500':
 *                  description: Error del servidor
 */
router.post('/Crear', authMiddleware, validatorTurno, turnoController.crearTurno);

/**
 * http://localhost:4000/api
 * 
 * @openapi
 * /turnos/Turnos:
 *      get:
 *          tags:
 *              - turnos
 *          summary: "Obtener Turnos"
 *          description: "Ruta para listar los turnos del médico autenticado"
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *          - name: fecha
 *            in: query
 *            description: Filtrar por fecha específica (YYYY-MM-DD)
 *            schema:
 *              type: string
 *          - name: fechaInicio
 *            in: query
 *            description: Fecha inicio de rango
 *            schema:
 *              type: string
 *          - name: fechaFin
 *            in: query
 *            description: Fecha fin de rango
 *            schema:
 *              type: string
 *          - name: mes
 *            in: query
 *            description: Mes (1-12)
 *            schema:
 *              type: number
 *          - name: anio
 *            in: query
 *            description: Año (ej. 2026)
 *            schema:
 *              type: number
 *          - name: idPaciente
 *            in: query
 *            description: ID del paciente
 *            schema:
 *              type: string
 *          responses:
 *              '200':
 *                  description: Listado de turnos
 *              '401':
 *                  description: No inicio sesión
 *              '500':
 *                  description: Error del servidor
 */
router.get('/Turnos', authMiddleware, turnoController.obtenerTurnos);

/**
 * http://localhost:4000/api
 * 
 * @openapi
 * /turnos/Proximo:
 *      get:
 *          tags:
 *              - turnos
 *          summary: "Obtener Próximo Turno"
 *          description: "Ruta para obtener el próximo turno pendiente del médico autenticado"
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              '200':
 *                  description: Próximo turno o null si no hay turnos futuros
 *              '401':
 *                  description: No inicio sesión
 *              '500':
 *                  description: Error del servidor
 */
router.get('/Proximo', authMiddleware, turnoController.obtenerProximoTurno);

/**
 * http://localhost:4000/api
 * 
 * @openapi
 * /turnos/Turno/{id}:
 *      get:
 *          tags:
 *              - turnos
 *          summary: "Obtener Turno por ID"
 *          description: "Ruta para obtener un turno específico"
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *          - name: id
 *            in: path
 *            description: ID del turno
 *            required: true
 *            schema:
 *              type: string
 *          responses:
 *              '200':
 *                  description: Datos del turno
 *              '401':
 *                  description: No inicio sesión
 *              '404':
 *                  description: Turno no encontrado
 *              '500':
 *                  description: Error del servidor
 */
router.get('/Turno/:id', authMiddleware, validatorId, turnoController.obtenerTurno);

/**
 * http://localhost:4000/api
 * 
 * @openapi
 * /turnos/Actualizar:
 *      put:
 *          tags:
 *              - turnos
 *          summary: "Actualizar Turno"
 *          description: "Ruta para actualizar los datos de un turno"
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/turnoUpdate"
 *          responses:
 *              '200':
 *                  description: Turno actualizado correctamente
 *              '400':
 *                  description: Superposición de turno
 *              '401':
 *                  description: No inicio sesión
 *              '404':
 *                  description: Turno o paciente no encontrado
 *              '500':
 *                  description: Error del servidor
 */
router.put('/Actualizar', authMiddleware, validatorTurnoUpdate, turnoController.actualizarTurno);

/**
 * http://localhost:4000/api
 * 
 * @openapi
 * /turnos/Cancelar/{id}:
 *      put:
 *          tags:
 *              - turnos
 *          summary: "Cancelar Turno"
 *          description: "Ruta para cancelar un turno"
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *          - name: id
 *            in: path
 *            description: ID del turno
 *            required: true
 *            schema:
 *              type: string
 *          responses:
 *              '200':
 *                  description: Turno cancelado correctamente
 *              '401':
 *                  description: No inicio sesión
 *              '404':
 *                  description: Turno no encontrado
 *              '500':
 *                  description: Error del servidor
 */
router.put('/Cancelar/:id', authMiddleware, validatorId, turnoController.cancelarTurno);

/**
 * http://localhost:4000/api
 * 
 * @openapi
 * /turnos/Eliminar/{id}:
 *      delete:
 *          tags:
 *              - turnos
 *          summary: "Eliminar Turno"
 *          description: "Ruta para eliminar un turno"
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *          - name: id
 *            in: path
 *            description: ID del turno
 *            required: true
 *            schema:
 *              type: string
 *          responses:
 *              '200':
 *                  description: Turno eliminado exitosamente
 *              '401':
 *                  description: No inicio sesión
 *              '404':
 *                  description: Turno no encontrado
 *              '500':
 *                  description: Error del servidor
 */
router.delete('/Eliminar/:id', authMiddleware, validatorId, turnoController.eliminarTurno);

module.exports = router;
