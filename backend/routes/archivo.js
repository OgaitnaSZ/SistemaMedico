const express = require('express');
const router = express.Router();
const archivoController = require('../controllers/archivoController');
const upload = require('../config/multer');

// api/archivo
// Subir archivo
router.post('/', upload.array('archivos[]'), archivoController.subirArchivos);

// Listar archivos de una historia clínica
router.get('/:id', archivoController.listarArchivos);

// Eliminar archivo
router.delete('/:id', archivoController.eliminarArchivo);

module.exports = router;