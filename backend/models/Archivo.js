const mongoose = require('mongoose');

const archivoSchema = mongoose.Schema({
    idHistoriaClinica: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Archivo', archivoSchema);
