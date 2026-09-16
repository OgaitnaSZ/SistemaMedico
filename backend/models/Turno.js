const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
  idDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  idPaciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Confirmado', 'Completado', 'Cancelado'],
    default: 'Pendiente'
  },
  motivo: {
    type: String,
    default: ''
  },
  notas: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

turnoSchema.index({ idDoctor: 1, fecha: 1, hora: 1 });

module.exports = mongoose.model('Turno', turnoSchema);
