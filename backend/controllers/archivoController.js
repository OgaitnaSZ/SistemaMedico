const Archivo = require('../models/Archivo');
const path = require('path');
const fs = require('fs');

exports.subirArchivos = async (req, res) => {
  try {
    const IdConsulta = req.body.IdConsulta;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No se subieron archivos' });
    }

    const archivosGuardados = await Promise.all(
      req.files.map(async (file) => {
        // Crear registro en la bd
        const nuevoArchivo = new Archivo({
          idConsulta: IdConsulta,
          name: file.originalname,
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          createdAt: new Date()
        });

        const archivoGuardado = await nuevoArchivo.save();
        
        // Construir el nombre del archivo fisico (id-name)
        const nuevoNombre = `${archivoGuardado._id}-${file.originalname}`;
        const nuevaRuta = path.join(path.dirname(file.path), nuevoNombre);
        
        // Renombrar el archivo físico
        fs.renameSync(file.path, nuevaRuta);
        
        // Actualizar el registro con la nueva información
        archivoGuardado.filename = nuevoNombre;
        archivoGuardado.path = nuevaRuta;
        
        return await archivoGuardado.save();
      })
    );

    res.json({
      success: true,
      message: 'Archivos subidos y guardados exitosamente.',
      archivos: archivosGuardados,
    });
  } catch (error) {
    console.error('Error al subir archivos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar archivos',
      error: error.message 
    });
  }
};

exports.listarArchivos = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ msg: 'ID de archivo requerido' });

    const archivos = await Archivo.find({ idConsulta: id });

    // Solo devolver nombre del archivo y path
    const archivosSimplificados = archivos.map(a => ({
      _id: a._id,
      name: a.name
    }));

    res.status(200).json(archivosSimplificados);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener archivos');
  }
};

exports.eliminarArchivo = async (req, res) => {
  try {
    const idArchivo = req.params.id;
    
    if (!idArchivo) return res.status(400).json({ success: false, message: 'ID de archivo requerido' });
    
    const archivo = await Archivo.findById(idArchivo);
    
    if (!archivo) return res.status(404).json({ success: false, message: 'Archivo no encontrado en la base de datos' });

    // Construir el nombre del archivo físico (id+'-'+name)
    const nombreArchivoFisico = `${archivo._id}-${archivo.name}`;
    const ruta = path.join(__dirname, '../uploads', nombreArchivoFisico);

    // Verificar si el archivo existe
    if (fs.existsSync(ruta)) {
      // Eliminar archivo físico
      fs.unlinkSync(ruta);
    } else {
      console.warn('El archivo físico no existía, pero se procederá a eliminar el registro de la BD');
    }

    // Eliminar de la base de datos
    await Archivo.findByIdAndDelete(idArchivo);
    
    return res.json({ 
      success: true, 
      message: 'Archivo eliminado completamente' 
    });

  } catch (error) {
    console.error('Error en eliminarArchivo:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el archivo',
      error: error.message 
    });
  }
};