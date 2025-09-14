const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Consulta = require("../models/Consulta");
const Paciente = require("../models/Paciente");
let JWT_TOKEN = "";
const { usuarioCorrecto, pacienteDePrueba, consultaDePrueba } = require("./helper/helperData");

const newPaciente = () => ({ ...pacienteDePrueba });
const newConsulta = () => ({ ...consultaDePrueba });

let pacienteCreado;
let consultaBase;
let consultaCreada;

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    await Consulta.deleteMany();
    await Paciente.deleteMany();

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
})

// Crear consulta
describe("[Consulta] esta es la prueba de /api/consultas/Crear", ()=>{
    beforeAll(async () => {
        const res = await request(app)
        .post("/api/pacientes/Crear")
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send(newPaciente());
        pacienteCreado = res.body.paciente;
        consultaBase = { ...newConsulta(), idPaciente: pacienteCreado._id };
    });

    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .post('/api/consultas/Crear')
        .send(consultaBase);

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 201", async ()=>{
        const response = await request(app)
        .post('/api/consultas/Crear')
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send(consultaBase);

        const { body } = response;
        expect(response.statusCode).toEqual(201);
        expect(body).toHaveProperty("consulta");

        consultaCreada = response.body.consulta;
    })
})

// Obtener consultas de un paciente
describe("[Consulta] esta es la prueba de /api/consultas/Paciente/{id}", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .get(`/api/consultas/Paciente/${pacienteCreado._id}`)

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .get(`/api/consultas/Paciente/${pacienteCreado._id}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("consultas");
        expect(Array.isArray(response.body.consultas)).toBe(true);
        expect(response.body.consultas.length).toBeGreaterThan(0);
        const consulta = response.body.consultas[0];
        expect(consulta).toHaveProperty("_id");
        expect(consulta).toHaveProperty("idPaciente", pacienteCreado._id);
    })

    // Prueba con paciente inexistente
    test("Esto deberia retornar 404", async ()=>{
        const fakeId = new mongoose.Types.ObjectId(); // MongoID aleatorio
        
        const response = await request(app)
        .get(`/api/consultas/Paciente/${fakeId}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(404);
    })
})

// Actualizar consulta
describe("[Consulta] esta es la prueba de /api/consultas/Actualizar", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .put('/api/consultas/Actualizar')
        .send({ ...consultaCreada, motivoConsulta: "Dolor de cuello" })

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login y consulta existente
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .put('/api/consultas/Actualizar')
        .send({ ...consultaCreada, motivoConsulta: "Dolor de cuello" })
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.consultaActualizada.motivoConsulta).toEqual("Dolor de cuello");
        expect(response.body.consultaActualizada._id).toEqual(consultaCreada._id);
    })

    // Prueba con consulta inexistente
    test("Esto deberia retornar 404", async ()=>{
        const fakeId = new mongoose.Types.ObjectId(); // MongoID aleatorio
        
        const response = await request(app)
        .put('/api/consultas/Actualizar')
        .send({ ...consultaCreada, _id: fakeId.toString() })
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(404);
    })
})

// Eliminar consulta por id
describe("[Consulta] esta es la prueba de /api/consultas/Eliminar/:id", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .delete(`/api/consultas/Eliminar/${consultaCreada._id}`)

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .delete(`/api/consultas/Eliminar/${consultaCreada._id}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("message");
    })

    // Prueba con consulta inexistente
    test("Esto deberia retornar 404", async ()=>{
        const fakeId = new mongoose.Types.ObjectId(); // MongoID aleatorio
        
        const response = await request(app)
        .delete(`/api/consultas/Eliminar/${fakeId}`)
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(404);
    })
})