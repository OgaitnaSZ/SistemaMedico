const express = require('express');
const router = express.Router();
const archivoController = require('../controllers/archivoController');
const upload = require('../config/multer');

// api/archivo
// Subir archivo
router.post('/Subir', upload.array('archivos[]'), archivoController.subirArchivos);

// Listar archivos de una historia clínica
router.get('/Consulta/:id', archivoController.listarArchivos);

// Eliminar archivo
router.delete('/Eliminar/:id', archivoController.eliminarArchivo);

module.exports = router;