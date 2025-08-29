const Paciente = require('../models/Paciente');
const Consulta = require('../models/Consulta');
const Archivo = require('../models/Archivo');
const { handleHttpError } = require("../utils/handleError");

exports.obtenerDashboard = async (req, res) => {
  try {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 6);

    // Estadisticas de los ultimos 7 dias
    const stats = await Promise.all([...Array(7)].map(async (_, i) => {
      const fecha = new Date(hace7Dias);
      fecha.setDate(hace7Dias.getDate() + i);
      const diaStr = fecha.toISOString().split('T')[0];

      // Cantidad de pacientes
      const pacientesDia = await Paciente.countDocuments({
        createdAt: {
          $gte: new Date(diaStr + 'T00:00:00.000Z'),
          $lte: new Date(diaStr + 'T23:59:59.999Z')
        }
      });

      // Cantidad de consultas
      const consultasDia = await Consulta.countDocuments({
        fecha: {
          $gte: new Date(diaStr + 'T00:00:00.000Z'),
          $lte: new Date(diaStr + 'T23:59:59.999Z')
        }
      });

      // Cantidad de archivos
      const archivosDia = await Archivo.countDocuments({
        createdAt: {
          $gte: new Date(diaStr + 'T00:00:00.000Z'),
          $lte: new Date(diaStr + 'T23:59:59.999Z')
        }
      });

      return {
        dia: fecha.toLocaleDateString('es-AR', { weekday: 'long' }),
        fecha: diaStr,
        pacientes: pacientesDia,
        consultas: consultasDia,
        archivos: archivosDia
      };
    }));

    // Buscar al paciente de la ultima consulta
    const ultimoPaciente = await Paciente.findOne({ ultima_visita: { $ne: null } })
      .sort({ ultima_visita: -1 });

    const pacienteDTO = ultimoPaciente
      ? {
          idPaciente: ultimoPaciente._id,
          nombre: ultimoPaciente.nombre,
          apellido: ultimoPaciente.apellido,
          fechaNacimiento: ultimoPaciente.fechaNacimiento?.toISOString().split('T')[0] || null,
          dni: ultimoPaciente.dni,
          genero: ultimoPaciente.genero,
          ultima_visita: ultimoPaciente.ultima_visita
        }
      : null;

    // Buscar ultimas 10 consultas
    const ultimasConsultas = await Consulta.find().sort({ fecha: -1 }).limit(10);

    const consultasDTO = await Promise.all(ultimasConsultas.map(async (consulta) => {
      const paciente = await Paciente.findOne({ _id: consulta.idPaciente });
      return {
        idPaciente: paciente?._id,
        nombreCompleto: paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Desconocido',
        fecha: consulta.fecha
      };
    }));

    // Buscar ultimos 10 archivos
    const ultimosArchivos = await Archivo.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('_id name createdAt');

    const archivosDTO = ultimosArchivos.map(archivo => ({
      _id: archivo._id,
      name: archivo.name,
      createdAt: archivo.createdAt
    }));

    // Adjuntar todos los datos
    const dashboard = {
      statsUltimos7Dias: stats,
      ultimoPaciente: pacienteDTO,
      ultimas10Consultas: consultasDTO,
      ultimos10Archivos: archivosDTO
    };

    res.json(dashboard);
  } catch (error) {
    return handleHttpError(res, "Error al obtener el dashboard", 500);
  }
};