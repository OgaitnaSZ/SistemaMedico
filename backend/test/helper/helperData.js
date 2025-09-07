// Usuarios
const usuarioPasswordErronea = {
    "usuario": "admin",
    "password": "admin1"
}

const usuarioCorrecto = {
    "usuario": "admin",
    "password": "admin"
}

// Pacientes
const pacienteDePrueba = {
    "nombre": "Carlos",
    "apellido": "Zelaya",
    "genero": "Hombre",
    "dni": "123456789",
    "fechaNacimiento": "08-03-1990",
    "telefono": "123456789",
    "email": "carlos@test.com",
    "direccion": "Av. Roca 1600"
}

// Consultas
const consultaDePrueba = {
    "idPaciente": "",
    "fecha": "2025-09-05",
    "motivoConsulta": "Dolor de cabeza",
    "diagnostico": "Estres",
    "tratamiento": "Pastillas",
    "observaciones": "Tratamiento de 15 dias",
    "parametros": [
        {
            "nombre": "Presion",
            "valor": "60"
        },
        {
            "nombre": "BPM",
            "valor": "103"
        }
    ]
}

module.exports = {
    usuarioPasswordErronea,
    usuarioCorrecto,
    pacienteDePrueba,
    consultaDePrueba
}