const Paciente = require('../models/Paciente');
const Consulta = require('../models/Consulta');
const Archivo = require('../models/Archivo');
const { handleHttpError } = require("../utils/handleError");


exports.obtenerDashboard = async (req, res) => {
  try {
    const [stats, ultimoPaciente, consultasDTO, archivosDTO] = await Promise.all([
      obtenerStatsUltimos7Dias(),
      obtenerUltimoPaciente(),
      obtenerUltimasConsultas(),
      obtenerUltimosArchivos()
    ]);

    const dashboard = {
      statsUltimos7Dias: stats,
      ultimoPaciente,
      ultimas10Consultas: consultasDTO,
      ultimos10Archivos: archivosDTO
    };

    res.status(200).json(dashboard);
  } catch (error) {
    return handleHttpError(res, "Error al obtener el dashboard", 500);
  }
};

const formatearFechaISO = (fecha) => fecha.toISOString().split('T')[0];

const obtenerStatsDia = async (fecha) => {
  const diaStr = formatearFechaISO(fecha);

  const pacientes = await Paciente.countDocuments({
    createdAt: {
      $gte: new Date(`${diaStr}T00:00:00.000Z`),
      $lte: new Date(`${diaStr}T23:59:59.999Z`)
    }
  });

  const consultas = await Consulta.countDocuments({
    fecha: {
      $gte: new Date(`${diaStr}T00:00:00.000Z`),
      $lte: new Date(`${diaStr}T23:59:59.999Z`)
    }
  });

  const archivos = await Archivo.countDocuments({
    createdAt: {
      $gte: new Date(`${diaStr}T00:00:00.000Z`),
      $lte: new Date(`${diaStr}T23:59:59.999Z`)
    }
  });

  return {
    dia: fecha.toLocaleDateString('es-AR', { weekday: 'long' }),
    fecha: diaStr,
    pacientes,
    consultas,
    archivos
  };
};

const obtenerStatsUltimos7Dias = async () => {
  const hoy = new Date();
  const hace7Dias = new Date();
  hace7Dias.setDate(hoy.getDate() - 6);

  return Promise.all([...Array(7)].map((_, i) => {
    const fecha = new Date(hace7Dias);
    fecha.setDate(hace7Dias.getDate() + i);
    return obtenerStatsDia(fecha);
  }));
};

const obtenerUltimoPaciente = async () => {
  const paciente = await Paciente.findOne({ ultima_visita: { $ne: null } })
    .sort({ ultima_visita: -1 });

  if (!paciente) return null;

  return {
    idPaciente: paciente._id,
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    fechaNacimiento: paciente.fechaNacimiento?.toISOString().split('T')[0] || null,
    dni: paciente.dni,
    genero: paciente.genero,
    ultima_visita: paciente.ultima_visita
  };
};

const obtenerUltimasConsultas = async (limite = 10) => {
  const consultas = await Consulta.find().sort({ fecha: -1 }).limit(limite);

  return Promise.all(consultas.map(async (consulta) => {
    const paciente = await Paciente.findById(consulta.idPaciente);
    return {
      idPaciente: paciente?._id || null,
      nombreCompleto: paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Desconocido',
      fecha: consulta.fecha
    };
  }));
};

const obtenerUltimosArchivos = async (limite = 10) => {
  const archivos = await Archivo.find()
    .sort({ createdAt: -1 })
    .limit(limite)
    .select('_id nombre url createdAt');

  return archivos.map(archivo => ({
    nombre: archivo.nombre,
    url: archivo.url,
    createdAt: archivo.createdAt
  }));
};
