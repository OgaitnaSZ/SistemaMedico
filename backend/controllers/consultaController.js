const Consulta = require('../models/Consulta');
const Paciente = require('../models/Paciente'); 

/* tabu :( */
const Archivo = require('../models/Archivo');
const path = require('path');
const fs = require('fs');

exports.listarPorPaciente = async (req, res) => {
    try {
        const { idPaciente } = req.params;
        if (!idPaciente) {
        return res.status(400).json({ msg: 'ID de paciente requerido' });
        }

        const consultas = await Consulta.find({ idPaciente }).sort({ fecha: -1 }).lean();

        res.status(200).json(consultas);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener consultas clínicas' });
    }
};


exports.crearConsulta = async (req, res) => {
    try {
        const { idPaciente, fecha, motivoConsulta, diagnostico, tratamiento, observaciones, parametros } = req.body;

        if (!idPaciente || !fecha || !motivoConsulta) {
            return res.status(400).json({ msg: 'Campos requeridos faltantes' });
        }

        const nuevaConsulta = new Consulta({
            idPaciente,
            fecha,
            motivoConsulta,
            diagnostico,
            tratamiento,
            observaciones,
            parametros,  // directo aquí
        });

        await nuevaConsulta.save();

        // Actualizar ultima consulta del paciente
        await actualizarUltimaVisita(idPaciente, fecha);

        res.json({ message: 'Consulta creada correctamente.', id: nuevaConsulta._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear Consulta' });
    }
};


exports.actualizarConsulta = async (req, res) => {
    try {
        const { _id, idPaciente, fecha, motivoConsulta, diagnostico, tratamiento, observaciones, parametros } = req.body;

        if (!_id || !idPaciente || !fecha || !motivoConsulta) {
            return res.status(400).json({ msg: 'Campos requeridos faltantes' });
        }

        const consultaActualizada = await Consulta.findByIdAndUpdate(
            _id,
            {
                idPaciente,
                fecha,
                motivoConsulta,
                diagnostico,
                tratamiento,
                observaciones,
                parametros: Array.isArray(parametros) ? parametros : [],
            },
            { new: true }
        );

        if (!consultaActualizada) {
            return res.status(404).json({ msg: 'Consulta no encontrada' });
        }

        // Actualizar última visita del paciente
        await actualizarUltimaVisita(idPaciente, fecha);

        res.json({ success: true, _id: consultaActualizada._id });

    } catch (error) {
        console.error("Error al actualizar Consulta:", error);
        res.status(500).json({ msg: 'Error al actualizar Consulta' });
    }
};

exports.eliminarConsulta = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ msg: 'id requerido' });
        }
        
        const consulta = await Consulta.findById(id);

        if (!consulta) {
            return res.status(404).json({ msg: 'Consulta no encontrada' });
        }
        
        const idPaciente = consulta.idPaciente;
        
        // Eliminar Consulta
        await Consulta.findByIdAndDelete({_id: id});

        // Eliminar archivos asociados
        eliminarArchivosPorConsulta(id);

        // Recalcular la última visita del paciente
        await recalcularUltimaVisita(idPaciente);

        res.json({ success: true, message: 'Consulta eliminada exitosamente' });
    } catch (error) {
        console.error("Error al eliminar Consulta:", error);
        res.status(500).json({ msg: 'Error al eliminar Consulta' });
    }
};


// Funcion para actualizar ultima consulta de un paciente
const actualizarUltimaVisita = async (idPaciente, fechaConsulta) => {
    try {
        const paciente = await Paciente.findById(idPaciente);
        if (!paciente) return;

        const fechaNueva = new Date(fechaConsulta);
        const fechaActual = new Date(paciente.ultima_visita || 0);

        if (fechaNueva > fechaActual) {
            paciente.ultima_visita = fechaNueva;
            await paciente.save();
        }
    } catch (error) {
        console.error(`Error al actualizar última visita del paciente ${idPaciente}:`, error);
    }
};

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
        // Seguimos eliminando los demás aunque uno falle
      }
    }

    // 3. Eliminar registros de la base de datos
    const resultado = await Archivo.deleteMany({ idConsulta });
  } catch (error) {
    console.error('Error al eliminar archivos de Consulta:', error);
    throw error;
  }
};