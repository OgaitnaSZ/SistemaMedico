const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require("../middleware/session");

// api/archivo
// Cargar Dashboard
router.get('/', authMiddleware, dashboardController.obtenerDashboard);

module.exports = router;