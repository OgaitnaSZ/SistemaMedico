const { verifyToken } = require("../utils/handlerJwt");
const { handleHttpError } = require("../utils/handleError")
const Usuario = require("../models/Usuario");

const authMiddleware = async (req, res, next) => {
    try{
        if(!req.headers.authorization){
            return handleHttpError(res, "NOT TOKEN", 401);
        }
        
        const token = req.headers.authorization.split(' ').pop();
        const dataToken = await verifyToken(token);

        if(!dataToken){
            return handleHttpError(res, "NOT PAYLOAD DATA", 401);
        }

        const user = await Usuario.findOne({_id: dataToken._id});
        
        req.usuario = user

        return next()

    }catch(error){
        console.log(error);
        return handleHttpError(res, "NOT SESSION", 401)
    }
}

module.exports = authMiddleware;