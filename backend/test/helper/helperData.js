// Usuarios
const usuarioLogin = {
    "usuario": "admin",
    "password": "admin"
}
const usuarioUpdate = {
    "nombre": "santiago",
    "usuario": "admin",
    "password": "admin"
}

// Pacientes
const pacienteDePrueba = {
    "nombre": "Carlos",
    "apellido": "Zelaya",
    "genero": "Hombre",
    "dni": "12345678",
    "fechaNacimiento": "08-03-1990",
    "telefono": "123456789",
    "email": "carlos@test.com",
    "direccion": "Av. Roca 1600"
}
const pacientesDePrueba = [
    {
        "nombre": "Carlos",
        "apellido": "Zelaya",
        "genero": "Hombre",
        "dni": "12345678",
        "fechaNacimiento": "08-03-1990",
        "telefono": "123456789",
        "email": "carlos@test.com",
        "direccion": "Av. Roca 1600"
    },
    {
        "nombre": "Santiago",
        "apellido": "Zelaya",
        "genero": "Hombre",
        "dni": "12345678",
        "fechaNacimiento": "09-10-2002",
        "telefono": "412321321",
        "email": "santiago@test.com",
        "direccion": "Av. Roca 1600"
    }
]

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
    usuarioLogin,
    usuarioUpdate,
    pacienteDePrueba,
    pacientesDePrueba,
    consultaDePrueba
}