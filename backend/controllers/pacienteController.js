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
    try{
        const {
            _id,
            nombre,
            apellido,
            genero,
            dni,
            fechaNacimiento,
            telefono,
            email,
            direccion,
            ultima_visita
        } = req.body;

        console.log(req.body);
        let paciente = await Paciente.findById(req.body._id);


        if(!paciente){
            return res.status(404).json({msg: 'No existe el paciente'})
        }
        
        // Actualización de campos
        paciente.idPaciente = _id;
        paciente.nombre = nombre;
        paciente.apellido = apellido;
        paciente.genero = genero;
        paciente.dni = dni;
        paciente.fechaNacimiento = fechaNacimiento;
        paciente.telefono = telefono;
        paciente.email = email;
        paciente.direccion = direccion;
        paciente.ultima_visita = ultima_visita;

        paciente = await Paciente.findByIdAndUpdate(req.params.id, paciente, { new: true });

        res.json(paciente);

    }catch(error){
        console.log(error);
        res.status(500).send("Error al actualizar paciente")
    }
}

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