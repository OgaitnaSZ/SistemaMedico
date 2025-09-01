const swaggerJsdoc = require("swagger-jsdoc");

/**
 * API Config Info
 */
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Documentacion de API de Sistema Medico UI",
        version: "1.0.1"
    },
    servers:[
        {
            url: "http://localhost:4000/api"
        }
    ],
    components:{
        securitySchemes:{
            bearerAuth:{
                type:"http",
                scheme:"bearer",
                bearerFormat: "JWT"
            }
        },
        schemas:{
            usuarioLogin:{
                type:"object",
                required:["usuario", "password"],
                properties:{
                    usuario:{
                        type:"string"
                    },
                    password:{
                        type:"string"
                    }
                }
            },
            usuarioUpdate:{
                type:"object",
                required:["nombre", "user", "password"],
                properties:{
                    nombre:{
                        type:"string"
                    },
                    user:{
                        type:"string"
                    },
                    password:{
                        type:"string"
                    }
                }
            },
            paciente:{
                type:"object",
                required:["nombre", "apellido", "dni"],
                properties:{
                    _id:{
                        type: "string"
                    },
                    nombre: {
                        type: "string"
                    },
                    apellido: {
                        type: "string"
                    },
                    genero: {
                        type: "string"
                    },
                    dni: {
                        type: "string"
                    },
                    fechaNacimiento:{
                        type:"string",
                        format: "date"
                    },
                    telefono:{
                        type:"string"
                    },
                    email:{
                        type:"string"
                    },
                    direccion:{
                        type:"string"
                    },
                    ultima_visita: {
                        type:"string",
                        format: "date"
                    },
                    createdAt:{
                        type:"string",
                        format: "date"
                    }
                }
            },
            pacienteNew:{
                type:"object",
                required:["nombre", "apellido", "dni"],
                properties:{
                    nombre: {
                        type: "string"
                    },
                    apellido: {
                        type: "string"
                    },
                    genero: {
                        type: "string"
                    },
                    dni: {
                        type: "string"
                    },
                    fechaNacimiento:{
                        type:"string",
                        format: "date"
                    },
                    telefono:{
                        type:"string"
                    },
                    email:{
                        type:"string"
                    },
                    direccion:{
                        type:"string"
                    }
                }
            },
            pacienteUpdate:{
                type:"object",
                required:["_id", "nombre", "apellido", "dni"],
                properties:{
                    _id:{
                        type: "string"
                    },
                    nombre: {
                        type: "string"
                    },
                    apellido: {
                        type: "string"
                    },
                    genero: {
                        type: "string"
                    },
                    dni: {
                        type: "string"
                    },
                    fechaNacimiento:{
                        type:"string",
                        format: "date"
                    },
                    telefono:{
                        type:"string"
                    },
                    email:{
                        type:"string"
                    },
                    direccion:{
                        type:"string"
                    }
                }
            },
            consulta:{
                type:"object",
                required:["idPaciente", "fecha", "motivoConsulta"],
                properties:{
                    _id:{
                        type:"string"
                    },
                    idPaciente: {
                        type: "string"
                    },
                    fecha: {
                        type:"string",
                        format: "date"
                    },
                    motivoConsulta: {
                        type:"string"
                    },
                    diagnostico: {
                        type:"string"
                    },
                    tratamiento: {
                        type:"string"
                    },
                    observaciones: {
                        type:"string"
                    },
                    parametros: {
                        type: "array",
                        items:{
                            type: "object",
                            required:["nombre", "valor"],
                            properties:{
                                nombre: {
                                    type: "string"
                                },
                                valor: {
                                    type: "string"
                                }
                            }

                        }
                    }
                }
            },
            consultaNew:{
                type:"object",
                required:["idPaciente", "fecha", "motivoConsulta"],
                properties:{
                    idPaciente: {
                        type: "string"
                    },
                    fecha: {
                        type:"string",
                        format: "date"
                    },
                    motivoConsulta: {
                        type:"string"
                    },
                    diagnostico: {
                        type:"string"
                    },
                    tratamiento: {
                        type:"string"
                    },
                    observaciones: {
                        type:"string"
                    },
                    parametros: {
                        type: "array",
                        items:{
                            type: "object",
                            required:["nombre", "valor"],
                            properties:{
                                nombre: {
                                    type: "string"
                                },
                                valor: {
                                    type: "string"
                                }
                            }

                        }
                    }
                }
            },
            consultaUpdate:{
                type:"object",
                required:["idPaciente", "fecha", "motivoConsulta"],
                properties:{
                    _id:{
                        type:"string"
                    },
                    fecha: {
                        type:"string",
                        format: "date"
                    },
                    motivoConsulta: {
                        type:"string"
                    },
                    diagnostico: {
                        type:"string"
                    },
                    tratamiento: {
                        type:"string"
                    },
                    observaciones: {
                        type:"string"
                    },
                    parametros: {
                        type: "array",
                        items:{
                            type: "object",
                            required:["nombre", "valor"],
                            properties:{
                                nombre: {
                                    type: "string"
                                },
                                valor: {
                                    type: "string"
                                }
                            }

                        }
                    }
                }
            }
        }
    },
}

/**
 * Opciones
 */
const options = {
    swaggerDefinition,
    apis:[
        "./routes/*.js"
    ]
}

const openApiConfiguration = swaggerJsdoc(options);

module.exports = openApiConfiguration;