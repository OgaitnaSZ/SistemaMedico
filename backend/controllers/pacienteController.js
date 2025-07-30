const Paciente = require('../models/Paciente');

/* tabu :( */
const Consulta = require('../models/Consulta');
const Archivo = require('../models/Archivo');

const path = require('path');
const fs = require('fs');

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
        console.error(error);
        return res.status(500).send("Error al crear paciente(s)");
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
        console.error('Error al obtener pacientes:', error);
        res.status(500).send("Error al obtener pacientes");
    }
};


exports.actualizarPaciente = async (req, res) => {
    try {
        const pacienteActualizado = await Paciente.findByIdAndUpdate(
            req.body._id,
            req.body,
            { new: true }
        );

        if (!pacienteActualizado) return res.status(404).json({ msg: 'No existe el paciente' });

        res.json(pacienteActualizado);

    } catch (error) {
        res.status(500).send("Error al actualizar paciente");
    }
};

exports.obtenerPaciente = async (req, res) => {
    try{
        let paciente = await Paciente.findById(req.params.id);

        if(!paciente)return res.status(404).json({msg: 'No existe el paciente'})
        
        res.json(paciente);

    }catch(error){
        console.log(error);
        res.status(500).send("Error al obtener paciente")
    }
}

exports.eliminarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ msg: 'id requerido' });

        const paciente = await Paciente.findById(id);
        if (!paciente) return res.status(404).json({ msg: 'No existe el paciente' });

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
        console.log("Error al eliminar paciente:", error);
        res.status(500).send("Error al eliminar paciente");
    }
};

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