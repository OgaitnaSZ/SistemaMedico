const { check, param, validationResult } = require("express-validator");
const validateResults = require("../utils/handleValidator");

// Validaciones para un solo paciente
const validatePaciente = [
  check("nombre")
    .exists()
    .notEmpty(),
  check("apellido")
    .exists()
    .notEmpty(),
  check("dni")
    .exists()
    .notEmpty()
    .isLength({ min: 8, max: 8 }),
];

// Middleware dinámico para validar múltiples o un solo paciente
const validatorPaciente = async (req, res, next) => {
  let errors = [];

  // Si es un array de pacientes
  if (Array.isArray(req.body)) {
    for (let i = 0; i < req.body.length; i++) {
      // Ejecutar validaciones sobre cada paciente
      await Promise.all(validatePaciente.map(validation => validation.run({ ...req, body: req.body[i] })));

      const result = validationResult({ ...req, body: req.body[i] });
      if (!result.isEmpty()) {
        errors.push({
          index: i,
          errors: result.array()
        });
      }
    }
  } else {
    // Validación para un solo paciente
    await Promise.all(validatePaciente.map(validation => validation.run(req)));
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
  }

  // Si hubo errores en múltiples pacientes
  if (errors.length > 0) {
    return res.status(400).json({ erroresPorPaciente: errors });
  }

  next();
};

const validatorPacienteUpdate = [
    check("nombre")
    .exists()
    .notEmpty(),
    check("apellido")
    .exists()
    .notEmpty(),
    check("dni")
    .exists()
    .notEmpty()
    .isLength({ min: 8, max: 8 }),
    (req, res, next) => validateResults(req, res, next)
]


const validatorId = [
    param("id")
        .exists().withMessage("El ID es obligatorio")
        .notEmpty().withMessage("El ID no puede estar vacío")
        .isMongoId().withMessage("El ID no es un ObjectId válido de MongoDB"),
    (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorPaciente, validatorPacienteUpdate, validatorId };