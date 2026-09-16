const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const { handleHttpError } = require("../utils/handleError");

const normalizarFecha = (fechaInput) => {
    const str = (typeof fechaInput === 'string' ? fechaInput : new Date(fechaInput).toISOString()).split('T')[0];
    return new Date(`${str}T00:00:00.000Z`);
};

exports.crearTurno = async (req, res) => {
    try {
        const { idPaciente, fecha, hora, estado, motivo, notas } = req.body;

        const paciente = await Paciente.findById(idPaciente);
        if (!paciente) {
            return handleHttpError(res, "Paciente no encontrado", 404);
        }

        const fechaNormalizada = normalizarFecha(fecha);

        // Prevenir turnos superpuestos para el mismo doctor
        const solapado = await Turno.findOne({
            idDoctor: req.usuario._id,
            fecha: fechaNormalizada,
            hora: hora,
            estado: { $ne: 'Cancelado' }
        });

        if (solapado) {
            return handleHttpError(res, "Ya existe un turno programado en ese horario para este profesional", 400);
        }

        const turno = new Turno({
            idDoctor: req.usuario._id,
            idPaciente,
            fecha: fechaNormalizada,
            hora,
            estado: estado || 'Pendiente',
            motivo: motivo || '',
            notas: notas || ''
        });

        await turno.save();

        const turnoPopulado = await Turno.findById(turno._id)
            .populate('idPaciente', 'nombre apellido dni telefono email healthInsurance');

        return res.status(201).json({ message: 'Turno creado correctamente', turno: turnoPopulado });

    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al crear el turno", 500);
    }
};

exports.obtenerTurnos = async (req, res) => {
    try {
        const query = { idDoctor: req.usuario._id };

        if (req.query.fechaInicio && req.query.fechaFin) {
            const inicio = normalizarFecha(req.query.fechaInicio);
            const finStr = (typeof req.query.fechaFin === 'string' ? req.query.fechaFin : new Date(req.query.fechaFin).toISOString()).split('T')[0];
            const fin = new Date(`${finStr}T23:59:59.999Z`);
            query.fecha = { $gte: inicio, $lte: fin };
        } else if (req.query.fecha) {
            const fechaNorm = normalizarFecha(req.query.fecha);
            const diaStr = (typeof req.query.fecha === 'string' ? req.query.fecha : new Date(req.query.fecha).toISOString()).split('T')[0];
            query.fecha = {
                $gte: fechaNorm,
                $lte: new Date(`${diaStr}T23:59:59.999Z`)
            };
        } else if (req.query.mes && req.query.anio) {
            const anio = parseInt(req.query.anio);
            const mes = parseInt(req.query.mes) - 1; // 0-indexed
            const primerDia = new Date(Date.UTC(anio, mes, 1, 0, 0, 0));
            const ultimoDia = new Date(Date.UTC(anio, mes + 1, 0, 23, 59, 59, 999));
            query.fecha = { $gte: primerDia, $lte: ultimoDia };
        }

        if (req.query.idPaciente) {
            query.idPaciente = req.query.idPaciente;
        }

        if (req.query.estado) {
            query.estado = req.query.estado;
        }

        const turnos = await Turno.find(query)
            .populate('idPaciente', 'nombre apellido dni telefono email healthInsurance')
            .sort({ fecha: 1, hora: 1 })
            .lean();

        return res.status(200).json({ turnos });

    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al obtener turnos", 500);
    }
};

exports.obtenerTurno = async (req, res) => {
    try {
        const { id } = req.params;

        const turno = await Turno.findOne({ _id: id, idDoctor: req.usuario._id })
            .populate('idPaciente', 'nombre apellido dni telefono email healthInsurance');

        if (!turno) {
            return handleHttpError(res, "Turno no encontrado", 404);
        }

        return res.status(200).json(turno);

    } catch (error) {
        return handleHttpError(res, "Error al obtener el turno", 500);
    }
};

exports.obtenerProximoTurno = async (req, res) => {
    try {
        const ahora = new Date();
        const hoyStr = ahora.toISOString().split('T')[0];
        const horaActual = ahora.toTimeString().substring(0, 5);
        const inicioHoy = new Date(`${hoyStr}T00:00:00.000Z`);

        const turno = await Turno.findOne({
            idDoctor: req.usuario._id,
            estado: { $nin: ['Cancelado', 'Completado'] },
            $or: [
                { fecha: { $gt: inicioHoy } },
                { fecha: inicioHoy, hora: { $gte: horaActual } }
            ]
        })
        .populate('idPaciente', 'nombre apellido dni telefono email healthInsurance')
        .sort({ fecha: 1, hora: 1 });

        return res.status(200).json({ turno: turno || null });

    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al obtener el próximo turno", 500);
    }
};

exports.actualizarTurno = async (req, res) => {
    try {
        const { _id, idPaciente, fecha, hora, estado, motivo, notas } = req.body;

        const turno = await Turno.findOne({ _id, idDoctor: req.usuario._id });
        if (!turno) {
            return handleHttpError(res, "Turno no encontrado", 404);
        }

        const paciente = await Paciente.findById(idPaciente);
        if (!paciente) {
            return handleHttpError(res, "Paciente no encontrado", 404);
        }

        const fechaNormalizada = normalizarFecha(fecha);

        // Prevenir solapamiento si se modifica fecha u hora
        const solapado = await Turno.findOne({
            _id: { $ne: _id },
            idDoctor: req.usuario._id,
            fecha: fechaNormalizada,
            hora: hora,
            estado: { $ne: 'Cancelado' }
        });

        if (solapado && (!estado || estado !== 'Cancelado')) {
            return handleHttpError(res, "Ya existe un turno programado en ese horario para este profesional", 400);
        }

        turno.idPaciente = idPaciente;
        turno.fecha = fechaNormalizada;
        turno.hora = hora;
        if (estado) turno.estado = estado;
        if (motivo !== undefined) turno.motivo = motivo;
        if (notas !== undefined) turno.notas = notas;

        await turno.save();

        const turnoActualizado = await Turno.findById(turno._id)
            .populate('idPaciente', 'nombre apellido dni telefono email healthInsurance');

        return res.status(200).json({ mensaje: 'Turno actualizado correctamente', turnoActualizado });

    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al actualizar el turno", 500);
    }
};

exports.cancelarTurno = async (req, res) => {
    try {
        const { id } = req.params;

        const turno = await Turno.findOne({ _id: id, idDoctor: req.usuario._id });
        if (!turno) {
            return handleHttpError(res, "Turno no encontrado", 404);
        }

        turno.estado = 'Cancelado';
        await turno.save();

        const turnoActualizado = await Turno.findById(turno._id)
            .populate('idPaciente', 'nombre apellido dni telefono email healthInsurance');

        return res.status(200).json({ mensaje: 'Turno cancelado correctamente', turno: turnoActualizado });

    } catch (error) {
        return handleHttpError(res, "Error al cancelar el turno", 500);
    }
};

exports.eliminarTurno = async (req, res) => {
    try {
        const { id } = req.params;

        const turno = await Turno.findOneAndDelete({ _id: id, idDoctor: req.usuario._id });
        if (!turno) {
            return handleHttpError(res, "Turno no encontrado", 404);
        }

        return res.status(200).json({ success: true, message: 'Turno eliminado exitosamente' });

    } catch (error) {
        return handleHttpError(res, "Error al eliminar el turno", 500);
    }
};
