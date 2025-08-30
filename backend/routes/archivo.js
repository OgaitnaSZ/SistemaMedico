const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../utils/handleStorage');
const { validatorId, validatorUploadFile } = require('../validators/archivo');
const archivoController = require('../controllers/archivoController');
const authMiddleware = require("../middleware/session");

// api/archivo
// Subir archivo
router.post('/Subir', authMiddleware, uploadMiddleware.array("archivos"), validatorUploadFile, archivoController.subirArchivos);

// Listar archivos de una historia clínica
router.get('/Consulta/:id', authMiddleware, validatorId, archivoController.listarArchivos);

// Eliminar archivo
router.delete('/Eliminar/:id', authMiddleware, validatorId, archivoController.eliminarArchivo);

module.exports = router;