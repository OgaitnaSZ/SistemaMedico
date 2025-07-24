const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// api/archivo
// Cargar Dashboard
router.get('/', dashboardController.obtenerDashboard);

module.exports = router;