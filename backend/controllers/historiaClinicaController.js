// controlador historiaClinicaController.js adaptado a Express + Mongoose
const HistoriaClinica = require('../models/HistoriaClinica');
const Parametro = require('../models/HistoriaClinica');
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

        res.json({ message: 'Historia clínica creada correctamente.', id: nuevaHistoria._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear historia clínica' });
    }
};


exports.actualizarHistoriaClinica = async (req, res) => {
    try {
        const { _id, idPaciente, fecha, motivoConsulta, diagnostico, tratamiento, observaciones, parametros } = req.body;
        
        if (!_id || !idPaciente || !fecha || !motivoConsulta) {
            return res.status(400).json({ msg: 'Campos requeridos faltantes' });
        }

        const historia = await HistoriaClinica.findById(_id);

        if (!historia) {
            return res.status(404).json({ msg: 'Historia clínica no encontrada' });
        }

        // Actualizar datos
        historia.idPaciente = idPaciente;
        historia.fecha = fecha;
        historia.motivoConsulta = motivoConsulta;
        historia.diagnostico = diagnostico;
        historia.tratamiento = tratamiento;
        historia.observaciones = observaciones;
        historia.parametros = Array.isArray(parametros) ? parametros : [];

        await historia.save();

        res.json({ success: true, _id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar historia clínica' });
    }
};


exports.eliminarHistoriaClinica = async (req, res) => {
    try {
        const { idHistoriaClinica } = req.params;

        if (!idHistoriaClinica) return res.status(400).json({ msg: 'idHistoriaClinica requerido' });

        // Simulación de búsqueda de archivos asociados (según tu estructura)
        const rutaArchivos = path.join(__dirname, '../../uploads');
        // Si tenés registro de archivos, deberías buscar en Mongo igual que con Parametro

        // Eliminar parámetros relacionados
        await Parametro.deleteMany({ idHistoriaClinica });
        // Eliminar historia clínica
        await HistoriaClinica.findByIdAndDelete(idHistoriaClinica);

        res.json({ success: true, message: 'Historia clínica eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar historia clínica' });
    }
};
