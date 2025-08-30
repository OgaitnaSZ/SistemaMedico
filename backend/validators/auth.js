const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorLogin = [
    check("usuario")
    .exists()
    .notEmpty(),
    check("password")
    .exists()
    .notEmpty()
    .isLength({min:3, max:20}),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorLogin };