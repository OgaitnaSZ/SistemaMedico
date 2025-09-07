const Consulta = require('../models/Consulta');
const path = require('path');
const fs = require('fs');
const { handleHttpError } = require("../utils/handleError");

/* tabu :( */
const Paciente = require('../models/Paciente'); 
const Archivo = require('../models/Archivo');

exports.listarPorPaciente = async (req, res) => {
    try {
        const { id } = req.params;

        const consultas = await Consulta.find({ idPaciente: id }).sort({ fecha: -1 }).lean();

        if (!consultas || consultas.length == 0) return handleHttpError(res, "No hay consultas para este paciente", 404);

        res.status(200).json({ "consultas": consultas });

    } catch (error) {
        return handleHttpError(res, "Error al obtener consultas clínicas", 500);
    }
};


exports.crearConsulta = async (req, res) => {
    try {
        const nuevaConsulta = req.body;

        const consulta = new Consulta(nuevaConsulta);

        await consulta.save();

        // Actualizar fecha de ultima consulta del paciente
        await recalcularUltimaVisita(consulta.idPaciente);

        res.status(201).json({ message: 'Consulta creada correctamente:', consulta});
    } catch (error) {
        return handleHttpError(res, "Error al crear consulta", 500);
    }
};


exports.actualizarConsulta = async (req, res) => {
    try {
        const consulta = req.body;

        const consultaActualizada = await Consulta.findByIdAndUpdate(
            consulta._id,
            {
                idPaciente: consulta.idPaciente,
                fecha: consulta.fecha,
                motivoConsulta: consulta.motivoConsulta,
                diagnostico: consulta.diagnostico,
                tratamiento: consulta.tratamiento,
                observaciones: consulta.observaciones,
                parametros: Array.isArray(consulta.parametros) ? consulta.parametros : [],
            },
            { new: true }
        );

        if (!consultaActualizada) return handleHttpError(res, "Consulta no encontrada", 404);

        // Actualizar fecha de última visita del paciente
        await recalcularUltimaVisita(consulta.idPaciente);

        return res.status(200).json({ mensaje: 'Consulta actualizada correctamente', consultaActualizada });

    } catch (error) {
        console.log(error);
        return handleHttpError(res, "Error al actualizar Consulta", 500);
    }
};

exports.eliminarConsulta = async (req, res) => {
    try {
        const { id } = req.params;
        
        const consulta = await Consulta.findById(id);

        if (!consulta) return handleHttpError(res, "Consulta no encontrada", 404);
        
        // Eliminar Consulta
        await Consulta.findByIdAndDelete({_id: id});

        // Eliminar archivos asociados
        eliminarArchivosPorConsulta(id);

        // Recalcular la última visita del paciente
        await recalcularUltimaVisita(consulta.idPaciente);

        res.json({ success: true, message: 'Consulta eliminada exitosamente' });
    } catch (error) {
        return handleHttpError(res, "Error al eliminar consulta", 500);
    }
};

/*--- Funciones Extras ---*/
const recalcularUltimaVisita = async (idPaciente) => {
    try {
        // Obtener la Consulta más reciente del paciente
        const consultaReciente = await Consulta
            .find({ idPaciente })
            .sort({ fecha: -1 })
            .limit(1);

        const paciente = await Paciente.findById(idPaciente);
        if (!paciente) return;

        if (consultaReciente.length > 0) {
            paciente.ultima_visita = consultaReciente[0].fecha;
        } else {
            // Si no quedan consultas, se elimina la fecha
            paciente.ultima_visita = null;
        }

        await paciente.save();
    } catch (error) {
        console.error("Error al recalcular última visita:", error);
    }
};

const eliminarArchivosPorConsulta = async (idConsulta) => {
  try {
    // Buscar archivos asociados a la Consulta
    const archivos = await Archivo.find({ idConsulta });

    for (const archivo of archivos) {
      const nombreArchivoFisico = `${archivo._id}-${archivo.name}`;
      const ruta = path.join(__dirname, '../uploads', nombreArchivoFisico);

      try {
        // Verificar y eliminar archivo físico
        await fs.promises.unlink(ruta);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.warn(`Archivo no encontrado en disco: ${ruta}`);
        } else {
          console.error(`Error al eliminar archivo físico: ${ruta}`, err);
        }
        // Seguir eliminando los demás aunque uno falle
      }
    }

    // 3. Eliminar registros de la base de datos
    await Archivo.deleteMany({ idConsulta });
    
  } catch (error) {
    throw handleHttpError(res, "Error al eliminar archivos de Consulta: error", 500);
  }
};