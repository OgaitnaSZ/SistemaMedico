// Rutas para paciente
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// api/pacientes
// Crear paciente
router.post('/Crear', pacienteController.crearPaciente);

// Obtener pacientes
router.get('/Pacientes', pacienteController.obtenerPacientes);

// Actualizar paciente
router.put('/Actualizar', pacienteController.actualizarPaciente);

// Obtener paciente
router.get('/Paciente/:id', pacienteController.obtenerPaciente);

// Eliminar paciente
router.delete('/Eliminar/:id', pacienteController.eliminarPaciente);

module.exports = router