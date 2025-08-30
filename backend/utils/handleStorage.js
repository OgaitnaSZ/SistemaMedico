const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const pathArchivo = `${__dirname}/../uploads`;
        cb(null, pathArchivo);
    },
    filename: function(req, file, cb){
        const ext = file.originalname.split(".").pop();

        const name = file.originalname
        .replace(/\.[^/.]+$/, "") // quitar extensión
        .normalize("NFD")         // normalizar acentos
        .replace(/[\u0300-\u036f]/g, "") // eliminar diacríticos
        .replace(/[^a-zA-Z0-9\s]/g, "") // quitar caracteres especiales
        .replace(/\s+/g, "-");    // espacios por guiones

        const filename = `${name}-${Date.now()}.${ext}`;
        
        cb(null, filename)
    }
});

const uploadMiddleware = multer({storage});

module.exports = uploadMiddleware;