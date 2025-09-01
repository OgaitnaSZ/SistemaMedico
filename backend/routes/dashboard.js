const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require("../middleware/session");

/**
 * http://localhost:4000/api
 * 
 * Route update user
 * @openapi
 * /dashboard:
 *      get:
 *          tags:
 *              - dashboard
 *          summary: "Obtener datos del dashboard"
 *          description: "Ruta para obtener estadísticas, últimas consultas y archivos"
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              '200':
 *                  description: Datos del dashboard
 *              '401':
 *                  description: No inicio session
 *              '500':
 *                  description: Error del servidor 
 */
router.get('/', authMiddleware, dashboardController.obtenerDashboard);

module.exports = router;