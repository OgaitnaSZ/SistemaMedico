const bcryptjs = require("bcryptjs");

/**  
* Contraseña sin encripttar: hola.01
* @param {*} passwordPlain
*/
const encrypt = async(passwordPlain) => {
    return await bcryptjs.hash(passwordPlain, 10)
}

/**  
* Contraseña sin encripttar y encriptada
* @param {*} passwordPlain
* @param {*} hashPassword
*/
const compare = async(passwordPlain, hashPassword) => {
    return await bcryptjs.compare(passwordPlain, hashPassword)
}

module.exports = { encrypt, compare }