// Rutas para paciente
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// api/pacientes
// Crear paciente
router.post('/', pacienteController.crearPaciente);

// Obtener pacientes
router.get('/', pacienteController.obtenerPacientes);

// Actualizar paciente
router.put('/', pacienteController.actualizarPaciente);

// Obtener paciente
router.get('/:id', pacienteController.obtenerPaciente);

// Eliminar paciente
router.delete('/:id', pacienteController.eliminarPaciente);

module.exports = router