// Rutas para historia clinica
const express = require('express');
const router = express.Router();
const historiaClinicaController = require('../controllers/historiaClinicaController');

// api/historiaClinica
router.post('/', historiaClinicaController.crearHistoriaClinica);
router.get('/:idPaciente', historiaClinicaController.listarPorPaciente);
router.put('/', historiaClinicaController.actualizarHistoriaClinica);
router.delete('/:idHistoriaClinica', historiaClinicaController.eliminarHistoriaClinica);

module.exports = router;
