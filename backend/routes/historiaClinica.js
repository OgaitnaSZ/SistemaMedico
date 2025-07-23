// Rutas para historia clinica
const express = require('express');
const router = express.Router();
const historiaClinicaController = require('../controllers/historiaClinicaController');

// api/historiaClinica
// Crear consulta
router.post('/', historiaClinicaController.crearHistoriaClinica);

// Listar por paciente
router.get('/:idPaciente', historiaClinicaController.listarPorPaciente);

// Actualizar consulta
router.put('/', historiaClinicaController.actualizarHistoriaClinica);

// Eliminar consulta
router.delete('/:id', historiaClinicaController.eliminarHistoriaClinica);

module.exports = router;