const mongoose = require('mongoose');

const archivoAdjuntoSchema = mongoose.Schema({
    idArchivo: {
        type: Number,
        required: true
    },
    idHistoriaClinica: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ArchivoAdjunto', archivoAdjuntoSchema);
