// Rutas para paciente
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// api/pacientes
router.post('/', pacienteController.crearPaciente);
router.get('/', pacienteController.obtenerPacientes);
router.put('/:id', pacienteController.actualizarPaciente);
router.get('/:id', pacienteController.obtenerPaciente);
router.delete('/:id', pacienteController.eliminarPaciente);

module.exports = router