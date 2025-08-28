const { verifyToken } = require("../utils/handlerJwt");
const { handleHttpError } = require("../utils/handleError")
const Usuario = require("../models/Usuario");

const authMiddleware = async (req, res, next) => {
    try{
        if(!req.headers.authorization){
            handleHttpError(res, "NOT TOKEN", 401);
        }
        
        const token = req.headers.authorization.split(' ').pop();
        const dataToken = await verifyToken(token);

        if(!dataToken){
            handleHttpError(res, "NOT PAYLOAD DATA", 401);
        }

        console.log(dataToken);

        const user = await Usuario.findOne({_id: dataToken._id});
        
        req.user = user

        next()

    }catch(error){
        handleHttpError(res, "NOT SESSION", 401)
        console.log(error);
    }
}

module.exports = authMiddleware;