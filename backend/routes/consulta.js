const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

// api/consultas
// Crear consulta
router.post('/', consultaController.crearConsulta);

// Listar por paciente
router.get('/:idPaciente', consultaController.listarPorPaciente);

// Actualizar consulta
router.put('/', consultaController.actualizarConsulta);

// Eliminar consulta
router.delete('/:id', consultaController.eliminarConsulta);

module.exports = router;