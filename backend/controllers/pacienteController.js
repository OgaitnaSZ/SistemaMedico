const Paciente = require('../models/Paciente');

exports.crearPaciente = async (req, res) =>{ 
    try{
        // Crear paciente
        let paciente = new Paciente(req.body);

        await paciente.save();

        res.send(paciente);

    }catch(error){
        console.log(error);
        res.status(500).send("Error al crear paciente");
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
        let paciente = await Paciente.findById(req.params.id);

        if(!paciente){
            return res.status(404).json({msg: 'No existe el paciente'});
        }
        
        await Paciente.findByIdAndDelete({_id: req.params.id});

        res.json({msg: "Paciente eliminado correctamente"});

    }catch(error){
        console.log(error);
        res.status(500).send("Error al eliminar paciente")
    }
}