const { check, validationResult, param } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorPaciente = [
    check("nombre").exists()
    .notEmpty()
    .exists(),
    check("apellido").exists()
    .notEmpty()
    .exists(),
    check("dni").exists()
    .notEmpty()
    .exists()
    .isLength(8),
    (req, res, next) => validateResults(req, res, next)
]

const validatorId = [
    param("id")
        .exists().withMessage("El ID es obligatorio")
        .notEmpty().withMessage("El ID no puede estar vacío")
        .isMongoId().withMessage("El ID no es un ObjectId válido de MongoDB"),
    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorPaciente, validatorId };