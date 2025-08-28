const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
*Pasar el objeto usuario
* @param {*} user
*/
const tokenSign = async (user)=>{

    return await jwt.sign(
        {
            _id: user._id,
            nombre: user.nombre
        },
        JWT_SECRET,
        {
            expiresIn: "12h"
        }
    )
}

/**
 * Pasar token de session
 * @param {*} tokenJwt
 * @returns
 */
const verifyToken = async (tokenJwt)=>{
    try{
        return jwt.verify(tokenJwt, JWT_SECRET)
    }catch(error){
        return null
    }
}

module.exports = {tokenSign, verifyToken}