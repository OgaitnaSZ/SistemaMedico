const mongoose = require('mongoose');

const parametroSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  valor: {
    type: String,
    required: true
  }
}, { _id: false });

const consultaSchema = new mongoose.Schema({
  idPaciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  motivoConsulta: {
    type: String,
    required: true
  },
  diagnostico: {
    type: String
  },
  tratamiento: {
    type: String
  },
  observaciones: {
    type: String
  },
  parametros: {
    type: [parametroSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consulta', consultaSchema);
