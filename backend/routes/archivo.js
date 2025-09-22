const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../utils/handleStorage');
const { validatorId, validatorUploadFile } = require('../validators/archivo');
const archivoController = require('../controllers/archivoController');
const authMiddleware = require("../middleware/session");

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /archivos/Subir:
 *      post:
 *          tags:
 *              - archivos
 *          summary: "Subir archivos"
 *          description: "Ruta para subir archivos"
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              archivos:
 *                                  type: string
 *                                  format: binary
 *                              idConsulta:
 *                                  type: string
 *          responses:
 *              '201':
 *                  description: Archivos subidos con exito
 *              '401':
 *                  description: No inicio session
 *              '500':
 *                  description: Error del servidor 
 */
router.post('/Subir', authMiddleware, uploadMiddleware.array("archivos"), validatorUploadFile, archivoController.subirArchivos);

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /archivos/Consulta/{id}:
 *      get:
 *          tags:
 *              - archivos
 *          summary: "Obtener archivos de una consulta"
 *          description: "Ruta para obtener archivos de una consulta"
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *          - nombre: id
 *            in: path
 *            description: ID de la consulta
 *            required: true
 *            schema:
 *              type: string
 *          responses:
 *              '200':
 *                  description: Archivos de la consulta
 *              '401':
 *                  description: No inicio session
 *              '404':
 *                  description: No existen archivos para esta consulta
 *              '500':
 *                  description: Error del servidor 
 */
router.get('/Consulta/:id', authMiddleware, validatorId, archivoController.listarArchivos);

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /archivos/Eliminar/{id}:
 *      delete:
 *          tags:
 *              - archivos
 *          summary: "Eliminar Archivo"
 *          description: "Ruta para eliminar archivo"
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *          - nombre: id
 *            in: path
 *            description: ID del archivo
 *            required: true
 *            schema:
 *              type: string
 *          responses:
 *              '200':
 *                  description: Archivo eliminado
 *              '401':
 *                  description: No inicio session
 *              '404':
 *                  description: Archivo no encontrado
 *              '500':
 *                  description: Error del servidor 
 */
router.delete('/Eliminar/:id', authMiddleware, validatorId, archivoController.eliminarArchivo);

module.exports = router;