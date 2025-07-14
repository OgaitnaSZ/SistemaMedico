const mongoose = require('mongoose');

const parametroSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    valor: {
        type: String,
        required: true
    }
}, { _id: false }); // evita que mongoose agregue un _id por cada subdocumento

const historiaClinicaSchema = mongoose.Schema({
    idHistoriaClinica: {
        type: Number,
        required: true
    },
    idPaciente: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    motivo_consulta: {
        type: String,
        required: true
    },
    diagnostico: {
        type: String,
        required: true
    },
    tratamiento: {
        type: String,
        required: true
    },
    observaciones: {
        type: String,
        required: true
    },
    parametros: {
        type: [parametroSchema],
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HistoriaClinica', historiaClinicaSchema);