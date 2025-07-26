const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    idUsuario: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Usuario', usuarioSchema);