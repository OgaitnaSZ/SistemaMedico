const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Paciente = require("../models/Paciente");
let JWT_TOKEN = "";
const { pacienteDePrueba, usuarioCorrecto } = require("./helper/helperData");

const newPaciente = () => ({ ...pacienteDePrueba });
let pacienteCreado;

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    await Paciente.deleteMany();

    const response = await request(app)
        .post('/api/usuarios/login')
        .send(usuarioCorrecto);
    
    JWT_TOKEN = response.body.data.token;
})

// Crear paciente
describe("[Paciente] esta es la prueba de /api/pacientes/Crear", ()=>{

    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .post('/api/pacientes/Crear')
        .send(newPaciente());

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 201", async ()=>{
        const response = await request(app)
        .post('/api/pacientes/Crear')
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send(newPaciente());

        const { body } = response;
        expect(response.statusCode).toEqual(201);
        expect(body).toHaveProperty("paciente");

        pacienteCreado = response.body.paciente;
    })
})

// Obtener pacientes
describe("[Paciente] esta es la prueba de /api/pacientes/Pacientes", ()=>{

    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .get('/api/pacientes/Pacientes')

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .get('/api/pacientes/Pacientes')
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("data");
    })
})

// Actualizar paciente
describe("[Paciente] esta es la prueba de /api/pacientes/Actualizar", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .put('/api/pacientes/Actualizar')
        .send({ ...pacienteCreado, nombre: "Fernando" });

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login y usuario existente
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .put('/api/pacientes/Actualizar')
        .send({ ...pacienteCreado, nombre: "Fernando" })
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body.pacienteActualizado.nombre).toEqual("Fernando");
    })

    // Prueba con usuario inexistente
    test("Esto deberia retornar 404", async ()=>{
        const fakeId = new mongoose.Types.ObjectId(); // MongoID aleatorio
        
        const response = await request(app)
        .put('/api/pacientes/Actualizar')
        .send({ ...pacienteCreado, _id: fakeId.toString() })
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(404);
    })
})

// Obtener paciente por id
describe("[Paciente] esta es la prueba de /api/pacientes/Paciente/:id", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .get(`/api/pacientes/Paciente/${pacienteCreado._id}`)

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .get(`/api/pacientes/Paciente/${pacienteCreado._id}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body._id).toEqual(pacienteCreado._id);
    })

    // Prueba con usuario inexistente
    test("Esto deberia retornar 404", async ()=>{
        const fakeId = new mongoose.Types.ObjectId(); // MongoID aleatorio
        
        const response = await request(app)
        .get(`/api/pacientes/Paciente/${fakeId}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(404);
    })
})

// Eliminar paciente por id
describe("[Paciente] esta es la prueba de /api/pacientes/Eliminar/:id", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .delete(`/api/pacientes/Eliminar/${pacienteCreado._id}`)

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .delete(`/api/pacientes/Eliminar/${pacienteCreado._id}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("pacienteEliminado");
    })

    // Prueba con usuario inexistente
    test("Esto deberia retornar 404", async ()=>{
        const fakeId = new mongoose.Types.ObjectId(); // MongoID aleatorio
        
        const response = await request(app)
        .delete(`/api/pacientes/Eliminar/${fakeId}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(404);
    })
})