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
    try{
        const pacientes = await Paciente.find();
        res.json(pacientes);
    }catch(error){
        console.log(error);
        res.status(500).send("Error al obtener pacientes")
    }
}

exports.actualizarPaciente = async (req, res) => {
    try {
        const pacienteActualizado = await Paciente.findByIdAndUpdate(
            req.body._id,
            req.body,
            { new: true }
        );

        if (!pacienteActualizado) {
            return res.status(404).json({ msg: 'No existe el paciente' });
        }

        res.json(pacienteActualizado);
    } catch (error) {
        res.status(500).send("Error al actualizar paciente");
    }
};

exports.obtenerPaciente = async (req, res) => {
    try{
        let paciente = await Paciente.findById(req.params.id);

        if(!paciente){
            return res.status(404).json({msg: 'No existe el paciente'})
        }
        
        res.json(paciente);

    }catch(error){
        console.log(error);
        res.status(500).send("Error al obtener paciente")
    }
}

exports.eliminarPaciente = async (req, res) => {
    try{
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: 'id requerido' });
        }

        const paciente = await Paciente.findById(id);
        if(!paciente){
            return res.status(404).json({msg: 'No existe el paciente'});
        }
        
        await Paciente.findByIdAndDelete({_id: id});

        res.json({msg: "Paciente eliminado correctamente"});

    }catch(error){
        console.log(error);
        res.status(500).send("Error al eliminar paciente")
    }
}