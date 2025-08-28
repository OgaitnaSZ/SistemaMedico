const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const authMiddleware = require("../middleware/session");
const { validatorPaciente, validatorId } = require("../validators/paciente");

// api/pacientes
// Crear paciente
router.post('/Crear', authMiddleware, validatorPaciente, pacienteController.crearPaciente);

// Obtener pacientes
router.get('/Pacientes', authMiddleware, pacienteController.obtenerPacientes);

// Actualizar paciente
router.put('/Actualizar', authMiddleware, validatorPaciente, pacienteController.actualizarPaciente);

// Obtener paciente
router.get('/Paciente/:id', authMiddleware, validatorId, pacienteController.obtenerPaciente);

// Eliminar paciente
router.delete('/Eliminar/:id', authMiddleware, validatorId, pacienteController.eliminarPaciente);

module.exports = router