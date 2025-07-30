const Paciente = require('../models/Paciente');

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
    try{
        const { id } = req.params;
        if (!id) return res.status(400).json({ msg: 'id requerido' });

        const paciente = await Paciente.findById(id);
        if(!paciente) return res.status(404).json({msg: 'No existe el paciente'});
        
        await Paciente.findByIdAndDelete({_id: id});
        res.json({msg: "Paciente eliminado correctamente"});

    }catch(error){
        console.log(error);
        res.status(500).send("Error al eliminar paciente")
    }
}