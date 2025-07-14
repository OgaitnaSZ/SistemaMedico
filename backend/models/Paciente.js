const mongoose = require('mongoose');

const pacienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true
    },
    fechaNacimiento:{
        type: Date,
        required: true
    },
    telefono:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    direccion:{
        type: String,
        required: true
    },
    ultima_visita: {
        type: Date
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Paciente', pacienteSchema);