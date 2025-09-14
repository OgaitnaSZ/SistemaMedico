const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Consulta = require("../models/Consulta");
const Paciente = require("../models/Paciente");
const Archivo = require("../models/Archivo");
let JWT_TOKEN = "";
const filePath = `${__dirname}/dump/mañaná es---lunes.png`;
const { usuarioCorrecto, pacienteDePrueba, consultaDePrueba } = require("./helper/helperData");

const newPaciente = () => ({ ...pacienteDePrueba });
const newConsulta = () => ({ ...consultaDePrueba });

let pacienteCreado;
let consultaCreada;
let archivoCreado;

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    await Paciente.deleteMany();
    await Consulta.deleteMany();
    await Archivo.deleteMany();

    const response = await request(app)
        .post('/api/usuarios/login')
        .send(usuarioCorrecto);
    
    JWT_TOKEN = response.body.data.token;

    // Crear paciente
    const pacienteRes = await request(app)
        .post("/api/pacientes/Crear")
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send(newPaciente());

    pacienteCreado = pacienteRes.body.paciente;

    // Crear consulta
    const consultaPayload = { 
        ...newConsulta(), 
        idPaciente: pacienteCreado._id 
    };

    const consultaRes = await request(app)
        .post("/api/consultas/Crear")
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send(consultaPayload);

    consultaCreada = consultaRes.body.consulta;
})

// Subir archivo
describe("[Archivo] esta es la prueba de /api/archivos/Subir", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .post('/api/archivos/Subir')
        .field("idConsulta", consultaCreada._id)
        // .attach("archivos", filePath); Problema con node

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 201", async ()=>{
        const response = await request(app)
        .post('/api/archivos/Subir')
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .field("idConsulta", consultaCreada._id)
        .attach("archivos", filePath);

        expect(response.statusCode).toEqual(201);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data[0]).toHaveProperty("name");
        expect(response.body.data[0].idConsulta).toEqual(consultaCreada._id);

        archivoCreado = response.body.data[0];
    })
})

// Obtener archivos de una consulta
describe("[Archivo] esta es la prueba de /api/archivos/Consulta/{id}", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .get(`/api/archivos/Consulta/${consultaCreada._id}`);

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .get(`/api/archivos/Consulta/${consultaCreada._id}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty("_id");
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0].idConsulta).toEqual(consultaCreada._id);
    })

    // Prueba con consulta inexistente
    test("Esto deberia retornar 404", async ()=>{
        const fakeId = new mongoose.Types.ObjectId(); // MongoID aleatorio
        
        const response = await request(app)
        .get(`/api/archivos/Consulta/${fakeId}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(404);
    })
})

// Eliminar archivo por id
describe("[Archivo] esta es la prueba de /api/archivo/Eliminar/:id", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .delete(`/api/archivos/Eliminar/${archivoCreado._id}`)

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .delete(`/api/archivos/Eliminar/${archivoCreado._id}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("filePath");
    })

    // Prueba con archivo inexistente
    test("Esto deberia retornar 404", async ()=>{
        const fakeId = new mongoose.Types.ObjectId(); // MongoID aleatorio
        
        const response = await request(app)
        .delete(`/api/archivos/Eliminar/${fakeId}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(404);
    })
})