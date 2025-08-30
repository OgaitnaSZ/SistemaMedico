const mongoose = require('mongoose');

const archivoSchema = mongoose.Schema({
    idConsulta: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    url: {
        type: String
    }
});

module.exports = mongoose.model('Archivo', archivoSchema);
