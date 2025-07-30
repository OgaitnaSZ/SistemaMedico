const mongoose = require('mongoose');

const archivoSchema = mongoose.Schema({
    idConsulta: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Archivo', archivoSchema);
