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
        type: String
    },
    dni: {
        type: String,
        required: true
    },
    fechaNacimiento:{
        type: Date
    },
    telefono:{
        type: String
    },
    email:{
        type: String
    },
    direccion:{
        type: String
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