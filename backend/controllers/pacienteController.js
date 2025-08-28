const Paciente = require('../models/Paciente');
const { handleHttpError } = require("../utils/handleError");
const path = require('path');
const fs = require('fs');

/* tabu :( */
const Consulta = require('../models/Consulta');
const Archivo = require('../models/Archivo');

exports.crearPaciente = async (req, res) => {
    try {
        const data = req.body;

        // Si es un arreglo, usamos insertMany
        if (Array.isArray(data)) {
            const pacientesGuardados = await Paciente.insertMany(data);
            return res.status(201).json({ mensaje: 'Pacientes creados correctamente', pacientes: pacientesGuardados });
        }

        // Si es un solo objeto
        const paciente = new Paciente(data);
        await paciente.save();

        return res.status(201).json({ mensaje: 'Paciente creado correctamente', paciente });

    } catch (error) {
        return handleHttpError(res, "Error al crear paciente(s)", 500)
    }
}

exports.obtenerPacientes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = {
            $or: [
                { nombre: { $regex: search, $options: 'i' } },
                { dni: { $regex: search, $options: 'i' } }
            ]
        };

        const skip = (page - 1) * limit;

        const [pacientes, total] = await Promise.all([
            Paciente.find(query).skip(skip).limit(limit),
            Paciente.countDocuments(query)
        ]);

        res.json({
            data: pacientes,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });

    } catch (error) {
        return handleHttpError(res, "Error al obtener pacientes", 500)
    }
};


exports.actualizarPaciente = async (req, res) => {
    try {
        const pacienteActualizado = await Paciente.findByIdAndUpdate(
            req.body._id,
            req.body,
            { new: true }
        );

        if (!pacienteActualizado) return handleHttpError(res, "No existe el paciente", 404);

        return res.status(200).json({ mensaje: 'Paciente actualizado correctamente', pacienteActualizado });

    } catch (error) {
        return handleHttpError(res, "Error al actualizar paciente", 500);
    }
};

exports.obtenerPaciente = async (req, res) => {
    try{
        let paciente = await Paciente.findById(req.params.id);
        console.log(paciente);

        if(!paciente) return handleHttpError(res, "No existe el paciente", 404);
        
        res.json(paciente);

    }catch(error){
        return handleHttpError(res, "Error al obtener paciente", 500);
    }
}

exports.eliminarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return handleHttpError(res, "ID del paciente es requerido", 400);

        const paciente = await Paciente.findById(id);
        if (!paciente) return handleHttpError(res, "No existe el paciente", 404);

        // Buscar todas las consultas del paciente
        const consultas = await Consulta.find({ idPaciente: id });

        // Eliminar archivos y consultas asociadas
        for (const consulta of consultas) {
            eliminarArchivosPorConsulta(consulta._id); 
            await Consulta.findByIdAndDelete(consulta._id);
        }

        // Eliminar paciente
        await Paciente.findByIdAndDelete(id);

        res.json({ msg: "Paciente eliminado correctamente con sus consultas y archivos asociados" });
    } catch (error) {
        return handleHttpError(res, "Error al eliminar paciente", 500);
    }
};

/*--- Funciones Extras ---*/
const eliminarArchivosPorConsulta = async (idConsulta) => {
  try {
    // Buscar archivos asociados a la Consulta
    const archivos = await Archivo.find({ idConsulta });

    for (const archivo of archivos) {
      const nombreArchivoFisico = `${archivo._id}-${archivo.name}`;
      const ruta = path.join(__dirname, '../uploads', nombreArchivoFisico);

      try {
        // Verificar y eliminar archivo físico
        await fs.promises.unlink(ruta);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.warn(`Archivo no encontrado en disco: ${ruta}`);
        } else {
          console.error(`Error al eliminar archivo físico: ${ruta}`, err);
        }
        // Seguir eliminando los demás aunque uno falle
      }
    }

    // 3. Eliminar registros de la base de datos
    await Archivo.deleteMany({ idConsulta });
    
  } catch (error) {
    console.error('Error al eliminar archivos de Consulta:', error);
    throw error;
  }
};