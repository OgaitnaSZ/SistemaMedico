const { verifyToken } = require("../utils/handlerJwt");
const { handleHttpError } = require("../utils/handleError")
const model = require("../models");
const getPropiedades = require("../utils/handlePropiedadesEngine");
const propertiesKey = getPropiedades();

const authMiddleware = async (req, res, next) => {
    try{
        const User = model.User;
        if(!req.headers.authorization){
            handleHttpError(res, "NOT TOKEN", 401);
        }
        
        const token = req.headers.authorization.split(' ').pop();
        const dataToken = await verifyToken(token);

        if(!dataToken){
            handleHttpError(res, "NOT PAYLOAD DATA", 401);
        }

        console.log(dataToken);

        const query = {
            [propertiesKey.id]: dataToken[propertiesKey.id]
        }

        const user = await User.findOne(query);
        
        req.user = user

        next()

    }catch(error){
        handleHttpError(res, "NOT SESSION", 401)
        console.log(error);
    }
}

module.exports = authMiddleware;