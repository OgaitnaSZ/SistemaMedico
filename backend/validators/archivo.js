const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorUploadFile = [
    check("idConsulta")
    .exists()
    .notEmpty()
    .isMongoId(),
    (req, res, next) => validateResults(req, res, next)
]

const validatorId = [
    check("id")
    .exists()
    .notEmpty()
    .isMongoId(),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorUploadFile, validatorId };