const { check, param } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorTurno = [
    check("idPaciente")
        .exists().withMessage("El idPaciente es obligatorio")
        .notEmpty().withMessage("El idPaciente no puede estar vacío")
        .isMongoId().withMessage("El idPaciente no es un ObjectId válido"),
    check("fecha")
        .exists().withMessage("La fecha es obligatoria")
        .notEmpty().withMessage("La fecha no puede estar vacía")
        .isISO8601().withMessage("La fecha debe ser un formato ISO8601 válido")
        .toDate(),
    check("hora")
        .exists().withMessage("La hora es obligatoria")
        .notEmpty().withMessage("La hora no puede estar vacía")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("La hora debe tener formato HH:mm"),
    check("estado")
        .optional()
        .isIn(['Pendiente', 'Confirmado', 'Completado', 'Cancelado']).withMessage("Estado no válido"),
    check("motivo")
        .optional()
        .isString(),
    check("notas")
        .optional()
        .isString(),
    (req, res, next) => validateResults(req, res, next)
];

const validatorTurnoUpdate = [
    check("_id")
        .exists().withMessage("El ID es obligatorio")
        .notEmpty().withMessage("El ID no puede estar vacío")
        .isMongoId().withMessage("El ID no es un ObjectId válido"),
    check("idPaciente")
        .exists().withMessage("El idPaciente es obligatorio")
        .notEmpty().withMessage("El idPaciente no puede estar vacío")
        .isMongoId().withMessage("El idPaciente no es un ObjectId válido"),
    check("fecha")
        .exists().withMessage("La fecha es obligatoria")
        .notEmpty().withMessage("La fecha no puede estar vacía")
        .isISO8601().withMessage("La fecha debe ser un formato ISO8601 válido")
        .toDate(),
    check("hora")
        .exists().withMessage("La hora es obligatoria")
        .notEmpty().withMessage("La hora no puede estar vacía")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("La hora debe tener formato HH:mm"),
    check("estado")
        .optional()
        .isIn(['Pendiente', 'Confirmado', 'Completado', 'Cancelado']).withMessage("Estado no válido"),
    check("motivo")
        .optional()
        .isString(),
    check("notas")
        .optional()
        .isString(),
    (req, res, next) => validateResults(req, res, next)
];

const validatorId = [
    param("id")
        .exists().withMessage("El ID es obligatorio")
        .notEmpty().withMessage("El ID no puede estar vacío")
        .isMongoId().withMessage("El ID no es un ObjectId válido de MongoDB"),
    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorTurno, validatorTurnoUpdate, validatorId };
