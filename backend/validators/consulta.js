const { check, param } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorConsulta = [
    check("idPaciente")
    .exists()
    .notEmpty()
    .isMongoId(),
    check("fecha")
    .exists()
    .notEmpty()
    .isDate(),
    check("motivoConsulta")
    .exists()
    .notEmpty(),
    (req, res, next) => validateResults(req, res, next)
]

const validatorId = [
    param("id")
        .exists().withMessage("El ID es obligatorio")
        .notEmpty().withMessage("El ID no puede estar vacío")
        .isMongoId().withMessage("El ID no es un ObjectId válido de MongoDB"),
    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorConsulta, validatorId };