const { check, validationResult } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorUsuario = [
    check("nombre").exists()
    .notEmpty()
    .exists(),
    check("user").exists()
    .notEmpty()
    .exists(),
    check("password").exists()
    .notEmpty()
    .exists()
    .isLength({min:3, max:20}),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorUsuario };