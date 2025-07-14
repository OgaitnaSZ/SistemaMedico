const Paciente = require('../models/Paciente');
const HistoriaClinica = require('../models/HistoriaClinica');
const ArchivoAdjunto = require('../models/ArchivoAdjunto');

const obtenerDashboard = async (req, res) => {
  try {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 6); // para incluir el día actual

    // 1. Estadísticas últimos 7 días
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

      const consultasDia = await HistoriaClinica.countDocuments({
        fecha: {
          $gte: new Date(diaStr + 'T00:00:00.000Z'),
          $lte: new Date(diaStr + 'T23:59:59.999Z')
        }
      });

      const archivosDia = await ArchivoAdjunto.countDocuments({
        created_at: {
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

    // 2. Último paciente registrado
    const ultimoPaciente = await Paciente.findOne().sort({ createdAt: -1 });

    const pacienteDTO = ultimoPaciente
      ? {
          idPaciente: ultimoPaciente.idPaciente,
          nombre: ultimoPaciente.nombre,
          apellido: ultimoPaciente.apellido,
          fechaNacimiento: ultimoPaciente.fechaNacimiento.toISOString().split('T')[0],
          dni: ultimoPaciente.dni,
          genero: ultimoPaciente.genero,
          ultima_visita: ultimoPaciente.ultima_visita || null
        }
      : null;

    // 3. Últimas 10 consultas
    const ultimasConsultas = await HistoriaClinica.find()
      .sort({ fecha: -1 })
      .limit(10);

    const consultasDTO = await Promise.all(ultimasConsultas.map(async (consulta) => {
      const paciente = await Paciente.findOne({ idPaciente: consulta.idPaciente });
      return {
        idPaciente: paciente?.idPaciente.toString(),
        nombreCompleto: paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Desconocido',
        fecha: consulta.fecha
      };
    }));

    // 4. Últimos 10 archivos
    const ultimosArchivos = await ArchivoAdjunto.find()
      .sort({ created_at: -1 })
      .limit(10)
      .select('path created_at');

    const archivosDTO = ultimosArchivos.map(archivo => ({
      path: archivo.path,
      created_at: archivo.created_at
    }));

    // Armado del objeto final
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

module.exports = {
  obtenerDashboard
};
