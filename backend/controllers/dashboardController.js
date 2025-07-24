const Paciente = require('../models/Paciente');
const Consulta = require('../models/Consulta');
const Archivo = require('../models/Archivo');

exports.obtenerDashboard = async (req, res) => {
  try {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 6);

    const stats = await Promise.all([...Array(7)].map(async (_, i) => {
      const fecha = new Date(hace7Dias);
      fecha.setDate(hace7Dias.getDate() + i);
      const diaStr = fecha.toISOString().split('T')[0];

      const pacientesDia = await Paciente.countDocuments({
        createdAt: {
          $gte: new Date(diaStr + 'T00:00:00.000Z'),
          $lte: new Date(diaStr + 'T23:59:59.999Z')
        }
      });

      const consultasDia = await Consulta.countDocuments({
        fecha: {
          $gte: new Date(diaStr + 'T00:00:00.000Z'),
          $lte: new Date(diaStr + 'T23:59:59.999Z')
        }
      });

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

    const ultimoPaciente = await Paciente.findOne().sort({ createdAt: -1 });

    const pacienteDTO = ultimoPaciente
      ? {
          idPaciente: ultimoPaciente._id,
          nombre: ultimoPaciente.nombre,
          apellido: ultimoPaciente.apellido,
          fechaNacimiento: ultimoPaciente.fechaNacimiento.toISOString().split('T')[0],
          dni: ultimoPaciente.dni,
          genero: ultimoPaciente.genero,
          ultima_visita: ultimoPaciente.ultima_visita || null
        }
      : null;

    const ultimasConsultas = await Consulta.find().sort({ fecha: -1 }).limit(10);

    const consultasDTO = await Promise.all(ultimasConsultas.map(async (consulta) => {
      const paciente = await Paciente.findOne({ _id: consulta.idPaciente });
      return {
        idPaciente: paciente?._id,
        nombreCompleto: paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Desconocido',
        fecha: consulta.fecha
      };
    }));

    const ultimosArchivos = await Archivo.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name createdAt'); // ahora sí incluís el name

    const archivosDTO = ultimosArchivos.map(archivo => ({
      name: archivo.name,
      createdAt: archivo.createdAt
    }));

    const dashboard = {
      statsUltimos7Dias: stats,
      ultimoPaciente: pacienteDTO,
      ultimas10Consultas: consultasDTO,
      ultimos10Archivos: archivosDTO
    };

    res.json(dashboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el dashboard' });
  }
};