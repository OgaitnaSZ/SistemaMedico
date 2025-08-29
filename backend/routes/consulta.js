const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const { validatorConsulta, validatorId } = require("../validators/consulta");
const authMiddleware = require("../middleware/session");

// api/consultas
// Crear consulta
router.post('/Crear', authMiddleware, validatorConsulta, consultaController.crearConsulta);

// Listar por paciente
router.get('/Paciente/:id', authMiddleware, validatorId, consultaController.listarPorPaciente);

// Actualizar consulta
router.put('/Actualizar', authMiddleware, validatorConsulta, consultaController.actualizarConsulta);

// Eliminar consulta
router.delete('/Eliminar/:id', authMiddleware, validatorId, consultaController.eliminarConsulta);

module.exports = router;