const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

// api/consultas
// Crear consulta
router.post('/Crear', consultaController.crearConsulta);

// Listar por paciente
router.get('/Paciente/:idPaciente', consultaController.listarPorPaciente);

// Actualizar consulta
router.put('/Actualizar', consultaController.actualizarConsulta);

// Eliminar consulta
router.delete('/Eliminar/:id', consultaController.eliminarConsulta);

module.exports = router;