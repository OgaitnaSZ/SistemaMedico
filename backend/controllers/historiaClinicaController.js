// controlador historiaClinicaController.js adaptado a Express + Mongoose
const HistoriaClinica = require('../models/HistoriaClinica');
const Parametro = require('../models/HistoriaClinica');
const Paciente = require('../models/Paciente'); 
const fs = require('fs');
const path = require('path');

exports.listarPorPaciente = async (req, res) => {
    try {
        const { idPaciente } = req.params;
        if (!idPaciente) return res.status(400).json({ msg: 'ID de paciente requerido' });

        const historias = await HistoriaClinica.find({ idPaciente }).sort({ fecha: -1 }).lean();

        if (!historias.length) {
            return res.status(404).json({ msg: 'No hay historias clínicas disponibles para este paciente.' });
        }

        res.json(historias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener historias clínicas' });
    }
};

exports.crearHistoriaClinica = async (req, res) => {
    try {
        const { idPaciente, fecha, motivoConsulta, diagnostico, tratamiento, observaciones, parametros } = req.body;

        if (!idPaciente || !fecha || !motivoConsulta) {
            return res.status(400).json({ msg: 'Campos requeridos faltantes' });
        }

        const nuevaHistoria = new HistoriaClinica({
            idPaciente,
            fecha,
            motivoConsulta,
            diagnostico,
            tratamiento,
            observaciones,
            parametros,  // directo aquí
            createdAt: new Date()
        });

        await nuevaHistoria.save();

        // Actualizar ultima consulta del paciente
        await actualizarUltimaVisita(idPaciente, fecha);

        res.json({ message: 'Historia clínica creada correctamente.', id: nuevaHistoria._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear historia clínica' });
    }
};


exports.actualizarHistoriaClinica = async (req, res) => {
    console.log("Actualizando historia clínica...");

    try {
        const { _id, idPaciente, fecha, motivoConsulta, diagnostico, tratamiento, observaciones, parametros } = req.body;

        if (!_id || !idPaciente || !fecha || !motivoConsulta) {
            return res.status(400).json({ msg: 'Campos requeridos faltantes' });
        }

        const historiaActualizada = await HistoriaClinica.findByIdAndUpdate(
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

        if (!historiaActualizada) {
            return res.status(404).json({ msg: 'Historia clínica no encontrada' });
        }

        // Actualizar última visita del paciente
        await actualizarUltimaVisita(idPaciente, fecha);

        res.json({ success: true, _id: historiaActualizada._id });

    } catch (error) {
        console.error("Error al actualizar historia clínica:", error);
        res.status(500).json({ msg: 'Error al actualizar historia clínica' });
    }
};



exports.eliminarHistoriaClinica = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: 'id requerido' });
        }
        
        const historia = await HistoriaClinica.findById(id);
        if (!historia) {
            return res.status(404).json({ msg: 'Historia clínica no encontrada' });
        }

        const idPaciente = historia.idPaciente;

        // Eliminar parámetros relacionados
        await Parametro.deleteMany({ id });

        // Eliminar historia clínica
        await HistoriaClinica.findByIdAndDelete({_id: id});

        // Recalcular la última visita del paciente
        await recalcularUltimaVisita(idPaciente);

        res.json({ success: true, message: 'Historia clínica eliminada exitosamente' });
    } catch (error) {
        console.error("Error al eliminar historia clínica:", error);
        res.status(500).json({ msg: 'Error al eliminar historia clínica' });
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
        // Obtener la historia clínica más reciente del paciente
        const historiaReciente = await HistoriaClinica
            .find({ idPaciente })
            .sort({ fecha: -1 })
            .limit(1);

        const paciente = await Paciente.findById(idPaciente);
        if (!paciente) return;

        if (historiaReciente.length > 0) {
            paciente.ultima_visita = historiaReciente[0].fecha;
        } else {
            // Si no quedan historias clínicas, se elimina la fecha
            paciente.ultima_visita = null;
        }

        await paciente.save();
    } catch (error) {
        console.error("Error al recalcular última visita:", error);
    }
};
