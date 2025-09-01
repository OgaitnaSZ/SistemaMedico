const Archivo = require('../models/Archivo');
const fs = require('fs');
const { handleHttpError } = require("../utils/handleError");
const PUBLIC_URL = process.env.PUBLIC_URL;
const MEDIA_PATH = `${__dirname}/../uploads`;

exports.subirArchivos = async (req, res) => {
  try {
    const { body, files } = req;

    if (!files || files.length === 0) return handleHttpError(res, "No se recibieron archivos", 400);

    // Mapear todos los archivos subidos
    const archivosData = files.map(file => ({
      idConsulta: body.idConsulta,
      name: file.filename,
      url: `${PUBLIC_URL}/uploads/${file.filename}`
    }));

    // Guardar en la db
    const data = await Archivo.insertMany(archivosData);

    return res.status(201).send({ mensaje: 'Archivo subido con exito', data });

  } catch (error) {
    console.log(error);
    return handleHttpError(res, "Error al subir archivo", 500);
  }
};

exports.listarArchivos = async (req, res) => {
  try {
    const { id } = req.params;

    const archivos = await Archivo.find({ idConsulta: id });

    const archivosSimplificados = archivos.map(a => ({
      _id: a._id,
      idConsulta: a.idConsulta,
      name: a.name,
      url: a.url
    }));

    res.status(200).json(archivosSimplificados);
  } catch (error) {
    return handleHttpError(res, "Error al obtener archivos", 500);
  }
};

exports.eliminarArchivo = async (req, res) => {
  try {
    const { id } = req.params;

    const archivo = await Archivo.findById(id);
  
    if (!archivo) handleHttpError(res, "Archivo no encontrado en la base de datos", 404);

    const deleteResponse = await Archivo.findByIdAndDelete({ _id: id });

    const filename  = archivo.name;
    console.log(filename);
    const filePath = `${MEDIA_PATH}/${filename}`; 
    
    console.log(filePath);

    // Verificar si el archivo existe
    if (fs.existsSync(filePath)) {
      // Eliminar archivo físico
      fs.unlinkSync(filePath);
    } else {
      console.warn('El archivo físico no existía, pero se procederá a eliminar el registro de la BD');
    }

    const data = {
      filePath,
      deleted: deleteResponse.matchedCount,
    };

    return res.status(200).json({ mensaje: 'Archivo eliminado con exito', data });

  } catch (error) {
    console.log(error);
    return handleHttpError(res, "Error al eliminar archivo", 500);
  }
};