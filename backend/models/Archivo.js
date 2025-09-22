const mongoose = require('mongoose');

const archivoSchema = mongoose.Schema({
    idConsulta: {
        type: String,
        required: true
    },
    nombre: {
        type: String
    },
    url: {
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Archivo', archivoSchema);
